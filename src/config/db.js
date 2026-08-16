const { Pool } = require('pg');
require('dotenv').config();

// En la nube usaremos DATABASE_URL, en local las variables separadas
const isProduction = process.env.NODE_ENV === 'production';

const poolConfig = process.env.DATABASE_URL 
    ? { 
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false } // Requisito obligatorio de Neon y Render
      }
    : {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    };

const pool = new Pool(poolConfig);

module.exports = pool;