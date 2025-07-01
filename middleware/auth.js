const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                mensaje: 'No autorizado para acceder a esta ruta'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt');
            req.user = { id: decoded.id, rol: decoded.rol };
            next();
        } catch (err) {
            return res.status(401).json({
                success: false,
                mensaje: 'Token inválido'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            mensaje: 'Error en el servidor',
            error: error.message
        });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({
                success: false,
                mensaje: 'No tienes permiso para realizar esta acción'
            });
        }
        next();
    };
}; 