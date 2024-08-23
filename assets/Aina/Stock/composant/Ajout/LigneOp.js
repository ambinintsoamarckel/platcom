import React, { useState, useEffect } from "react";
import useAxios from "../../../../api/useAxios";
import Select from "react-select";
import authHeader from "../../../../api/auth-header";

const AddDataComponent = ({ onAddData }) => {
  const [newData, setNewData] = useState({ nomprod: '', prixunitaire: 0, quantite: 0, produit:'', unite:'' ,quantitestock:''});
  const [optionsTp, setOptionsTp] = useState([]);
  const [optionsPu, setOptionsPu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTypeProduitLabel, setSelectedTypeProduitLabel] = useState(null);
  const [selectedPrixUnitaireLabel, setSelectedPrixUnitaireLabel] = useState(null);
  const axios = useAxios();

  useEffect(() => {
    const fetchData = async () => {
      // Effectuez une requête pour récupérer les options pour Type de produit (Tp) depuis la base de données
      await fetchOptions(`https://127.0.0.1:9000/api/produits_no_pagination`, setOptionsTp);

      // Effectuez une requête pour récupérer les options pour Prix unitaire (Pu) depuis la base de données

    };

    fetchData();
  }, []);

  const fetchOptions = async (url, setOptions) => {
    try {
      const response = await axios.get(url, { headers:authHeader(), withCredentials: true});
      const data = response.data["hydra:member"];

      // Assurez-vous que data est un tableau avant de définir les options
      if (Array.isArray(data)) {
        setOptions(data); // Définissez les options à l'aide de setOptions
      } else {
        console.error("Les données récupérées ne sont pas un tableau.");
        setError("Erreur lors de la récupération des options : données invalides");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des options :", error.message);
      setError(`Erreur lors de la récupération des options : ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

const handleTypeProduitChange = (selectedOption) => {
  const { value: id, label: nomprod } = selectedOption || {};
 

  const selectedTypeProduit = optionsTp.find((option) => option.nomprod === nomprod);
  const selectedUnite = selectedTypeProduit ? selectedTypeProduit.unites || [] : [];


  setNewData((prevData) => ({
    ...prevData,
    nomprod: nomprod === '' ? '' : nomprod,
    produit: id === '' ? '' : id,
    prixunitaire: selectedUnite.length > 0 ? selectedUnite[0].prix : '',
    unite: selectedUnite.length > 0 ? selectedUnite[0]["@id"] : '',
    quantitestock: selectedUnite.length > 0 ? selectedUnite[0].quantitestock : '',
  }));

  setOptionsPu(selectedUnite);




  // Mettre à jour le libellé du type de produit sélectionné
  setSelectedTypeProduitLabel(selectedOption ? selectedOption  : '');
  // Sélectionner la première unité si des unités sont disponibles
  if (selectedUnite.length > 0) {
    setSelectedPrixUnitaireLabel({ label: selectedUnite[0].prix, value: selectedUnite[0]["@id"] });
  } else {
    // Si aucune unité n'est disponible, réinitialiser la sélection
    setSelectedPrixUnitaireLabel('');
  }
};

  
const handleUnitChange = (selectedOption) => {
  const { value: id, label: prixunitaire ,quantitestock:quantitestock } = selectedOption || {};
  // Mettre à jour le newData avec les valeurs sélectionnées
   setNewData((prevData) => ({
    ...prevData,
    prixunitaire: prixunitaire || '',
    unite: id || '',
    quantitestock: quantitestock|| '',

  })); 

  // Mettre à jour le libellé du prix unitaire sélectionné
  setSelectedPrixUnitaireLabel(selectedOption);
  // Mettre à jour la validation des données

};


  const handleQuantiteChange = (e) => {
    const { name, value } = e.target;
    setNewData((prevData) => ({
      ...prevData,
      quantite: parseInt(value) ? parseInt(value) : '' ,
      
    }));

  };

  

  const handleAddData = () => {

      !isNaN(newData.quantite);

      onAddData(newData);
      setNewData({ nomprod: '', prixunitaire: '', quantite: '', produit:''});
   
  
  };

  return (
    <div>
      {loading && <p>Chargement des options...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
  <label>Type de produit:</label>
  <Select
    name="nomprod"
    value={selectedTypeProduitLabel}
    onChange={(selectedOption) => handleTypeProduitChange(selectedOption)}
    options={optionsTp.map((option) => ({ label: option.nomprod, value: option['@id'] }))}
  />
</div>

<div>
  <label>Prix unitaire:</label>
  <Select
    name="prixunitaire"
    value={selectedPrixUnitaireLabel}
    onChange={(selectedOption) => handleUnitChange(selectedOption)}
    options={optionsPu.map((option) => ({ label: option.prix, value: option["@id"], quantitestock:option.quantitestock }))}
  />


</div>

      <div>
        <label>Quantité:</label>
        <input
          type="text"
          name="quantite"

          value={newData.quantite}
          onChange={handleQuantiteChange}
        />
      </div>
      <div>
        <label>Quantité en stock:</label>
        <span>{newData.quantitestock}</span>
      </div>
      <button
        type="submit"
        className="btn btn-secondary btn-user btn-block"
        onClick={handleAddData}
      >
        Add
      </button>
    </div>
  );
};

export default AddDataComponent;
