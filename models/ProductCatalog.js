const mongoose = require('mongoose');

const productCatalogSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    precio: {
        type: Number,
        required: true,
        min: 0
    },
    proveedor: {
        type: String,
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

// Generar SKU automáticamente antes de guardar
productCatalogSchema.pre('validate', async function (next) {
    if (this.isNew) {
        const Category = mongoose.model('Category');
        const cat = await Category.findById(this.categoria);
        if (cat) {
            const prefix = cat.nombre.substring(0, 3).toUpperCase();
            const ProductCatalog = mongoose.model('ProductCatalog');
            const count = await ProductCatalog.countDocuments({ categoria: this.categoria });
            this.sku = `${prefix}-${(count + 1).toString().padStart(3, '0')}`;
        }
    }
    next();
});

module.exports = mongoose.model('ProductCatalog', productCatalogSchema); 