// useLogout.js
import { useNavigate } from 'react-router-dom';
import AuthService from './auth';
import axios from './axios';
import authHeader from './auth-header';

const useLogout = () => {
    const navigate = useNavigate();
    const object = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        if (AuthService.getCurrentUser()) {
            try {
                const response =  axios.post(`https://127.0.0.1:9000/api/token/invalidate`,{refresh_token:object.refresh_token},{
                    headers: {
                      'Content-Type': 'application/ld+json',
                    }})
                AuthService.logout();                
            } catch (error) {
                console.error(error);
                AuthService.logout();
            }
        }
        navigate('/react');
    };

    return logout;
};

export default useLogout;
