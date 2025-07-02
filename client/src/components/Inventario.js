import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Typography,
    Paper,
    Button,
    TextField,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Alert,
    IconButton,
    Tooltip,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogActions,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material';
import { Add, Search, Edit, Delete, WarningAmber, Check, ClearAll } from '@mui/icons-material';
import productService from '../services/productService';
import authService from '../services/authService';
import ProductFormModal from './ProductFormModal';
import { useTheme } from '@mui/material/styles';

const resumenDefault = {
    totalProductos: 0,
    valorTotal: 0,
    stockBajo: 0,
    categorias: 0
};

const Inventario = () => {
    const [resumen, setResumen] = useState(resumenDefault);
    const [productos, setProductos] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [stockBajoList, setStockBajoList] = useState([]);
    const user = authService.getCurrentUser();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });
    const [categoriaFiltro, setCategoriaFiltro] = useState('');
    const [proveedorFiltro, setProveedorFiltro] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [stockEdit, setStockEdit] = useState({});
    const theme = useTheme();

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const resumenData = await productService.getResumen();
            setResumen(resumenData);
            const productosData = await productService.getAll();
            setProductos(productosData);
            setStockBajoList(productosData.filter(p => p.stock <= p.stockMinimo));
            setCategorias([...new Set(productosData.map(p => p.categoria))]);
            setProveedores([...new Set(productosData.map(p => p.proveedor))]);
        } catch (err) {
            setError('Error al cargar inventario');
        } finally {
            setLoading(false);
        }
    };

    const handleBuscar = (e) => {
        setBusqueda(e.target.value);
    };

    const handleCategoriaFiltro = (e) => setCategoriaFiltro(e.target.value);
    const handleProveedorFiltro = (e) => setProveedorFiltro(e.target.value);
    const handleLimpiarFiltros = () => {
        setBusqueda('');
        setCategoriaFiltro('');
        setProveedorFiltro('');
    };

    const handleStockInputChange = (id, value) => {
        if (isNaN(value) || value < 0) return;
        setStockEdit(prev => ({ ...prev, [id]: value }));
    };
    const handleStockSave = async (id) => {
        const value = stockEdit[id];
        if (isNaN(value) || value < 0) return;
        try {
            await productService.update(id, { stock: parseInt(value) });
            setSnackbar({ open: true, message: 'Stock actualizado', severity: 'success' });
            setStockEdit(prev => { const copy = { ...prev }; delete copy[id]; return copy; });
            cargarDatos();
        } catch {
            setSnackbar({ open: true, message: 'Error al actualizar stock', severity: 'error' });
        }
    };
    const handleStockInputBlur = (id, value, original) => {
        if (value === '' || value === undefined || value === null || value === original) {
            setStockEdit(prev => { const copy = { ...prev }; delete copy[id]; return copy; });
        }
    };

    const productosFiltrados = productos.filter(p =>
        (categoriaFiltro ? p.categoria === categoriaFiltro : true) &&
        (proveedorFiltro ? p.proveedor === proveedorFiltro : true) &&
        (
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.sku.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.categoria.toLowerCase().includes(busqueda.toLowerCase())
        )
    );

    const handleOpenAdd = () => {
        setModalData(null);
        setModalOpen(true);
    };
    const handleOpenEdit = (producto) => {
        setModalData(producto);
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
    };
    const handleSaveProduct = async (data) => {
        try {
            if (modalData) {
                await productService.update(modalData._id, data);
                setSnackbar({ open: true, message: 'Producto actualizado correctamente', severity: 'success' });
            } else {
                await productService.create(data);
                setSnackbar({ open: true, message: 'Producto agregado correctamente', severity: 'success' });
            }
            setModalOpen(false);
            cargarDatos();
        } catch (err) {
            setSnackbar({ open: true, message: 'Error al guardar producto', severity: 'error' });
        }
    };
    const handleOpenDelete = (id) => {
        setDeleteDialog({ open: true, id });
    };
    const handleCloseDelete = () => {
        setDeleteDialog({ open: false, id: null });
    };
    const handleDeleteProduct = async () => {
        try {
            await productService.remove(deleteDialog.id);
            setSnackbar({ open: true, message: 'Producto eliminado correctamente', severity: 'success' });
            setDeleteDialog({ open: false, id: null });
            cargarDatos();
        } catch (err) {
            setSnackbar({ open: true, message: 'Error al eliminar producto', severity: 'error' });
        }
    };
    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Gestión de Inventario
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Administra productos y controla el stock
            </Typography>
            <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff', color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>Total Productos</Typography>
                        <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.text.primary }}>{resumen.totalProductos}</Typography>
                        <Typography variant="caption" color="text.secondary">productos registrados</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff', color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>Valor Total</Typography>
                        <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.text.primary }}>${resumen.valorTotal.toFixed(2)}</Typography>
                        <Typography variant="caption" color="text.secondary">en inventario</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1, bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff', color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>Stock Bajo</Typography>
                        {resumen.stockBajo > 0 && <WarningAmber color="warning" fontSize="small" />}
                        <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.text.primary }}>{resumen.stockBajo}</Typography>
                        <Typography variant="caption" color="text.secondary">productos con stock mínimo</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ p: 2, bgcolor: theme.palette.mode === 'dark' ? theme.palette.background.paper : '#fff', color: theme.palette.mode === 'dark' ? theme.palette.text.primary : 'inherit' }}>
                        <Typography variant="subtitle2" sx={{ color: theme.palette.text.primary }}>Categorías</Typography>
                        <Typography variant="h5" fontWeight={700} sx={{ color: theme.palette.text.primary }}>{resumen.categorias}</Typography>
                        <Typography variant="caption" color="text.secondary">categorías activas</Typography>
                    </Paper>
                </Grid>
            </Grid>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            placeholder="Buscar por nombre, SKU o categoría..."
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
                            <InputLabel>Categoría</InputLabel>
                            <Select
                                value={categoriaFiltro}
                                label="Categoría"
                                onChange={handleCategoriaFiltro}
                            >
                                <MenuItem value="">Todas</MenuItem>
                                {categorias.map(cat => (
                                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel>Proveedor</InputLabel>
                            <Select
                                value={proveedorFiltro}
                                label="Proveedor"
                                onChange={handleProveedorFiltro}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {proveedores.map(prov => (
                                    <MenuItem key={prov} value={prov}>{prov}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={2} textAlign={{ xs: 'left', md: 'right' }}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<ClearAll />}
                            sx={{ mr: 1 }}
                            onClick={handleLimpiarFiltros}
                        >
                            Limpiar filtros
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<Add />}
                            color="primary"
                            sx={{ minWidth: 180 }}
                            onClick={handleOpenAdd}
                        >
                            Agregar Producto
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
            {error && <Alert severity="error">{error}</Alert>}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                    Lista de Productos
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell>SKU</TableCell>
                                <TableCell>Categoría</TableCell>
                                <TableCell>Precio</TableCell>
                                <TableCell>Stock</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Proveedor</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productosFiltrados.map((p) => (
                                <TableRow key={p._id}>
                                    <TableCell>
                                        <Typography fontWeight={600}>{p.nombre}</Typography>
                                        <Typography variant="caption" color="text.secondary">{p.sku}</Typography>
                                    </TableCell>
                                    <TableCell>{p.sku}</TableCell>
                                    <TableCell>{p.categoria}</TableCell>
                                    <TableCell>${p.precio.toFixed(2)}</TableCell>
                                    <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <TextField
                                            value={stockEdit[p._id] !== undefined ? stockEdit[p._id] : p.stock}
                                            type="number"
                                            size="small"
                                            inputProps={{ min: 0, style: { width: 60 } }}
                                            onChange={e => handleStockInputChange(p._id, e.target.value)}
                                            onBlur={e => handleStockInputBlur(p._id, stockEdit[p._id], p.stock)}
                                        />
                                        {stockEdit[p._id] !== undefined && stockEdit[p._id] !== '' && stockEdit[p._id] !== p.stock && (
                                            <IconButton color="success" size="small" onClick={() => handleStockSave(p._id)}>
                                                <Check />
                                            </IconButton>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {p.stock <= p.stockMinimo ? (
                                            <Chip label="Stock Bajo" color="warning" size="small" />
                                        ) : (
                                            <Chip label="En Stock" color="success" size="small" />
                                        )}
                                    </TableCell>
                                    <TableCell>{p.proveedor}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Editar">
                                            <IconButton color="primary" size="small" onClick={() => handleOpenEdit(p)}>
                                                <Edit />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar">
                                            <IconButton color="error" size="small" onClick={() => handleOpenDelete(p._id)}>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            {stockBajoList.length > 0 && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                    <strong>Alerta de Stock Bajo</strong><br />
                    Los siguientes productos tienen stock por debajo del mínimo:<br />
                    {stockBajoList.map(p => (
                        <Box key={p._id} sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                            <Typography fontWeight={600}>{p.nombre}</Typography>
                            <Typography variant="caption" color="text.secondary">({p.sku})</Typography>
                            <Typography variant="caption">Stock: {p.stock} | Mínimo: {p.stockMinimo}</Typography>
                            <Button size="small" variant="outlined" color="primary">Reabastecer</Button>
                        </Box>
                    ))}
                </Alert>
            )}
            <ProductFormModal
                open={modalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveProduct}
                initialData={modalData}
            />
            <Dialog open={deleteDialog.open} onClose={handleCloseDelete}>
                <DialogTitle>¿Seguro que deseas eliminar este producto?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseDelete} color="secondary">Cancelar</Button>
                    <Button onClick={handleDeleteProduct} color="error" variant="contained">Eliminar</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
};

export default Inventario; 