import apiClient from './apiClient'; 
import { useAuth } from '../context/AuthContext'; 
import { useMemo } from 'react'; 


export function useCategoryService() {
    
    const { getToken, logout } = useAuth();
    
    const apiClientInstance = apiClient; 


    const serviceFunctions = useMemo(() => {
        
        const getCategorias = async () => {
            try {
                const response = await apiClientInstance.get('/api', { 
                    params: { 
                        comando: 'categorias' 
                    } 
                }); 
                
                return response.data; 
            } catch (error) {
                // Manejo de errores a nivel de servicio
                throw error;
            }
        };

        const crearCategoria = (data) => {
            return apiClientInstance.post('/api', data, { 
                params: { 
                    comando: 'crearcategoria' 
                } 
            }); 
        };

        const eliminarCategoria = (id) => {
            return apiClientInstance.post('/api', { id_categoria: id }, { 
                params: { 
                    comando: 'eliminarcategoria' 
                } 
            }); 
        };

        return {
            getCategorias,
            crearCategoria,
            eliminarCategoria,
        };
    }, [apiClientInstance]); 

    return serviceFunctions;
}