import axios from 'axios';

// La URL base de tu API, asumiendo que tu backend PHP/MySQL se ejecuta en 8012
// DEBES VERIFICAR la URL exacta de tu endpoint de categorías
const API_URL_BASE = 'http://localhost:8012/miproyecto/api';
const API_URL_CATEGORIAS = `${API_URL_BASE}/categorias`;

/**
 * @typedef {object} Categoria
 * @property {number | string} id_categoria
 * @property {string} nombre_categoria
 * @property {number} cantidad_posts
 * @property {number} cantidad_comentarios
 */

/**
 * Función helper para obtener el token del localStorage.
 * @returns {string} El token JWT o una cadena vacía.
 */
const getToken = () => {
    return localStorage.getItem('jwt_token') || '';
};

/**
 * Obtiene las categorías del foro. No requiere token.
 * @returns {Promise<{ categorias: Categoria[] }>} La lista de categorías.
 */
export const getCategorias = async () => {
    try {
        const response = await axios.get(API_URL_CATEGORIAS);
        // axios envuelve la respuesta en 'data', por lo que devolvemos response.data
        return response.data; // Esperamos { categorias: Categoria[] }
    } catch (error) {
        console.error('Error en getCategorias:', error);
        throw error;
    }
};

/**
 * Crea una nueva categoría. Requiere autenticación (Admin).
 * @param {{ nombre_categoria: string }} categoria - Los datos de la nueva categoría.
 * @returns {Promise<any>} La respuesta del servidor.
 */
export const crearCategoria = async (categoria) => {
    const token = getToken();
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.post(API_URL_CATEGORIAS, categoria, { headers });
        return response.data;
    } catch (error) {
        console.error('Error al crear categoría:', error);
        throw error;
    }
};

/**
 * Elimina una categoría. Requiere autenticación (Admin).
 * @param {number} id_categoria - ID de la categoría a eliminar.
 * @returns {Promise<any>} La respuesta del servidor.
 */
export const eliminarCategoria = async (id_categoria) => {
    const token = getToken();
    const headers = {
        'Authorization': `Bearer ${token}`
    };

    const url = `${API_URL_CATEGORIAS}/${id_categoria}`;
    
    try {
        const response = await axios.delete(url, { headers });
        return response.data;
    } catch (error) {
        console.error('Error al eliminar categoría:', error);
        throw error;
    }
};

// Exportamos las funciones como parte del servicio
const categoryService = {
    getCategorias,
    crearCategoria,
    eliminarCategoria,
};

export default categoryService;