const User = require('../models/User');

// Obtener todos los usuarios
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener usuarios',
            error: error.message
        });
    }
};

// Obtener un usuario
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                mensaje: 'Usuario no encontrado'
            });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al obtener usuario',
            error: error.message
        });
    }
};

// Crear usuario
exports.createUser = async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                nombre: user.nombre,
                email: user.email,
                rol: user.rol
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al crear usuario',
            error: error.message
        });
    }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
    try {
        const camposPermitidos = ['nombre', 'email', 'rol', 'activo', 'ventas', 'montoTotal', 'ultimoAcceso'];
        const updateData = {};
        camposPermitidos.forEach(campo => {
            if (req.body[campo] !== undefined) updateData[campo] = req.body[campo];
        });
        if (req.body.password) updateData.password = req.body.password;
        const user = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al actualizar usuario',
            error: error.message
        });
    }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                mensaje: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error al eliminar usuario',
            error: error.message
        });
    }
}; 