const express = require('express');
const router = express.Router();
const { executeQuery } = require('../config/db');
const { protectRoute, adminOnly } = require('../middleware/authMiddleware');

// --------------------------------------
// RUTAS DE COMENTARIOS
// --------------------------------------

// Obtener comentarios de un post
router.get('/post/:id_post', async (req, res) => {
  try {
    const { id_post } = req.params;
    const sql = `
      SELECT c.id_comentario, c.contenido, c.fecha_comentario, c.id_usuario, c.id_comentario_padre, u.nombre_completo
      FROM comentarios c
      JOIN usuarios u ON c.id_usuario = u.id
      WHERE c.id_post = ?
      ORDER BY c.fecha_comentario ASC
    `;
    const rows = await executeQuery(sql, [id_post]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error obteniendo comentarios' });
  }
});

// Crear comentario (usuario logueado)
router.post('/post/:id_post', protectRoute, async (req, res) => {
  try {
    const { id_post } = req.params;
    const { contenido, id_comentario_padre } = req.body;
    const id_usuario = req.user.uid; // desde el token

    const sql = `
      INSERT INTO comentarios (contenido, fecha_comentario, id_post, id_usuario, id_comentario_padre)
      VALUES (?, CURRENT_TIMESTAMP, ?, ?, ?)
    `;
    await executeQuery(sql, [contenido, id_post, id_usuario, id_comentario_padre || null]);
    res.json({ message: 'Comentario creado' });
  } catch (err) {
    console.error('Error creando comentario:', err);
    res.status(500).json({ message: 'Error creando comentario' });
  }
});

router.delete('/:id_comentario', protectRoute, async (req, res) => {
  try {
    const { id_comentario } = req.params;
    const usuarioId = req.user.uid;

    // Obtener comentario
    const checkSql = `
      SELECT id_usuario 
      FROM comentarios 
      WHERE id_comentario = ?
    `;
    const [comentario] = await executeQuery(checkSql, [id_comentario]);

    if (!comentario) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    const esAutor = comentario.id_usuario === usuarioId;
    const esAdminGeneral = usuarioId === 1;

    // ❌ Permisos: SOLO autor o admin general
    if (!esAutor && !esAdminGeneral) {
      return res
        .status(403)
        .json({ message: 'No tienes permisos para eliminar este comentario' });
    }

    const delSql = `
      DELETE FROM comentarios 
      WHERE id_comentario = ?
    `;
    await executeQuery(delSql, [id_comentario]);

    res.json({ message: 'Comentario eliminado correctamente' });

  } catch (err) {
    console.error('Error eliminando comentario:', err);
    res.status(500).json({ message: 'Error eliminando comentario' });
  }
});


module.exports = router;
