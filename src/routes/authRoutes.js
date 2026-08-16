const express = require('express');
const router = express.Router();
const { register, login, perfil } = require('../controllers/authController');
const { verificarToken } = require('../middlewares/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/perfil', verificarToken, perfil); // Ruta protegida por el middleware

module.exports = router;