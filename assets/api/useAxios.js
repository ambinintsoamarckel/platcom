import axios from 'axios';
import useRefreshToken from './useRefreshToken';
import { useEffect } from 'react';
import useLogout from './useLogout';
import { notification } from 'antd';

const useAxios = () => {
    const refresh = useRefreshToken;
    const logout= useLogout();
    const axiosInstance = axios.create();

    const responseInterceptor = axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            if (error?.response?.status === 401 ) {
                if (error?.response?.data.message==="Expired JWT Token") {
                try {
                    const newToken = await refresh();
                    const user=JSON.parse(localStorage.getItem("user"));
       
                    error.config.headers['Authorization'] = `Bearer ${user?.token}`;
                    return axiosInstance.request(error.config);
                } catch (refreshError) {
                    console.log('Échec du rafraîchissement du token:', refreshError);
                    notification.error({
                        message: "Erreur de Token",
                        description: 'Échec du rafraîchissement du token.',
                      });
                    logout();
                    return Promise.reject(refreshError);
                }
                    
                }
                else if(error?.response?.data.message==='Accès non autorisé.')
                {
                    notification.error({
                        message: "Interdit",
                        description: 'Accès non autorisé.',
                      });
                    logout();
                }
                
            }
            else if (error?.response?.status === 500 ) {
                notification.error({
                    message: "Erreur Interne du Serveur",
                    description: "Une erreur interne du serveur s'est produite. Veuillez réessayer plus tard ou changer les donnés parce qu'il s'agit peut être d'un doublons.",
                  });
                
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        return () => {
            axiosInstance.interceptors.response.eject(responseInterceptor);
        };
    }, [refresh]);

    return axiosInstance;
};

export default useAxios;
