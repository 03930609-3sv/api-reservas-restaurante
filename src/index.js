const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const mesasRoutes = require('./routes/mesasRoutes');       // <-- NUEVO
const reservasRoutes = require('./routes/reservasRoutes'); // <-- NUEVO

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json()); // Permite leer JSON en el body

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/mesas', mesasRoutes);             // <-- NUEVO
app.use('/api/reservaciones', reservasRoutes);  // <-- NUEVO

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});