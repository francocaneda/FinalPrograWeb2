// backend/routes/postsRoutes.js

const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/db');

// ---------------------------------------------------
// GET - OBTENER TODOS LOS POSTS
// ---------------------------------------------------
router.get('/', async (req, res) => {
    try {
        const sql = `
            SELECT *
            FROM posts
            ORDER BY fecha_creacion DESC
        `;

        const rows = await executeQuery(sql);

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener posts:", error);
        res.status(500).json({ message: "Error al obtener posts." });
    }
});

// ---------------------------------------------------
// GET - OBTENER POSTS POR CATEGORÍA
// /api/posts/categoria/1
// ---------------------------------------------------
router.get('/categoria/:id_categoria', async (req, res) => {
    const { id_categoria } = req.params;

    try {
        const sql = `
            SELECT *
            FROM posts
            WHERE id_categoria = ?
            ORDER BY fecha_creacion DESC
        `;

        const rows = await executeQuery(sql, [id_categoria]);

        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: "No hay posts en esta categoría." });
        }

        res.json(rows);
    } catch (error) {
        console.error("Error al obtener posts por categoría:", error);
        res.status(500).json({ message: "Error al obtener posts por categoría." });
    }
});

module.exports = router;
