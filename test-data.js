const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Venta = require('./models/Venta');
const bcrypt = require('bcryptjs');

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/vent-sis-meto', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

async function checkAndAddTestData() {
    try {
        console.log('Verificando datos en la base de datos...');

        // Verificar usuarios
        const users = await User.find();
        console.log(`Usuarios encontrados: ${users.length}`);

        // Verificar productos
        const products = await Product.find();
        console.log(`Productos encontrados: ${products.length}`);

        // Verificar categorías
        const categories = await Category.find();
        console.log(`Categorías encontradas: ${categories.length}`);

        // Verificar ventas
        const ventas = await Venta.find();
        console.log(`Ventas encontradas: ${ventas.length}`);

        // Si no hay datos, agregar algunos de prueba
        if (users.length === 0) {
            console.log('Agregando usuarios de prueba...');
            const hashedPassword = await bcrypt.hash('password123', 10);

            await User.create([
                {
                    nombre: 'Admin Usuario',
                    email: 'admin@admin.com',
                    password: hashedPassword,
                    rol: 'administrador',
                    activo: true
                },
                {
                    nombre: 'Vendedor Juan',
                    email: 'vendedor@test.com',
                    password: hashedPassword,
                    rol: 'vendedor',
                    activo: true
                }
            ]);
            console.log('Usuarios de prueba creados');
        }

        if (categories.length === 0) {
            console.log('Agregando categorías de prueba...');
            await Category.create([
                { nombre: 'Electrónicos', descripcion: 'Productos electrónicos' },
                { nombre: 'Ropa', descripcion: 'Vestimenta y accesorios' },
                { nombre: 'Hogar', descripcion: 'Artículos para el hogar' }
            ]);
            console.log('Categorías de prueba creadas');
        }

        if (products.length === 0) {
            console.log('Agregando productos de prueba...');
            await Product.create([
                {
                    nombre: 'Laptop HP',
                    sku: 'LAP001',
                    categoria: 'Electrónicos',
                    precio: 1200,
                    stock: 10,
                    stockMinimo: 2,
                    proveedor: 'HP Inc.'
                },
                {
                    nombre: 'Camiseta Básica',
                    sku: 'CAM001',
                    categoria: 'Ropa',
                    precio: 25,
                    stock: 50,
                    stockMinimo: 10,
                    proveedor: 'Textil Corp.'
                },
                {
                    nombre: 'Lámpara de Mesa',
                    sku: 'LAM001',
                    categoria: 'Hogar',
                    precio: 45,
                    stock: 15,
                    stockMinimo: 5,
                    proveedor: 'Iluminación Plus'
                }
            ]);
            console.log('Productos de prueba creados');
        }

        if (ventas.length === 0) {
            console.log('Agregando ventas de prueba...');
            const admin = await User.findOne({ email: 'admin@admin.com' });
            const vendedor = await User.findOne({ email: 'vendedor@test.com' });

            if (admin && vendedor) {
                await Venta.create([
                    {
                        cliente: 'Cliente Test 1',
                        vendedor: vendedor._id,
                        fecha: new Date(),
                        productos: [
                            { producto: 'Laptop HP', cantidad: 1, precio: 1200 }
                        ],
                        total: 1200,
                        estado: 'completada'
                    },
                    {
                        cliente: 'Cliente Test 2',
                        vendedor: admin._id,
                        fecha: new Date(),
                        productos: [
                            { producto: 'Camiseta Básica', cantidad: 2, precio: 25 },
                            { producto: 'Lámpara de Mesa', cantidad: 1, precio: 45 }
                        ],
                        total: 95,
                        estado: 'completada'
                    }
                ]);
                console.log('Ventas de prueba creadas');
            }
        }

        console.log('Verificación completada');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkAndAddTestData(); 