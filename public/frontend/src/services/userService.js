import apiClient from "./apiClient";

const userService = {
  // Obtener la cantidad total de usuarios
  getTotalUsuarios: async () => {
    try {
      const response = await apiClient.get("/api/usuarios/count");
      return response.data.total || 0;
    } catch (error) {
      console.error("Error obteniendo total de usuarios:", error);
      return 0;
    }
  },

  register: async (payload) => {
    // POST http://localhost:8012/api/user
    const res = await apiClient.post('/api/usuarios', payload);
    return res.data;
  },
};

export default userService;
