import React, { useState, useEffect } from 'react';
import useAxios from '../../../../api/useAxios';
import authHeader from "../../../../api/auth-header";

const Aj_cmd = ({ onFormSubmit }) => {

  const [selectedUser, setSelectedUser] = useState(''); // Ajout de l'état pour stocker la valeur sélectionnée
  const [users, setUsers] = useState([]);
  const axios = useAxios();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://127.0.0.1:9000/api/users", { headers:authHeader(), withCredentials: true});
        setUsers(response.data["hydra:member"]);
      } catch (error) {
        console.error('Erreur lors de la requête GET pour les utilisateurs :', error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setSelectedUser(e.target.value); // Met à jour la valeur sélectionnée
  };

 

      // Appel de la fonction onFormSubmit avec les données du formulaire
      
  return (
    <>
      <div className="text-center">
        <h1 className="h4 text-gray-900 mb-4">Ajout Commande</h1>
      </div>
      <form className="user" onSubmit={(e) => onFormSubmit(e, selectedUser)} >
        <div>
          <select
            type="text"
            name="user"
            value={selectedUser} // Utilisez selectedUser au lieu de formData.user
            onChange={handleInputChange}
            className="form-control text-black bg-default"
            placeholder="Téléphone/E-mail"
          >
            <option value="" disabled={!selectedUser}>Sélectionnez un utilisateur</option>
            {users.map((user) => (
              <option key={user['@id']} value={user['@id']}>
                {user.nom} {user.prenom}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-success btn-user btn-block">
          Save
        </button>
      </form>
    </>
  );
};

export default Aj_cmd;
