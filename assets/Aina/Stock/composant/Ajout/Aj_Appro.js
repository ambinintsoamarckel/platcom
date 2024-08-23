import React, { useState, useEffect } from "react";
import useAxios from "../../../../api/useAxios";


function AJ_op({ onFormSubmit }) {
  const [formData, setFormData] = useState({ etat: null, motif: '' });
  const [selectedEtat, setSelectedEtat] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const axios = useAxios();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://127.0.0.1:9000/api/users");
        setUsers(response.data["hydra:member"]);
      } catch (error) {
        console.error('Erreur lors de la requête GET pour les utilisateurs :', error);
        setError('Erreur lors de la récupération des utilisateurs.');
      }
    };

    fetchUsers();
  }, []);

 
  

  const handleEtatChange = (e) => {
    setSelectedEtat(e.target.value);
    setFormData((prevData) => ({
      ...prevData,
      etat: e.target.value,
    }));
  };

  const handleMotifChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      motif: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('formData:', formData);
    console.log('selectedEtat:', selectedEtat);


    // Vérifiez si les données sont valides avant de soumettre le formulaire
    if (formData.user !== '' && selectedEtat !== '') {
      onFormSubmit(e, formData);
      // Réinitialiser le formulaire après la soumission
      setFormData({ user: '', etat: null, motif: '' });
      setSelectedEtat('');
    } else {
      console.error('Veuillez remplir tous les champs obligatoires.');
    }
  };

  return (
    <>
      <div className="text-center">
        <h1 className="h4 text-gray-900 mb-4">Ajout Operation</h1>
      </div>
      <form className="user" onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <select
            name="etat"
            value={selectedEtat}
            onChange={handleEtatChange}
            className="form-control text-black bg-default"
          >
            <option value="" disabled={!selectedEtat}>Sélectionnez un état</option>
            <option value={true}>Entrée</option>
            <option value={false}>Sortie</option>
          </select>
        </div>
        <div>
          <textarea
            name="motif"
            value={formData.motif}
            onChange={handleMotifChange}
            className="form-control"
            placeholder="Motif"
            rows="3"
          />
        </div>
        <button type="submit" className="btn btn-success btn-user btn-block">
          Save
        </button>
      </form>
    </>
  );
}

export default AJ_op;
