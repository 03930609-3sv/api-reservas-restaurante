const express = require('express');
const router = express.Router();
const { listarMesas, obtenerMesa, crearMesa, actualizarMesa, desactivarMesa } = require('../controllers/mesasController');
const { verificarToken, verificarAdmin } = require('../middlewares/authMiddleware');

router.get('/', listarMesas);
router.get('/:id', obtenerMesa);
router.post('/', verificarToken, verificarAdmin, crearMesa); // Protegido Admin
router.put('/:id', verificarToken, verificarAdmin, actualizarMesa); // Protegido Admin
router.delete('/:id', verificarToken, verificarAdmin, desactivarMesa); // Protegido Admin

module.exports = router;