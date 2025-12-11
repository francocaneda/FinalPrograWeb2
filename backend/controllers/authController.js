// backend/controllers/authController.js (CÓDIGO COMPLETO CORREGIDO)

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Usamos bcryptjs para mayor compatibilidad
const { executeQuery } = require('../config/db'); 
const { JWT_CONFIG } = require('../config/config'); 

// Helper para manejar respuestas de error consistentes
const sendError = (res, status, message) => {
    if (status === 401) {
        return res.status(401).send(); 
    }
    if (status === 400) {
        return res.status(400).json({ message: message || 'Petición incorrecta.' });
    }
    return res.status(status).json({ message: message || 'Error interno del servidor.' });
};

// ------------------------------------
// Función: postLogin
// ------------------------------------
exports.postLogin = async (req, res) => {
    const { email, clave } = req.body;

    if (!email || !clave) {
        return sendError(res, 400, 'Faltan datos obligatorios (email o clave).');
    }

    try {
        // 1. Buscar usuario por email
        // ⬇️ CORRECCIÓN CLAVE: Quitamos la desestructuración [rows] ⬇️
        const rows = await executeQuery( 
            "SELECT id, nombre_completo, clave, rol FROM usuarios WHERE email = ?",
            [email]
        );

        const usuario = rows[0];

        if (!usuario) {
            return sendError(res, 401); // Usuario no encontrado
        }
        
        // 2. Verificar la contraseña
        const claveValida = await bcrypt.compare(clave, usuario.clave);

        if (!claveValida) {
            return sendError(res, 401); // Contraseña incorrecta
        }

        // 3. Crear JWT con los datos del usuario
        const payload = {
            uid: usuario.id, 
            nombre: usuario.nombre_completo,
            rol: usuario.rol,
        };

        const token = jwt.sign(payload, JWT_CONFIG.SECRET_KEY, {
            algorithm: JWT_CONFIG.ALGORITHM,
            expiresIn: JWT_CONFIG.EXPIRATION_SECONDS
        });

        // 4. Retornar el token
        res.status(200).json({ jwt: token });

    } catch (error) {
        console.error('Error en postLogin:', error);
        sendError(res, error.status || 500, error.message);
    }
};

// ------------------------------------
// Función: getPerfil
// ------------------------------------
exports.getPerfil = async (req, res) => { // ⬅️ DEBE ser 'async'
    // 1. Obtener el ID del usuario desde el JWT decodificado
    // Usamos 'uid' (del token) o 'id' (por seguridad)
    const userId = req.user.uid || req.user.id; 

    if (!userId) {
        return res.status(401).json({ message: 'ID de usuario no encontrado en el token.' });
    }

    try {
        // 2. Consulta a la base de datos para obtener TODOS los campos
        const sql = `
            SELECT 
                id, 
                user_nameweb, 
                email, 
                nombre_completo, 
                avatar, 
                bio, 
                rol, 
                fecha_nacimiento, 
                fecha_registro 
            FROM usuarios 
            WHERE id = ?
        `; 
        
        const rows = await executeQuery(sql, [userId]); // ⬅️ Usamos executeQuery
        const usuario = rows[0];

        if (!usuario) {
            return res.status(404).json({ message: 'Perfil de usuario no encontrado en la base de datos.' });
        }
        
        // 3. Devolver todos los datos del usuario (en snake_case, como están en la DB)
        res.status(200).json(usuario);
        
    } catch (error) {
        console.error('Error al obtener el perfil de la DB:', error);
        // Si hay un error SQL, devolvemos un 500
        res.status(500).json({ message: 'Error interno del servidor al consultar el perfil.' });
    }
};


// ------------------------------------
// Función: patchLogin (Renovar Token)
// ------------------------------------
exports.patchLogin = (req, res) => {
    const payload = req.user;
    
    const newToken = jwt.sign(payload, JWT_CONFIG.SECRET_KEY, {
        algorithm: JWT_CONFIG.ALGORITHM,
        expiresIn: JWT_CONFIG.EXPIRATION_SECONDS
    });
    
    res.status(200).json({ jwt: newToken });
};