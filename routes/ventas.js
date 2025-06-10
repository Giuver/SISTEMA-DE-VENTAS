const express = require('express');
const router = express.Router();
const {
    getVentas,
    getVenta,
    createVenta,
    updateVenta,
    deleteVenta,
    getResumen,
    getVentasPorMes,
    getVentasPorCategoria
} = require('../controllers/ventaController');
const { protect, authorize } = require('../middleware/auth');

// Proteger todas las rutas para administrador y vendedor
router.use(protect, authorize('administrador', 'vendedor'));

router.route('/')
    .get(getVentas)
    .post(createVenta);

router.route('/resumen')
    .get(getResumen);

router.route('/por-mes')
    .get(getVentasPorMes);

router.route('/por-categoria')
    .get(getVentasPorCategoria);

router.route('/:id')
    .get(getVenta)
    .put(updateVenta)
    .delete(deleteVenta);

module.exports = router; 