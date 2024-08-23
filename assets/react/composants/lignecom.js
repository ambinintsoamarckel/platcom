import React, { useState, useEffect } from "react";
import Select from "react-select";

const AddDataComponent = ({ onAddData, unites, nomprod, id }) => {
    const [newData, setNewData] = useState({ nomprod:  nomprod || '', prixunitaire: 0, quantitecom: '', quantiteL: 0, produits: '', unite:'' });
    const [selectedPrixUnitaire, setSelectedPrixUnitaire] = useState("");
    const [selectedQuantite, setSelectedQuantite] = useState("");

   

    const handleAddData = () => {
      // Utilisez la version mise à jour de newData
      onAddData(newData);
    
      // Réinitialisez seulement les champs pertinents, sans toucher aux autres
      setNewData((prevData) => ({
        ...prevData,
        prixunitaire: '',
        quantitecom: ''
      }));
    };
    

    useEffect(() => {
      setNewData((prevData) => ({
        ...prevData,
        nomprod: nomprod&& nomprod,
        produits: id && 'api/produits/'+id,
      }));
    }, [nomprod,id]);
    

    const handleQuantiteChange = (e) => {
        const { name, value } = e.target;
        setNewData((prevData) => ({
          ...prevData,
          [name]: parseInt(value) ? parseInt(value) : null ,
          quantiteL: parseInt(value) ? parseInt(value) : null ,
          
        }));
    };

    const handleUnitChange = (selectedOption) => {
      const { value: id, quantite: quantite, prix: prixunitaire} = selectedOption || {};
      // Mettre à jour le newData avec les valeurs sélectionnées
      setNewData((prevData) => ({
        ...prevData,
        prixunitaire: prixunitaire || '',
        unite: id || '',
      }));
      setSelectedPrixUnitaire(prixunitaire);
      setSelectedQuantite(quantite);
    };


    

    return(
        <>
            <div>
                <input
                className="form-control my-2 my-lg-1" placeholder="quantite..."
                type="text"
                name="quantitecom"
                value={newData.quantitecom}
                onChange={handleQuantiteChange}
                />
            </div>

            {/* <div></div> */}

            <Select
            name="prixunitaire"

            onChange={(selectedOption) => handleUnitChange(selectedOption)}
            options={unites && unites.map((option) => ({ label: option.nomunit, value: option["@id"], quantite: option.quantitestock, prix: option.prix }))}
          />

              <span className="form-control my-2 my-lg-1">{selectedPrixUnitaire}</span>
              <span className="form-control my-2 my-lg-1">{selectedQuantite}</span>

            <li className="list-inline-item"><button onClick={handleAddData} className="btn btn-offer d-inline-block btn-primary ml-n1 my-1 px-lg-4 px-md-3"> Ajouter au panier </button></li>
        </>
    );

}

export default AddDataComponent;