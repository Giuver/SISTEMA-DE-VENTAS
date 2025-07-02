import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Grid
} from '@mui/material';
import { Add, Delete, ListAlt } from '@mui/icons-material';
import categoryService from '../services/categoryService';

const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [productos, setProductos] = useState([]);
    const [modalCat, setModalCat] = useState(false);
    const [modalProd, setModalProd] = useState(false);
    const [catNombre, setCatNombre] = useState('');
    const [prodForm, setProdForm] = useState({ nombre: '', precio: '', proveedor: '' });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        setLoading(true);
        try {
            const data = await categoryService.getAll();
            setCategorias(data);
        } catch {
            setSnackbar({ open: true, message: 'Error al cargar categorías', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const cargarProductos = async (cat) => {
        setSelectedCat(cat);
        try {
            const data = await categoryService.getProducts(cat._id);
            setProductos(data);
        } catch {
            setSnackbar({ open: true, message: 'Error al cargar productos', severity: 'error' });
        }
    };

    const handleAddCategoria = async () => {
        if (!catNombre.trim()) return;
        try {
            await categoryService.create(catNombre.trim());
            setSnackbar({ open: true, message: 'Categoría agregada', severity: 'success' });
            setModalCat(false);
            setCatNombre('');
            cargarCategorias();
        } catch {
            setSnackbar({ open: true, message: 'Error al agregar categoría', severity: 'error' });
        }
    };

    const handleDeleteCategoria = async (id) => {
        if (!window.confirm('¿Eliminar esta categoría y todos sus productos?')) return;
        try {
            await categoryService.remove(id);
            setSnackbar({ open: true, message: 'Categoría eliminada', severity: 'success' });
            setSelectedCat(null);
            cargarCategorias();
        } catch {
            setSnackbar({ open: true, message: 'Error al eliminar categoría', severity: 'error' });
        }
    };

    const handleAddProducto = async () => {
        if (!prodForm.nombre || !prodForm.precio || !prodForm.proveedor) return;
        try {
            await categoryService.addProduct(selectedCat._id, {
                nombre: prodForm.nombre,
                precio: parseFloat(prodForm.precio),
                proveedor: prodForm.proveedor
            });
            setSnackbar({ open: true, message: 'Producto agregado', severity: 'success' });
            setModalProd(false);
            setProdForm({ nombre: '', precio: '', proveedor: '' });
            cargarProductos(selectedCat);
        } catch {
            setSnackbar({ open: true, message: 'Error al agregar producto', severity: 'error' });
        }
    };

    const handleDeleteProducto = async (id) => {
        if (!window.confirm('¿Eliminar este producto del catálogo?')) return;
        try {
            await categoryService.removeProduct(selectedCat._id, id);
            setSnackbar({ open: true, message: 'Producto eliminado', severity: 'success' });
            cargarProductos(selectedCat);
        } catch {
            setSnackbar({ open: true, message: 'Error al eliminar producto', severity: 'error' });
        }
    };

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Gestión de Categorías y Catálogo de Productos
            </Typography>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6">Categorías</Typography>
                    </Grid>
                    <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'right' }}>
                        <Button variant="contained" startIcon={<Add />} onClick={() => setModalCat(true)}>
                            Agregar Categoría
                        </Button>
                    </Grid>
                </Grid>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categorias.map(cat => (
                                <TableRow key={cat._id} selected={selectedCat?._id === cat._id}>
                                    <TableCell>
                                        <Button color="inherit" onClick={() => cargarProductos(cat)} startIcon={<ListAlt />}>
                                            {cat.nombre}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <IconButton color="error" onClick={() => handleDeleteCategoria(cat._id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            {selectedCat && (
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6">Productos de "{selectedCat.nombre}"</Typography>
                        </Grid>
                        <Grid item xs={12} md={4} textAlign={{ xs: 'left', md: 'right' }}>
                            <Button variant="contained" startIcon={<Add />} onClick={() => setModalProd(true)}>
                                Agregar Producto
                            </Button>
                        </Grid>
                    </Grid>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>SKU</TableCell>
                                    <TableCell>Precio</TableCell>
                                    <TableCell>Proveedor</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productos.map(prod => (
                                    <TableRow key={prod._id}>
                                        <TableCell>{prod.nombre}</TableCell>
                                        <TableCell>{prod.sku}</TableCell>
                                        <TableCell>${prod.precio.toFixed(2)}</TableCell>
                                        <TableCell>{prod.proveedor}</TableCell>
                                        <TableCell>
                                            <IconButton color="error" onClick={() => handleDeleteProducto(prod._id)}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
            {/* Modal agregar categoría */}
            <Dialog open={modalCat} onClose={() => setModalCat(false)}>
                <DialogTitle>Agregar Categoría</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nombre de la categoría"
                        value={catNombre}
                        onChange={e => setCatNombre(e.target.value)}
                        fullWidth
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalCat(false)}>Cancelar</Button>
                    <Button onClick={handleAddCategoria} variant="contained">Agregar</Button>
                </DialogActions>
            </Dialog>
            {/* Modal agregar producto */}
            <Dialog open={modalProd} onClose={() => setModalProd(false)}>
                <DialogTitle>Agregar Producto a "{selectedCat?.nombre}"</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nombre del producto"
                        value={prodForm.nombre}
                        onChange={e => setProdForm({ ...prodForm, nombre: e.target.value })}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Precio"
                        type="number"
                        value={prodForm.precio}
                        onChange={e => setProdForm({ ...prodForm, precio: e.target.value })}
                        fullWidth
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Proveedor"
                        value={prodForm.proveedor}
                        onChange={e => setProdForm({ ...prodForm, proveedor: e.target.value })}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setModalProd(false)}>Cancelar</Button>
                    <Button onClick={handleAddProducto} variant="contained">Agregar</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                message={snackbar.message}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />
        </Box>
    );
};

export default Categorias; 