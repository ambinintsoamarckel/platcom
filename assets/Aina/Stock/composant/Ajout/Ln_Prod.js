import React, { useState } from 'react';

const AddDataComponent = ({ onAddData }) => {
  const [newData, setNewData] = useState({
    nomunit: '',
    limite: '',
    prix: '',
    quantitestock: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]: parseInt(value)? parseInt(value): '',
    }));
  };
  const handleInputTextChange = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      [name]: value ? value : '',
    }));
  };

  const handleAddData = () => {
    onAddData({ ...newData });
    setNewData({
      nomunit: '',
      limite: '',
      prix: '',
      quantitestock: '',
    });
  };


  return (
    <div className="d-flex justify-content-end align-items-center my-3">
      <div>
        <input
          className="form-control text-black bg-default"
          type="text"
          name="nomunit"
          value={newData.nomunit}
          onChange={handleInputTextChange}
          placeholder="Nom de l'unité"
        />
      </div>

      <div>
        <input
          className="form-control text-black bg-default"
          type="text"
          name="limite"
          value={newData.limite}
          onChange={handleInputChange}
          placeholder="Limite"
        />
      </div>

      <div>
        <input
          className="form-control text-black bg-default"
          type="text"
          name="prix"
          value={newData.prix}
          onChange={handleInputChange}
          placeholder="Prix"
        />
      </div>

      <div>
        <input
          className="form-control text-black bg-default"
          type="text"
          name="quantitestock"
          value={newData.quantitestock}
          onChange={handleInputChange}
          placeholder="Quantité"
        />
      </div>

      <div className="col-sm-1">
        <button type="button" className="btn btn-outline-secondary" onClick={handleAddData}>
          +
        </button>
      </div>
    </div>
  );
};

export default AddDataComponent;
