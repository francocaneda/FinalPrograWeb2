const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/db');
const userController = require('../controllers/userController');

// ---------------------------------------------------
// GET - TOTAL DE USUARIOS
// /api/usuarios/count
// ---------------------------------------------------
router.get('/count', async (req, res) => {
    try {
        const sql = `SELECT COUNT(*) AS total FROM usuarios`;
        const rows = await executeQuery(sql);
        const total = rows[0]?.total || 0;
        res.json({ total });
    } catch (error) {
        console.error('Error obteniendo total de usuarios:', error);
        res.status(500).json({ total: 0 });
    }
});

// ---------------------------------------------------
// GET - LISTA DE USUARIOS
// /api/usuarios
// ---------------------------------------------------
router.get('/', async (req, res) => {
    try {
        const sql = `SELECT id, nombre_completo, email, fecha_creacion FROM usuarios ORDER BY fecha_creacion ASC`;
        const rows = await executeQuery(sql);
        res.json(rows);
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        res.status(500).json({ message: 'Error obteniendo usuarios.' });
    }
});

router.post('/', userController.createUser); 

module.exports = router;
