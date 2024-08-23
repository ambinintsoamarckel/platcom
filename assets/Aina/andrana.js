import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import authHeader from '../../../../api/auth-header';
import Select from 'react-select';

const Ed_cmd = ({ onFormSubmit }) => {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://127.0.0.1:9000/api/commandes_recu/${id}`, {
          headers: {
            'Content-Type': 'application/ld+json',
            ...authHeader(),
            withCredentials: true,
          },
        });
        const response2 = await axios.get('https://127.0.0.1:9000/api/users');
        const userOptions = response2.data['hydra:member'].map((user) => ({
          value: user.id,
          label: user.nom+' '+user.prenom,
        }));
        console.log("User Options:", userOptions);
        setUsers(userOptions);

        const categoryData = response.data;
        console.log("tatay", categoryData);
        if (categoryData.user && categoryData.user.id) {
          // Appeler handleInputChange avec l'objet utilisateur complet
          handleInputChange({
            value: categoryData.user.id,
            label: categoryData.user.nom+' '+categoryData.user.prenom,
          });
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données de la catégorie :', error);
      }
    };

    fetchData();
  }, [id]);
  console.log("iooooo", selectedUser);

  const handleInputChange = (selectedOption) => {
    setSelectedUser(selectedOption);
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