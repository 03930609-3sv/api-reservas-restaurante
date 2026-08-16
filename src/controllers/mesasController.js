const pool = require('../config/db');

// GET /api/mesas - Listar mesas activas (Público)
const listarMesas = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM mesas WHERE activa = true ORDER BY numero_mesa');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las mesas' });
    }
};

// GET /api/mesas/:id - Detalle de una mesa
const obtenerMesa = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM mesas WHERE id = $1 AND activa = true', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Mesa no encontrada' });
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener la mesa' });
    }
};

// POST /api/mesas - Crear nueva mesa (Solo Admin)
const crearMesa = async (req, res) => {
    const { numero_mesa, capacidad, ubicacion } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO mesas (numero_mesa, capacidad, ubicacion) VALUES ($1, $2, $3) RETURNING *',
            [numero_mesa, capacidad, ubicacion]
        );
        res.status(201).json({ mensaje: 'Mesa creada', mesa: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la mesa' });
    }
};

// PUT /api/mesas/:id - Actualizar mesa (Solo Admin)
const actualizarMesa = async (req, res) => {
    const { capacidad, ubicacion } = req.body;
    try {
        const result = await pool.query(
            'UPDATE mesas SET capacidad = $1, ubicacion = $2 WHERE id = $3 RETURNING *',
            [capacidad, ubicacion, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Mesa no encontrada' });
        res.json({ mensaje: 'Mesa actualizada', mesa: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la mesa' });
    }
};

// DELETE /api/mesas/:id - Desactivar mesa "Soft Delete" (Solo Admin)
const desactivarMesa = async (req, res) => {
    try {
        const result = await pool.query(
            'UPDATE mesas SET activa = false WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Mesa no encontrada' });
        res.json({ mensaje: 'Mesa desactivada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al desactivar la mesa' });
    }
};

module.exports = { listarMesas, obtenerMesa, crearMesa, actualizarMesa, desactivarMesa };