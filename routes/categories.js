const express = require('express');
const router = express.Router();
const {
    createCategory,
    getCategories,
    deleteCategory,
    addProductToCategory,
    getProductsByCategory,
    deleteProductFromCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/auth');

// Proteger todas las rutas y solo permitir administrador
router.use(protect, authorize('administrador'));

router.route('/')
    .post(createCategory)
    .get(getCategories);

router.route('/:id')
    .delete(deleteCategory);

// Productos de catálogo por categoría
router.route('/:id/productos')
    .post(addProductToCategory)
    .get(getProductsByCategory);

router.route('/:id/productos/:productId')
    .delete(deleteProductFromCategory);

module.exports = router; 