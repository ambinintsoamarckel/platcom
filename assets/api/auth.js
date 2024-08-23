import axios from "axios"
import authHeader from "./auth-header";
import { notification } from "antd";
// AuthService.js

const login = async (uuid, password) => {
    try {
      const response = await axios.post('https://127.0.0.1:9000/authenticator_token', {"uuid": uuid, "password": password});
      console.log('appel1111fg');
      localStorage.setItem("user", JSON.stringify(response.data));
      await reload();
    } catch (error) {
      if (error.response) {
        // La requête a été effectuée, mais le serveur a répondu avec un statut autre que 2xx
        if (error.response.status === 401) {
          // Statut 401 : Unauthorized
          notification.error({
            message: "Erreur d'authentification",
            description: "Nom d'utilisateur ou mot de passe incorrect.",
          });
        }
          else if (error.response.status === 404) {
            // Statut 401 : Unauthorized
            notification.error({
              message: "Erreur d'authentification",
              description: "Le compte n'existe pas.",
            });
        } 
      }   
    
    }
  };
  
const reload = async () => {
    try {
        const response = await axios.get('https://127.0.0.1:9000/api/me', { headers: authHeader(), withCredentials: true });
        const data = response.data;
        console.log('reload',response);
        localStorage.setItem('current_user', JSON.stringify(data));
    } catch (error) {
        console.error("Error during reload:", error);
    }
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem("user"));
};

const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("current_user");
};

const AuthService = {
    login,
    logout,
    getCurrentUser,
    reload,
};

export default AuthService;
