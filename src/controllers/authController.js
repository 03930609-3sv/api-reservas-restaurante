const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/auth/register
const register = async (req, res) => {
    const { nombre, email, password } = req.body;
    try {
        // Encriptar la contraseña (10 rondas de seguridad)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardar en la base de datos
        const result = await pool.query(
            'INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3) RETURNING id, nombre, email, rol',
            [nombre, email, hashedPassword]
        );

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente', usuario: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') { // Error de Postgres para "Unique Violation"
            return res.status(400).json({ error: 'El correo ya está registrado' });
        }
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// POST /api/auth/login
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        // Buscar al usuario
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

        const usuario = result.rows[0];

        // Comparar contraseña encriptada
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) return res.status(401).json({ error: 'Contraseña incorrecta' });

        // Crear el Token JWT
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol }, 
            process.env.JWT_SECRET, 
            { expiresIn: '2h' } // Expira en 2 horas
        );

        res.json({ mensaje: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

// GET /api/auth/perfil
const perfil = async (req, res) => {
    try {
        // El req.user.id viene del authMiddleware
        const result = await pool.query('SELECT id, nombre, email, rol, fecha_registro FROM usuarios WHERE id = $1', [req.user.id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
};

module.exports = { register, login, perfil };