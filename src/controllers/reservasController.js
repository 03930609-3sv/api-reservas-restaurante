const pool = require('../config/db');

// POST /api/reservaciones - Crear reservación (Cliente)
const crearReservacion = async (req, res) => {
    const { mesa_id, fecha, hora, numero_comensales } = req.body;
    const usuario_id = req.user.id;

    try {
        // Verificar si la mesa ya está reservada en esa fecha y hora
        const checkMesa = await pool.query(
            'SELECT * FROM reservaciones WHERE mesa_id = $1 AND fecha = $2 AND hora = $3 AND estado != \'cancelada\'',
            [mesa_id, fecha, hora]
        );

        if (checkMesa.rows.length > 0) {
            return res.status(400).json({ error: 'La mesa ya está reservada para esa fecha y hora' });
        }

        const result = await pool.query(
            'INSERT INTO reservaciones (usuario_id, mesa_id, fecha, hora, numero_comensales) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [usuario_id, mesa_id, fecha, hora, numero_comensales]
        );
        res.status(201).json({ mensaje: 'Reservación creada', reservacion: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la reservación' });
    }
};

// GET /api/reservaciones/mis - Mis reservaciones (Cliente)
const misReservaciones = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reservaciones WHERE usuario_id = $1 ORDER BY fecha DESC, hora DESC', [req.user.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tus reservaciones' });
    }
};

// GET /api/reservaciones - Todas las reservaciones (Admin)
const todasReservaciones = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM reservaciones ORDER BY fecha DESC, hora DESC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las reservaciones' });
    }
};

// PUT /api/reservaciones/:id/estado - Cambiar estado (Admin)
const cambiarEstado = async (req, res) => {
    const { estado } = req.body; // 'pendiente', 'confirmada', 'cancelada'
    try {
        const result = await pool.query(
            'UPDATE reservaciones SET estado = $1 WHERE id = $2 RETURNING *',
            [estado, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Reservación no encontrada' });
        res.json({ mensaje: 'Estado actualizado', reservacion: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
};

// DELETE /api/reservaciones/:id - Cancelar propia reservación (Cliente)
const cancelarReserva = async (req, res) => {
    try {
        // Solo puede cancelar si es SU reserva
        const result = await pool.query(
            'UPDATE reservaciones SET estado = \'cancelada\' WHERE id = $1 AND usuario_id = $2 RETURNING *',
            [req.params.id, req.user.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'No se encontró la reservación o no te pertenece' });
        res.json({ mensaje: 'Reservación cancelada exitosamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al cancelar la reservación' });
    }
};

module.exports = { crearReservacion, misReservaciones, todasReservaciones, cambiarEstado, cancelarReserva };