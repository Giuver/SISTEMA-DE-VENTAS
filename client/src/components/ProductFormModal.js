import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    MenuItem,
    Select,
    InputLabel,
    FormControl
} from '@mui/material';
import categoryService from '../services/categoryService';

const initialState = {
    categoria: '',
    productoBase: '',
    nombre: '',
    sku: '',
    precio: '',
    proveedor: '',
    stock: '',
    stockMinimo: ''
};

const ProductFormModal = ({ open, onClose, onSave, initialData }) => {
    const [form, setForm] = useState(initialState);
    const [error, setError] = useState('');
    const [categorias, setCategorias] = useState([]);
    const [productosBase, setProductosBase] = useState([]);
    const [loadingProductos, setLoadingProductos] = useState(false);

    useEffect(() => {
        if (open && !initialData) {
            cargarCategorias();
        }
        if (initialData) {
            setForm({ ...initialData });
        } else {
            setForm(initialState);
        }
        setError('');
    }, [open, initialData]);

    const cargarCategorias = async () => {
        try {
            const data = await categoryService.getAll();
            setCategorias(data);
        } catch { }
    };

    const cargarProductosBase = async (categoriaId) => {
        setLoadingProductos(true);
        try {
            const data = await categoryService.getProducts(categoriaId);
            setProductosBase(data);
        } catch {
            setProductosBase([]);
        } finally {
            setLoadingProductos(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleCategoriaChange = async (e) => {
        setForm({ ...form, categoria: e.target.value, productoBase: '', nombre: '', sku: '', precio: '', proveedor: '' });
        await cargarProductosBase(e.target.value);
    };

    const handleProductoBaseChange = (e) => {
        const prod = productosBase.find(p => p._id === e.target.value);
        if (prod) {
            setForm({
                ...form,
                productoBase: prod._id,
                nombre: prod.nombre,
                sku: prod.sku,
                precio: prod.precio,
                proveedor: prod.proveedor
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.categoria || !form.productoBase || !form.stock || !form.stockMinimo) {
            setError('Todos los campos son obligatorios');
            return;
        }
        if (isNaN(form.stock) || isNaN(form.stockMinimo)) {
            setError('Stock y stock mínimo deben ser números');
            return;
        }
        setError('');
        onSave({
            nombre: form.nombre,
            sku: form.sku,
            categoria: form.categoria,
            precio: form.precio,
            proveedor: form.proveedor,
            stock: parseInt(form.stock),
            stockMinimo: parseInt(form.stockMinimo)
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{initialData ? 'Editar Producto' : 'Agregar Producto'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {!initialData && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required>
                                    <InputLabel>Categoría</InputLabel>
                                    <Select
                                        name="categoria"
                                        value={form.categoria}
                                        label="Categoría"
                                        onChange={handleCategoriaChange}
                                    >
                                        <MenuItem value="">Selecciona una categoría</MenuItem>
                                        {categorias.map(cat => (
                                            <MenuItem key={cat._id} value={cat._id}>{cat.nombre}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth required disabled={!form.categoria || loadingProductos}>
                                    <InputLabel>Producto</InputLabel>
                                    <Select
                                        name="productoBase"
                                        value={form.productoBase}
                                        label="Producto"
                                        onChange={handleProductoBaseChange}
                                    >
                                        <MenuItem value="">Selecciona un producto</MenuItem>
                                        {productosBase.map(prod => (
                                            <MenuItem key={prod._id} value={prod._id}>{prod.nombre}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>
                    )}
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="SKU"
                                name="sku"
                                value={form.sku}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Proveedor"
                                name="proveedor"
                                value={form.proveedor}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                label="Precio"
                                name="precio"
                                value={form.precio}
                                fullWidth
                                disabled
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Stock"
                                name="stock"
                                value={form.stock}
                                onChange={handleChange}
                                fullWidth
                                required
                                type="number"
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <TextField
                                label="Stock Mínimo"
                                name="stockMinimo"
                                value={form.stockMinimo}
                                onChange={handleChange}
                                fullWidth
                                required
                                type="number"
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                    </Grid>
                    {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancelar
                    </Button>
                    <Button type="submit" variant="contained" color="primary">
                        {initialData ? 'Guardar Cambios' : 'Agregar'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default ProductFormModal; 