const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importaciones de Swagger (NUEVO)
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');

const authRoutes = require('./routes/authRoutes');
const mesasRoutes = require('./routes/mesasRoutes');
const reservasRoutes = require('./routes/reservasRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta especial para la documentación (NUEVO)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/auth', authRoutes);
app.use('/api/mesas', mesasRoutes);
app.use('/api/reservaciones', reservasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📄 Documentación en http://localhost:${PORT}/api-docs`); // NUEVO
});