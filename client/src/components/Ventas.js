import React, { useEffect, useState } from 'react';
import {
    Box, Grid, Typography, Paper, Button, TextField, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton, Snackbar, Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Select, InputLabel, FormControl, Autocomplete
} from '@mui/material';
import { Add, Search, Edit, Delete, Visibility, FilterList } from '@mui/icons-material';
import ventaService from '../services/ventaService';
import userService from '../services/userService';
import productService from '../services/productService';
import authService from '../services/authService';
import { useToast } from './ToastNotification';
import { TableSkeleton, LoadingSpinner } from './LazyLoader';
import ConfirmDialog from './ConfirmDialog';

const estados = [
    { value: '', label: 'Todos los estados' },
    { value: 'completada', label: 'Completada', color: 'success' },
    { value: 'pendiente', label: 'Pendiente', color: 'warning' },
    { value: 'cancelada', label: 'Cancelada', color: 'error' }
];

const metodosPago = [
    { value: 'efectivo', label: 'Efectivo' },
    { value: 'tarjeta', label: 'Tarjeta' },
    { value: 'transferencia', label: 'Transferencia' }
];

const VentaModal = ({ open, onClose, onSave, initialData, vendedores }) => {
    const usuarioActual = authService.getCurrentUser()?.usuario;
    const { error: showError } = useToast();
    const [form, setForm] = useState({ cliente: '', vendedor: usuarioActual?.id || '', productos: [], total: 0, estado: 'completada', metodoPago: '' });
    const [error, setError] = useState('');
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [cantidad, setCantidad] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) setForm({ ...initialData });
        else setForm({ cliente: '', vendedor: usuarioActual?.id || '', productos: [], total: 0, estado: 'completada', metodoPago: '' });
        setProductoSeleccionado(null);
        setCantidad(1);
        setError('');
        cargarProductos();
    }, [open, initialData, usuarioActual?.id]);

    const cargarProductos = async () => {
        try {
            setLoading(true);
            const data = await productService.getAll();
            setProductos(data.filter(p => p.stock > 0));
        } catch (err) {
            showError('Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleAgregarProducto = () => {
        if (!productoSeleccionado || !cantidad) return;
        const yaEnCarrito = form.productos.find(p => p.producto === productoSeleccionado.nombre);
        if (yaEnCarrito) {
            setError('El producto ya está en el carrito');
            return;
        }
        if (cantidad > productoSeleccionado.stock) {
            setError('Cantidad mayor al stock disponible');
            return;
        }
        const nuevoProducto = {
            producto: productoSeleccionado.nombre,
            cantidad: cantidad,
            precio: productoSeleccionado.precio,
            stockDisponible: productoSeleccionado.stock
        };
        const nuevosProductos = [...form.productos, nuevoProducto];
        setForm(f => ({ ...f, productos: nuevosProductos, total: calcularTotal(nuevosProductos) }));
        setProductoSeleccionado(null);
        setCantidad(1);
        setError('');
    };

    const handleEliminarProducto = (i) => {
        const nuevosProductos = form.productos.filter((_, idx) => idx !== i);
        setForm(f => ({ ...f, productos: nuevosProductos, total: calcularTotal(nuevosProductos) }));
    };

    const calcularTotal = (productos) => {
        return productos.reduce((acc, p) => acc + (parseFloat(p.precio) * parseInt(p.cantidad)), 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.vendedor || !form.productos.length || form.productos.some(p => !p.producto || !p.cantidad || !p.precio) || !form.metodoPago) {
            setError('Todos los campos son obligatorios');
            return;
        }
        // Validar stock disponible
        const stockInsuficiente = form.productos.some(p => p.cantidad > p.stockDisponible);
        if (stockInsuficiente) {
            setError('Hay productos con stock insuficiente');
            return;
        }
        setError('');
        onSave({ ...form, vendedor: usuarioActual?.id, cliente: form.cliente || undefined });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
                <LoadingSpinner message="Cargando productos..." />
            </Box>
        );
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{initialData ? 'Editar Venta' : 'Nueva Venta'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="h5" fontWeight={700}>Carrito de Compra</Typography>
                        <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
                            <Grid item xs={12} md={6}>
                                <Autocomplete
                                    options={productos}
                                    getOptionLabel={option => option.nombre}
                                    value={productoSeleccionado}
                                    onChange={(_, newValue) => setProductoSeleccionado(newValue)}
                                    renderInput={params => <TextField {...params} label="Seleccionar producto" fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <TextField
                                    label="Cantidad"
                                    type="number"
                                    value={cantidad}
                                    onChange={e => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                                    inputProps={{ min: 1, max: productoSeleccionado?.stock || 1 }}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={6} md={2}>
                                <TextField
                                    label="Precio"
                                    value={productoSeleccionado ? productoSeleccionado.precio : ''}
                                    fullWidth
                                    disabled
                                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                />
                            </Grid>
                            <Grid item xs={12} md={2}>
                                <Button variant="contained" color="primary" fullWidth sx={{ height: '100%' }} onClick={handleAgregarProducto} disabled={!productoSeleccionado}>
                                    Agregar
                                </Button>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 3, mb: 2, minHeight: 120, border: '1px solid #eee', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                            {form.productos.length === 0 ? (
                                <>
                                    <Typography align="center" color="text.secondary" sx={{ mt: 2 }}>
                                        <span style={{ fontSize: 48, color: '#b0b0b0' }}>🛒</span><br />
                                        El carrito está vacío<br />
                                        Agregue productos para iniciar una venta
                                    </Typography>
                                </>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Producto</TableCell>
                                                <TableCell>Cantidad</TableCell>
                                                <TableCell>Precio</TableCell>
                                                <TableCell>Subtotal</TableCell>
                                                <TableCell></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {form.productos.map((p, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>{p.producto}</TableCell>
                                                    <TableCell>{p.cantidad}</TableCell>
                                                    <TableCell>${p.precio.toFixed(2)}</TableCell>
                                                    <TableCell>${(p.precio * p.cantidad).toFixed(2)}</TableCell>
                                                    <TableCell>
                                                        <Button color="error" onClick={() => handleEliminarProducto(i)}>Eliminar</Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                            <Typography variant="h6">Total: ${form.total.toFixed(2)}</Typography>
                        </Box>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField label="Cliente" name="cliente" value={form.cliente} onChange={handleChange} fullWidth placeholder="Nombre del cliente (opcional)" />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField label="Vendedor" name="vendedor" value={usuarioActual?.nombre || ''} fullWidth disabled />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Método de Pago</InputLabel>
                                <Select name="metodoPago" value={form.metodoPago} label="Método de Pago" onChange={handleChange}>
                                    {metodosPago.map(m => <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Estado</InputLabel>
                                <Select name="estado" value={form.estado} label="Estado" onChange={handleChange}>
                                    {estados.filter(e => e.value).map(e => <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            {error}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button type="submit" variant="contained" color="primary">
                        {initialData ? 'Guardar' : 'Completar Venta'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

const Ventas = () => {
    const { success, error, info } = useToast();
    const [ventas, setVentas] = useState([]);
    const [resumen, setResumen] = useState({ ventasHoy: 0, transaccionesHoy: 0, promedio: 0, topVendedor: null });
    const [busqueda, setBusqueda] = useState('');
    const [estadoFiltro, setEstadoFiltro] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [vendedores, setVendedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, venta: null });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            setLoading(true);
            await Promise.all([
                cargarVentas(),
                cargarResumen(),
                cargarVendedores()
            ]);
        } catch (err) {
            error('Error al cargar datos iniciales');
        } finally {
            setLoading(false);
        }
    };

    const cargarVentas = async () => {
        try {
            const data = await ventaService.getAll();
            setVentas(data);
        } catch (err) {
            error('Error al cargar ventas');
        }
    };

    const cargarResumen = async () => {
        try {
            const data = await ventaService.getResumen();
            setResumen(data);
        } catch (err) {
            error('Error al cargar resumen');
        }
    };

    const cargarVendedores = async () => {
        try {
            const data = await userService.getAll();
            setVendedores(data.filter(u => u.rol === 'vendedor'));
        } catch (err) {
            error('Error al cargar vendedores');
        }
    };

    const handleBuscar = e => setBusqueda(e.target.value);
    const handleEstadoFiltro = e => setEstadoFiltro(e.target.value);

    const handleLimpiarFiltros = () => {
        setBusqueda('');
        setEstadoFiltro('');
        info('Filtros limpiados');
    };

    const ventasFiltradas = ventas.filter(v =>
        (estadoFiltro ? v.estado === estadoFiltro : true) &&
        (
            v.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
            (v.cliente && v.cliente.toLowerCase().includes(busqueda.toLowerCase())) ||
            (v.vendedor && v.vendedor.nombre.toLowerCase().includes(busqueda.toLowerCase()))
        )
    );

    const handleOpenAdd = () => {
        setModalData(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (venta) => {
        setModalData(venta);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveVenta = async (data) => {
        try {
            if (modalData) {
                await ventaService.update(modalData._id, data);
                success('Venta actualizada exitosamente');
            } else {
                await ventaService.create(data);
                success('Venta registrada exitosamente');
            }
            setModalOpen(false);
            await cargarDatos();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al guardar venta';
            error(errorMessage);
        }
    };

    const handleOpenDelete = (venta) => {
        setDeleteDialog({ open: true, venta });
    };

    const handleConfirmDelete = async () => {
        try {
            await ventaService.remove(deleteDialog.venta._id);
            success('Venta eliminada exitosamente');
            setDeleteDialog({ open: false, venta: null });
            await cargarDatos();
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al eliminar venta';
            error(errorMessage);
        }
    };

    const handleCloseDeleteDialog = () => {
        setDeleteDialog({ open: false, venta: null });
    };

    if (loading) {
        return (
            <Box sx={{ p: 2 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    Gestión de Ventas
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    Administra todas las transacciones de venta
                </Typography>
                <TableSkeleton rows={8} columns={7} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Gestión de Ventas
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Administra todas las transacciones de venta
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Buscar por cliente, ID de venta o vendedor..."
                            value={busqueda}
                            onChange={handleBuscar}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Estado</InputLabel>
                            <Select value={estadoFiltro} label="Estado" onChange={handleEstadoFiltro}>
                                {estados.map(e => <MenuItem key={e.value} value={e.value}>{e.label}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<FilterList />}
                            onClick={handleLimpiarFiltros}
                        >
                            Limpiar filtros
                        </Button>
                    </Grid>
                    <Grid item xs={12} md={3} textAlign={{ xs: 'left', md: 'right' }}>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={handleOpenAdd}
                            sx={{ minWidth: 180 }}
                        >
                            Nueva Venta
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Lista de Ventas
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Venta</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Vendedor</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Productos</TableCell>
                                <TableCell>Total</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {ventasFiltradas.map(v => (
                                <TableRow key={v._id}>
                                    <TableCell>
                                        <Typography fontWeight={600}>{v.codigo}</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(v.fecha).toLocaleTimeString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{v.cliente}</TableCell>
                                    <TableCell>{v.vendedor?.nombre}</TableCell>
                                    <TableCell>{new Date(v.fecha).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Typography>{v.productos.length} items</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {v.productos.map(p => p.producto).join(', ')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography fontWeight={600}>${v.total.toFixed(2)}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={estados.find(e => e.value === v.estado)?.label}
                                            color={estados.find(e => e.value === v.estado)?.color}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={() => alert('Ver venta no implementado')}
                                            title="Ver detalles"
                                        >
                                            <Visibility />
                                        </IconButton>
                                        <IconButton
                                            color="secondary"
                                            size="small"
                                            onClick={() => handleOpenEdit(v)}
                                            title="Editar venta"
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => handleOpenDelete(v)}
                                            title="Eliminar venta"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2">Ventas de Hoy</Typography>
                        <Typography variant="h5" fontWeight={700}>${resumen.ventasHoy?.toFixed(2) || '0.00'}</Typography>
                        <Typography variant="caption" color="text.secondary">{resumen.transaccionesHoy} transacciones</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2">Promedio por Venta</Typography>
                        <Typography variant="h5" fontWeight={700}>${resumen.promedio?.toFixed(2) || '0.00'}</Typography>
                        <Typography variant="caption" color="text.secondary">Basado en ventas de hoy</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="subtitle2">Top Vendedor</Typography>
                        <Typography variant="h6" fontWeight={700}>{resumen.topVendedor?.nombre || '-'}</Typography>
                        <Typography variant="caption" color="text.secondary">${resumen.topVendedor?.monto?.toFixed(2) || '0.00'} en ventas</Typography>
                    </Paper>
                </Grid>
            </Grid>
            <VentaModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveVenta}
                initialData={modalData}
                vendedores={vendedores}
            />
            <ConfirmDialog
                open={deleteDialog.open}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                title="Confirmar Eliminación"
                content={`¿Estás seguro de que quieres eliminar esta venta? Esta acción no se puede deshacer.`}
            />
        </Box>
    );
};

export default Ventas; 