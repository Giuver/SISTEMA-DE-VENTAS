const Venta = require('../models/Venta');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Listar todas las ventas
exports.getVentas = async (req, res) => {
    try {
        const ventas = await Venta.find().populate('vendedor', 'nombre email');
        res.status(200).json({ success: true, data: ventas });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al obtener ventas', error: error.message });
    }
};

// Obtener una venta
exports.getVenta = async (req, res) => {
    try {
        const venta = await Venta.findById(req.params.id).populate('vendedor', 'nombre email');
        if (!venta) {
            return res.status(404).json({ success: false, mensaje: 'Venta no encontrada' });
        }
        res.status(200).json({ success: true, data: venta });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al obtener venta', error: error.message });
    }
};

// Crear venta
exports.createVenta = async (req, res) => {
    try {
        console.log('Datos recibidos para crear venta:', req.body);
        // Validar y descontar stock
        for (const item of req.body.productos) {
            const producto = await Product.findOne({ nombre: item.producto });
            if (!producto) {
                console.error('Producto no encontrado:', item.producto);
                return res.status(400).json({ success: false, mensaje: `Producto no encontrado: ${item.producto}` });
            }
            if (producto.stock < item.cantidad) {
                console.error('Stock insuficiente para:', item.producto);
                return res.status(400).json({ success: false, mensaje: `Stock insuficiente para ${item.producto}` });
            }
            producto.stock -= item.cantidad;
            await producto.save();
        }
        // Crear venta
        console.log('Creando venta con:', req.body);
        const venta = await Venta.create(req.body);
        // Actualizar ventas y montoTotal del vendedor
        console.log('Actualizando vendedor:', req.body.vendedor);
        await User.findByIdAndUpdate(req.body.vendedor, {
            $inc: { ventas: 1, montoTotal: req.body.total }
        });
        res.status(201).json({ success: true, data: venta });
    } catch (error) {
        console.error('Error al crear venta:', error);
        res.status(500).json({ success: false, mensaje: 'Error al crear venta', error: error.message });
    }
};

// Actualizar venta
exports.updateVenta = async (req, res) => {
    try {
        const venta = await Venta.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!venta) {
            return res.status(404).json({ success: false, mensaje: 'Venta no encontrada' });
        }
        res.status(200).json({ success: true, data: venta });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al actualizar venta', error: error.message });
    }
};

// Eliminar venta
exports.deleteVenta = async (req, res) => {
    try {
        const venta = await Venta.findByIdAndDelete(req.params.id);
        if (!venta) {
            return res.status(404).json({ success: false, mensaje: 'Venta no encontrada' });
        }
        // Actualizar ventas y montoTotal del vendedor
        await User.findByIdAndUpdate(venta.vendedor, {
            $inc: { ventas: -1, montoTotal: -venta.total }
        });
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al eliminar venta', error: error.message });
    }
};

// Resumen de ventas (ventas de hoy, promedio, top vendedor)
exports.getResumen = async (req, res) => {
    try {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const maniana = new Date(hoy);
        maniana.setDate(hoy.getDate() + 1);
        const ventasHoy = await Venta.find({ fecha: { $gte: hoy, $lt: maniana } });
        const totalHoy = ventasHoy.reduce((acc, v) => acc + v.total, 0);
        const totalTransacciones = ventasHoy.length;
        const promedio = totalTransacciones ? totalHoy / totalTransacciones : 0;
        // Top vendedor (de todas las ventas)
        const vendedores = await User.find({ rol: 'vendedor' });
        let topVendedor = null;
        if (vendedores.length) {
            topVendedor = vendedores.reduce((max, v) => (v.montoTotal > (max?.montoTotal || 0) ? v : max), null);
        }
        res.status(200).json({
            success: true,
            data: {
                ventasHoy: totalHoy,
                transaccionesHoy: totalTransacciones,
                promedio,
                topVendedor: topVendedor ? { nombre: topVendedor.nombre, monto: topVendedor.montoTotal } : null
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al obtener resumen', error: error.message });
    }
};

// Obtener ventas agrupadas por mes (para dashboard)
exports.getVentasPorMes = async (req, res) => {
    try {
        const ventas = await Venta.aggregate([
            {
                $group: {
                    _id: { mes: { $month: "$fecha" }, anio: { $year: "$fecha" } },
                    totalIngresos: { $sum: "$total" },
                    totalVentas: { $sum: 1 }
                }
            },
            { $sort: { "_id.anio": 1, "_id.mes": 1 } }
        ]);
        res.status(200).json({ success: true, data: ventas });
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al obtener ventas por mes', error: error.message });
    }
};

// Obtener ventas agrupadas por categoría (para dashboard)
exports.getVentasPorCategoria = async (req, res) => {
    try {
        const ventas = await Venta.aggregate([
            { $unwind: "$productos" },
            {
                $lookup: {
                    from: "products",
                    localField: "productos.producto",
                    foreignField: "nombre",
                    as: "productoInfo"
                }
            },
            { $unwind: "$productoInfo" },
            {
                $group: {
                    _id: "$productoInfo.categoria",
                    totalVentas: { $sum: "$productos.cantidad" },
                    ingresos: { $sum: { $multiply: ["$productos.cantidad", "$productos.precio"] } }
                }
            }
        ]);
        // Obtener nombres de categorías
        const categorias = await Category.find({ _id: { $in: ventas.map(v => v._id) } });
        const ventasConNombre = ventas.map(v => ({
            ...v,
            categoria: categorias.find(c => c._id.equals(v._id))?.nombre || v._id
        }));
        res.status(200).json(ventasConNombre);
    } catch (error) {
        res.status(500).json({ success: false, mensaje: 'Error al obtener ventas por categoría', error: error.message });
    }
}; 