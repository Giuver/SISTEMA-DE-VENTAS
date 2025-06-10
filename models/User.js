const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Por favor ingrese un email válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: 6,
        select: false
    },
    rol: {
        type: String,
        enum: ['administrador', 'vendedor', 'supervisor'],
        default: 'vendedor'
    },
    activo: {
        type: Boolean,
        default: true
    },
    ventas: {
        type: Number,
        default: 0
    },
    montoTotal: {
        type: Number,
        default: 0
    },
    ultimoAcceso: {
        type: Date
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Método para comparar contraseñas
userSchema.methods.compararPassword = async function (passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

module.exports = mongoose.model('User', userSchema); 