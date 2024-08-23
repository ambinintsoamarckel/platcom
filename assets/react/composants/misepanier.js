import Accordion from 'react-bootstrap/Accordion';
import Select from "react-select";
import React, {useState, useEffect} from "react";


const AddDataComponenty = ({ onAddData, unites, nomprod, id }) => {
  const [newData, setNewData] = useState({ nomprod:  nomprod || '', prixunitaire: 0, quantitecom: '', quantiteL: 0, produits: '', unite:'' });
    const [selectedPrixUnitaire, setSelectedPrixUnitaire] = useState("");
    const [selectedQuantite, setSelectedQuantite] = useState("");

    const handleAddData = () => {
      onAddData(newData);
      setNewData((prevData) => ({
        ...prevData,
        prixunitaire: '',
        quantitecom: ''
      }));
    };
    
    useEffect(() => {
      setNewData((prevData) => ({
        ...prevData,
        nomprod: nomprod && nomprod,
        produits: id && 'api/produits/'+id,
      }));
    }, [nomprod, id]);

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
      setNewData((prevData) => ({
        ...prevData,
        prixunitaire: prixunitaire || '',
        unite: id || '',
      }));
      setSelectedPrixUnitaire(prixunitaire);
      setSelectedQuantite(quantite);
    };


  return(
    <Accordion defaultActiveKey="0">
      <Accordion.Item>
        <Accordion.Header>ajouter au panier</Accordion.Header>
        <Accordion.Body>
          <div>
            <input
            className="form-control my-2 my-lg-1" placeholder="quantite..."
            type="number"
            name="quantitecom"
            value={newData.quantitecom}
            onChange={handleQuantiteChange}
            />
          </div>

          <div>
            <Select
              name="prixunitaire"
              onChange={(selectedOption) => handleUnitChange(selectedOption)}
              options={unites && unites.map((option) => ({ label: option.nomunit, value: option["@id"], quantite: option.quantitestock, prix: option.prix }))}
            />
          </div>

          <div>
            <span className="form-control my-2 my-lg-1">{selectedPrixUnitaire}</span>
            <span className="form-control my-2 my-lg-1">{selectedQuantite}</span>
          </div>

          <div>
            <button onClick={handleAddData} className="btn btn-dark"> Ajouter au panier </button>
          </div>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default AddDataComponenty;