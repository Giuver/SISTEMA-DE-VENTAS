const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    categoria: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    stockMinimo: {
        type: Number,
        required: true,
        min: 0
    },
    proveedor: {
        type: String,
        required: true
    },
    creadoEn: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema); 