// backend/routes/postsRoutes.js

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/db');
const { JWT_CONFIG } = require('../config/config');

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

// ---------------------------------------------------
// POST - CREAR NUEVO POST
// /api/posts
// ---------------------------------------------------
router.post('/', async (req, res) => {
    const { id_categoria, titulo, contenido } = req.body;

    if (!id_categoria || !titulo || !contenido) {
        return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }

    try {
        // 1️⃣ Verificar token del header Authorization
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ mensaje: 'No se pudo identificar al usuario. Por favor inicia sesión.' });
        }

        const token = authHeader.split(' ')[1]; // "Bearer TOKEN"
        if (!token) {
            return res.status(401).json({ mensaje: 'No se pudo identificar al usuario. Por favor inicia sesión.' });
        }

        // 2️⃣ Decodificar token
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_CONFIG.SECRET_KEY, { algorithms: [JWT_CONFIG.ALGORITHM] });
        } catch (err) {
            return res.status(401).json({ mensaje: 'Token inválido o expirado. Por favor inicia sesión nuevamente.' });
        }

        const id_usuario = decoded.uid; // ⚠️ Usar uid, no id
        if (!id_usuario) {
            return res.status(401).json({ mensaje: 'No se pudo identificar al usuario. Por favor inicia sesión.' });
        }

        // 3️⃣ Insertar post en la DB
        const sql = `
            INSERT INTO posts (id_categoria, titulo, contenido, id_usuario, fecha_creacion)
            VALUES (?, ?, ?, ?, datetime('now'))
        `;
        await executeQuery(sql, [id_categoria, titulo, contenido, id_usuario]);

        res.status(201).json({ mensaje: 'Post creado correctamente.' });
    } catch (error) {
        console.error("Error al crear post:", error);
        res.status(500).json({ mensaje: "Error al crear el post." });
    }
});

module.exports = router;
