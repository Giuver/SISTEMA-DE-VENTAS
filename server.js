const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

// Configuración de variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vent-sis-meto', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

async function ensureAdminUser() {
    const adminEmail = 'admin@admin.com';
    const admin = await User.findOne({ email: adminEmail });
    if (!admin) {
        const hashedPassword = await bcrypt.hash('admin123', 10); // Cambia la contraseña si lo deseas
        await User.create({
            nombre: 'Admin Usuario',
            email: adminEmail,
            password: hashedPassword,
            rol: 'administrador',
            activo: true
        });
        console.log('Usuario admin creado automáticamente');
    }
}

mongoose.connection.once('open', ensureAdminUser);

// Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/ventas', require('./routes/ventas'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
}); 