import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import authHeader from '../../../../api/auth-header';
import Select from 'react-select';

const Ed_cmd = ({ onFormSubmit, categoryData }) => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://127.0.0.1:9000/api/users');
        const userOptions = response.data['hydra:member'].map((user) => ({
          value: user.id,
          label: user.nom+' '+user.prenom,
        }));
        console.log("User Options:", userOptions);
        setUsers(userOptions);

        
        console.log("tatay", categoryData);
        if (categoryData) {
          // Appeler handleInputChange avec l'objet utilisateur complet
          handleInputChange(categoryData);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de la catégorie :', error);
      }
    };

    fetchData();
  }, [categoryData]);
  console.log("iooooo", selectedUser);

  const handleInputChange = (selectedOption) => {
    setSelectedUser(selectedOption.value);
    console.log("fofory:", selectedOption);
    console.log("nonoa:", selectedUser);
  };

  return (
    <>
      <div className="text-center">
        <h1 className="h4 text-gray-900 mb-4">Edit Commande</h1>
      </div>
      <form className="user" onSubmit={(e) => onFormSubmit(e, selectedUser)}>
        <div>
        <Select
          name="user"
          value={selectedUser}
          onChange={(selectedOption) => handleInputChange(selectedOption)}
          options={users}
          placeholder="Sélectionnez un utilisateur"
          isClearable
          defaultValue={selectedUser || undefined} // Ajoutez cette ligne
        />
        </div>
        <button type="submit" className="btn btn-success btn-user btn-block">
          Save
        </button>
      </form>
    </>
  );
};

export default Ed_cmd;