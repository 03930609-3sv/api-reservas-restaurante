const jwt = require('jsonwebtoken');

// Verifica que el usuario tenga un token válido
const verificarToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Acceso denegado. Token requerido.' });

    try {
        // Se remueve la palabra "Bearer " si viene incluida
        const tokenLimpio = token.replace('Bearer ', '');
        const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
        req.user = verificado; // Guardamos los datos del usuario en la petición
        next(); // Continúa hacia la ruta
    } catch (error) {
        res.status(400).json({ error: 'Token no válido o expirado.' });
    }
};

// Verifica que el usuario tenga rol de administrador (se usará en la Fase 3)
const verificarAdmin = (req, res, next) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Se requiere rol de administrador.' });
    }
    next();
};

module.exports = { verificarToken, verificarAdmin };