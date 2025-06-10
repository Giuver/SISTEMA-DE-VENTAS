const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getResumen
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/auth');

// Proteger todas las rutas
router.use(protect);

// Resumen de inventario
router.get('/resumen', authorize('administrador', 'vendedor'), getResumen);

// CRUD de productos
router.route('/')
    .get(authorize('administrador', 'vendedor'), getProducts)
    .post(authorize('administrador'), createProduct);

router.route('/:id')
    .get(authorize('administrador', 'vendedor'), getProduct)
    .put(authorize('administrador'), updateProduct)
    .delete(authorize('administrador'), deleteProduct);

module.exports = router; 