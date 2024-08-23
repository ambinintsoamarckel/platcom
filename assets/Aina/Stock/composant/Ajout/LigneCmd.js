import React, { useState, useEffect } from "react";
import useAxios from "../../../../api/useAxios";
import Select from "react-select";
import authHeader from "../../../../api/auth-header";

const AddDataComponent = ({ onAddData }) => {
  const [newData, setNewData] = useState({ nomprod: '', prixunitaire: 0, quantitecom: 0, quantiteL: 0, produits:'', unite:'',quantitestock:'', });
  const [optionsTp, setOptionsTp] = useState([]);
  const [optionsPu, setOptionsPu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isValidTypeProduit, setIsValidTypeProduit] = useState(false);
  const [isValidPrixUnitaire, setIsValidPrixUnitaire] = useState(false);
  const [isValidQuantity, setIsValidQuantity] = useState(false);
  const [isValidQuantityl, setIsValidQuantityl] = useState(false);
  const [isValidData, setIsValidData] = useState(false);
  const [selectedTypeProduitLabel, setSelectedTypeProduitLabel] = useState(null);
  const [selectedPrixUnitaireLabel, setSelectedPrixUnitaireLabel] = useState(null);
  const axios = useAxios();


  useEffect(() => {
    const fetchData = async () => {
      // Effectuez une requête pour récupérer les options pour Type de produit (Tp) depuis la base de données
      await fetchOptions(`https://127.0.0.1:9000/api/produits_no_pagination` , setOptionsTp);

      // Effectuez une requête pour récupérer les options pour Prix unitaire (Pu) depuis la base de données

      // Mettre à jour l'état isValidData initial
      updateIsValidData();
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

  setIsValidTypeProduit(!!nomprod);

  setNewData((prevData) => ({
    ...prevData,
    nomprod: nomprod === '' ? null : nomprod,
    produits: id === '' ? null : id,
    prixunitaire: selectedUnite.length > 0 ? selectedUnite[0].prix : '',
    unite: selectedUnite.length > 0 ? selectedUnite[0]["@id"] : '',
    quantitestock: selectedUnite.length > 0 ? selectedUnite[0].quantitestock : '',
  }));

  setOptionsPu(selectedUnite);
 

  setIsValidPrixUnitaire(selectedUnite.length > 0);

  updateIsValidData();

  // Mettre à jour le libellé du type de produit sélectionné
  setSelectedTypeProduitLabel(selectedOption ? selectedOption  : null);
  // Sélectionner la première unité si des unités sont disponibles
  if (selectedUnite.length > 0) {
    setSelectedPrixUnitaireLabel({ label: selectedUnite[0].prix, value: selectedUnite[0]["@id"],quantitestock:selectedUnite[0].quantitestock });
  } else {
    // Si aucune unité n'est disponible, réinitialiser la sélection
    setSelectedPrixUnitaireLabel(null);
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

  // Mettre à jour l'état de la validité du prix unitaire
  setIsValidPrixUnitaire(!!prixunitaire);
  // Mettre à jour le libellé du prix unitaire sélectionné
  setSelectedPrixUnitaireLabel(selectedOption);
  // Mettre à jour la validation des données
  updateIsValidData();
};


  const handleQuantiteChange = (e) => {
    const { name, value } = e.target;
    const isValid = !isNaN(value) && parseInt(value) >= 0 && parseInt(value) <= newData.quantitecom;
    setNewData((prevData) => ({
      ...prevData,
      [name]: parseInt(value) ? parseInt(value) : null ,
      
    }));
    setIsValidQuantity(isValid);
    updateIsValidData();
  };

  const handleQuantitelChange = (e) => {
    const { name, value } = e.target;
    const isValid = !isNaN(value) && parseInt(value) >= 0 && parseInt(value) <= newData.quantiteL;
    setNewData((prevData) => ({
      ...prevData,
      [name]: parseInt(value) ? parseInt(value) : null ,
    }));
    setIsValidQuantityl(isValid);
    updateIsValidData();
  };

  const updateIsValidData = () => {
    setIsValidData(
      isValidTypeProduit &&
      isValidPrixUnitaire &&
      isValidQuantity &&
      isValidQuantityl
    );
  };

  const handleAddData = () => {
    const isValidData =
      isValidTypeProduit &&
      isValidPrixUnitaire &&
      isValidQuantity &&
      isValidQuantityl &&
      !isNaN(newData.quantitecom) &&
      !isNaN(newData.quantiteL);

    if (isValidData) {
      onAddData(newData);
      setNewData({ nomprod: '', prixunitaire: '', quantitecom: '', quantiteL: ''});
      setIsValidTypeProduit(false);
      setIsValidPrixUnitaire(false);
      setIsValidQuantity(false);
      setIsValidQuantityl(false);
      setIsValidData(false);
    } else {
      setIsValidData(false);
    }
  };

  return (
    <div>
      {loading && <p>Chargement des options...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
  <label>Type de produit:</label>
  <Select
    name="nomprod"
    className={`form-control text-black bg-secondary ${isValidTypeProduit ? '' : 'is-invalid'}`}
    value={selectedTypeProduitLabel}
    onChange={(selectedOption) => handleTypeProduitChange(selectedOption)}
    options={optionsTp.map((option) => ({ label: option.nomprod, value: option['@id'] }))}
  />

  {!isValidTypeProduit && <div className="invalid-feedback">Veuillez sélectionner un type de produit.</div>}
</div>

<div>
  <label>Prix unitaire:</label>
  <Select
    name="prixunitaire"
    className={`form-control text-black bg-secondary ${isValidPrixUnitaire ? '' : 'is-invalid'}`}
    value={selectedPrixUnitaireLabel}
    onChange={(selectedOption) => handleUnitChange(selectedOption)}
    options={optionsPu.map((option) => ({ label: option.prix, value: option["@id"], quantitestock:option.quantitestock }))}
  />

  {!isValidPrixUnitaire && <div className="invalid-feedback">Veuillez sélectionner un prix unitaire.</div>}
</div>

      <div>
        <label>Quantité:</label>
        <input
          type="text"
          name="quantitecom"
          className={`form-control text-black bg-secondary ${isValidQuantity ? '' : 'is-invalid'}`}
          value={newData.quantitecom}
          onChange={handleQuantiteChange}
        />
        {!isValidQuantity && <div className="invalid-feedback">La quantité doit être un nombre positif et ne doit pas dépasser la quantité en stock ({newData.quantitestock}).</div>}
      </div>
      <div>
        <label>Quantité livrée:</label>
        <input
          type="text"
          name="quantiteL"
          className={`form-control text-black bg-secondary ${isValidQuantityl ? '' : 'is-invalid'}`}
          value={newData.quantiteL}
          onChange={handleQuantitelChange}
        />
        {!isValidQuantityl && <div className="invalid-feedback">La quantité livrée doit être un nombre positif et ne doit pas dépasser la quantité commandée ({newData.quantitecom}).</div>}
      </div>
      <div>
        <label>Quantité en stock:</label>
        <span>{newData.quantitestock}</span>
      </div>
      <button
        type="submit"
        className="btn btn-secondary btn-user btn-block"
        onClick={handleAddData}
        disabled={!isValidData}
      >
        Add
      </button>
    </div>
  );
};

export default AddDataComponent;
