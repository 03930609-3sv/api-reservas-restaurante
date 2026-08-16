const express = require('express');
const router = express.Router();
const { crearReservacion, misReservaciones, todasReservaciones, cambiarEstado, cancelarReserva } = require('../controllers/reservasController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

router.post('/', verificarToken, crearReservacion);
router.get('/mis', verificarToken, misReservaciones);
router.delete('/:id', verificarToken, cancelarReserva);

router.get('/', verificarToken, verificarAdmin, todasReservaciones); // Protegido Admin
router.put('/:id/estado', verificarToken, verificarAdmin, cambiarEstado); // Protegido Admin

module.exports = router;