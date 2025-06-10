const Category = require('../models/Category');
const ProductCatalog = require('../models/ProductCatalog');

// Crear categoría
exports.createCategory = async (req, res) => {
    try {
        const category = await Category.create({ nombre: req.body.nombre });
        res.status(201).json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al crear categoría', error: error.message });
    }
};

// Obtener todas las categorías
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al obtener categorías', error: error.message });
    }
};

// Eliminar categoría
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        // Opcional: eliminar productos de catálogo asociados
        await ProductCatalog.deleteMany({ categoria: req.params.id });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al eliminar categoría', error: error.message });
    }
};

// Agregar producto al catálogo de una categoría
exports.addProductToCategory = async (req, res) => {
    try {
        const { nombre, precio, proveedor } = req.body;
        const categoria = req.params.id;
        const product = await ProductCatalog.create({ nombre, precio, proveedor, categoria });
        res.status(201).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al agregar producto', error: error.message });
    }
};

// Obtener productos de una categoría
exports.getProductsByCategory = async (req, res) => {
    try {
        const products = await ProductCatalog.find({ categoria: req.params.id });
        res.status(200).json({ success: true, data: products });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al obtener productos', error: error.message });
    }
};

// Eliminar producto del catálogo
exports.deleteProductFromCategory = async (req, res) => {
    try {
        await ProductCatalog.findByIdAndDelete(req.params.productId);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al eliminar producto', error: error.message });
    }
}; 