const mongoose = require('mongoose');

const productoVentaSchema = new mongoose.Schema({
    producto: {
        type: String, // nombre del producto
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const ventaSchema = new mongoose.Schema({
    codigo: {
        type: String,
        unique: true
    },
    cliente: {
        type: String,
        default: 'No registrado'
    },
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    productos: [productoVentaSchema],
    total: {
        type: Number,
        required: true,
        min: 0
    },
    estado: {
        type: String,
        enum: ['completada', 'pendiente', 'cancelada'],
        default: 'completada'
    },
    creadoEn: {
        type: Date,
        default: Date.now
    }
});

// Generar código de venta automáticamente
ventaSchema.pre('save', async function (next) {
    if (this.isNew) {
        const Venta = mongoose.model('Venta');
        const count = await Venta.countDocuments();
        this.codigo = `VT-${(count + 1).toString().padStart(3, '0')}`;
    }
    if (!this.cliente) {
        this.cliente = 'No registrado';
    }
    next();
});

module.exports = mongoose.model('Venta', ventaSchema); 