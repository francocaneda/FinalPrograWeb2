// backend/routes/authRoutes.js (Código Completo y Corregido)

const { Router } = require('express');
const router = Router();
const authMiddleware = require('../middleware/authMiddleware'); // Asumiendo que tu middleware está aquí
// ⬇️ CORRECCIÓN: Apunta a la nueva ubicación del controlador ⬇️
const authController = require('../controllers/authController');


// Rutas
router.post('/login', authController.postLogin);
router.get('/perfil', authMiddleware.protectRoute, authController.getPerfil);
router.patch('/login', authMiddleware.protectRoute, authController.patchLogin);

module.exports = router;