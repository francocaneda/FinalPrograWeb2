// frontend/src/services/post.service.js

import apiClient from "./apiClient";

const postService = {

    /**
     * Obtiene los posts pertenecientes a una categoría específica.
     * @param {number} id_categoria - ID de la categoría.
     * @returns {Promise<any[]>} Lista de posts.
     */
    getPostsByCategory: async (id_categoria) => {
        try {
            const response = await apiClient.get(`/api/posts/categoria/${id_categoria}`);
            return response.data; // <- devuelve directamente la lista de posts
        } catch (error) {
            console.error("Error obteniendo posts por categoría:", error);
            throw error;
        }
    }

};

export default postService;
