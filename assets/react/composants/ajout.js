import React from 'react';
import { useState } from 'react';

const AddDataComponent = ({ onAddData }) => {
    const [newData, setNewData] = useState({ nom: '', type: '', prix: '' });
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  
    const handleAddData = () => {
      onAddData(newData);
      setNewData({ nom: '', type: '', prix: '' });
    };
  
    return (
      <div>
        <h2>Ajouter des données</h2>
        <div>
          <label>Nom:</label>
          <input type="text" name="nom" value={newData.nom} onChange={handleInputChange} />
        </div>
        <div>
          <label>Type:</label>
          <input type="text" name="type" value={newData.type} onChange={handleInputChange} />
        </div>
        <div>
          <label>Prix:</label>
          <input type="text" name="prix" value={newData.prix} onChange={handleInputChange} />
        </div>
        <button onClick={handleAddData}>Ajouter</button>
      </div>
    );
  };

  export default AddDataComponent;
  