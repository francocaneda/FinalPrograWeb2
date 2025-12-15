import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8012', 
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false 
});

// Interceptor para agregar el JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para capturar 401
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
