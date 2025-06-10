const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generar JWT
const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'tu_secreto_jwt', {
        expiresIn: '30d'
    });
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const usuario = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!usuario) {
            return res.status(401).json({
                success: false,
                mensaje: 'Credenciales inválidas'
            });
        }

        // Verificar contraseña
        const passwordCorrecto = await usuario.compararPassword(password);
        if (!passwordCorrecto) {
            return res.status(401).json({
                success: false,
                mensaje: 'Credenciales inválidas'
            });
        }

        // Actualizar último acceso
        usuario.ultimoAcceso = new Date();
        await usuario.save();

        // Generar token
        const token = generarToken(usuario._id);

        res.status(200).json({
            success: true,
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error en el servidor',
            error: error.message
        });
    }
};

// Registro
exports.registro = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await User.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                mensaje: 'El email ya está registrado'
            });
        }

        // Crear nuevo usuario
        const usuario = await User.create({
            nombre,
            email,
            password,
            rol: rol || 'vendedor'
        });

        // Generar token
        const token = generarToken(usuario._id);

        res.status(201).json({
            success: true,
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error en el servidor',
            error: error.message
        });
    }
}; 