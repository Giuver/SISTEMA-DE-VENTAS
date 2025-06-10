const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Proteger todas las rutas
router.use(protect);

// Rutas para administradores
router.route('/')
    .get(authorize('administrador'), getUsers)
    .post(authorize('administrador'), createUser);

router.route('/:id')
    .get(authorize('administrador'), getUser)
    .put(authorize('administrador'), updateUser)
    .delete(authorize('administrador'), deleteUser);

module.exports = router; 