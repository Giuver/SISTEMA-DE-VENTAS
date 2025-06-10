const Product = require('../models/Product');

// Obtener todos los productos
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al obtener productos', error: error.message });
    }
};

// Obtener un producto
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, mensaje: 'Producto no encontrado' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al obtener producto', error: error.message });
    }
};

// Crear producto
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al crear producto', error: error.message });
    }
};

// Actualizar producto
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ success: false, mensaje: 'Producto no encontrado' });
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al actualizar producto', error: error.message });
    }
};

// Eliminar producto
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, mensaje: 'Producto no encontrado' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al eliminar producto', error: error.message });
    }
};

// Resumen de inventario
exports.getResumen = async (req, res) => {
    try {
        const products = await Product.find();
        const totalProductos = products.length;
        const valorTotal = products.reduce((acc, p) => acc + (p.precio * p.stock), 0);
        const stockBajo = products.filter(p => p.stock <= p.stockMinimo).length;
        const categorias = [...new Set(products.map(p => p.categoria))];
        res.status(200).json({
            success: true,
            data: {
                totalProductos,
                valorTotal,
                stockBajo,
                categorias: categorias.length
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al obtener resumen', error: error.message });
    }
}; 