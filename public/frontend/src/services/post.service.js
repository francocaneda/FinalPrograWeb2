import apiClient from "./apiClient";

const postService = {

    // Obtener posts por categoría
    getPostsByCategory: async (id_categoria) => {
        try {
            const response = await apiClient.get(`/api/posts/categoria/${id_categoria}`);
            return response.data;
        } catch (error) {
            console.error("Error obteniendo posts por categoría:", error);
            throw error;
        }
    },

    // Crear nuevo post (envía token en headers)
    createPost: async (data) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No hay token de usuario. Debes iniciar sesión.');

            const response = await apiClient.post('/api/posts', data, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            console.error("Error creando post:", error);
            throw error;
        }
    }

};

export default postService;
