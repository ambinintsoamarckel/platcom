// UserDropdown.js
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import useAxios from '../api/useAxios'; 
import authHeader from '../api/auth-header'; 

function UserDropdown({ onSelectUser ,drop}) {
  const [optionsUsers, setOptionsUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const axios = useAxios();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://127.0.0.1:9000/api/ActiveSeller", { headers: authHeader(), withCredentials: true });
        const users = response.data["hydra:member"];
        setOptionsUsers(users.map(user => ({ label: user.nom+' '+user.prenom, value: user.id })));
      } catch (error) {
        console.error('Erreur lors de la requête GET pour les utilisateurs :', error);
      }
    };
console.log('fetchuser');
console.log(drop);
setSelectedUser('');
    fetchUsers();
  }, [drop]);

  const handleUserChange = (selectedOption) => {
    setSelectedUser(selectedOption);
    onSelectUser(selectedOption ? selectedOption.value : null);
  };

  return (
    <div>
      <Select
        name="userId"
        value={selectedUser}
        onChange={handleUserChange}
        options={optionsUsers}
      />
    </div>
  );
}

export default UserDropdown;
