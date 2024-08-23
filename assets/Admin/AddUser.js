import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Select from "react-select";

import '../styles/app.css'
import '../styles/bootstrap-slider.css'
import '../styles/bootstrap.min.css'
import '../styles/slick-theme.css'
import '../styles/slick.css'

import Header from '../react/composants/header';
import Footer from '../react/composants/footer';
import useAxios from '../api/useAxios';
import authHeader from '../api/auth-header';
import { useNavigate } from 'react-router-dom';

const AddUser = ({setUserDrop}) => {
    const [user, setUser] = useState({
        uuid: '',
        roles: [""],
        password: '',
        adresse:'',
        telephone: '',
        nom: '',
        prenom: '',
        email: '',
        sexe: true
    });
    const [selectedAdresse, setSelectedAdresse] = useState(null);
    const [optionsAdresses, setOptionsAdresses] = useState([]);
    const [newAdresseFieldsVisible, setNewAdresseFieldsVisible] = useState(false);
    const [newAdresse, setNewAdresse] = useState({
      ville: '',
      code: ''
    });
    const axios= useAxios();
    const navigate=useNavigate();
    useEffect(() => {

    
        fetchData();
      }, []);
      const fetchData = async () => {
        // Effectuez une requête pour récupérer les options pour Adresse depuis la base de données
        await fetchOptions("https://127.0.0.1:9000/api/adresses", setOptionsAdresses);
  
        // Vous pouvez ajouter d'autres requêtes pour d'autres options si nécessaire
  
        // Vous pouvez également mettre à jour l'état initial ou d'autres logiques si nécessaire
      };
    
      const fetchOptions = async (url, setOptions) => {
        try {
          const response = await axios.get(url);
          const data = response.data["hydra:member"];
    
          // Assurez-vous que data est un tableau avant de définir les options
          if (Array.isArray(data)) {
            setOptions(data); 
            // Définissez les options à l'aide de setOptions
          } else {
            console.error("Les données récupérées ne sont pas un tableau.");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des options :", error.message);
          
        } 
      };
    
      const handleAdresseChange = (selectedOption) => {
        const { value: id, label: ville } = selectedOption || {};
    
        setUser((prevUser) => {
            const newUser = { ...prevUser, adresse: id };
            return newUser;
        });
    
        // Mettez à jour le libellé de l'adresse sélectionnée si nécessaire
        setSelectedAdresse(selectedOption ? selectedOption : null);
        // Ajoutez d'autres logiques ici en fonction de ce que vous devez faire avec l'adresse sélectionnée
      };

    const options = [{ label: "Homme", value: true }, { label: "Femme", value: false }];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => {
            const newUser = { ...prevUser, [name]: value };
            return newUser;
        });
    };

    const handleSelectChange = (selectedOption, action) => {
        setUser((prevUser) => {
            const newUser = { ...prevUser, [action.name]: selectedOption.value };
            return newUser;
        });
    };

    

    const handleSubmit = async(e) => {
        e.preventDefault();
        try {
            // Effectuez une requête POST pour ajouter la nouvelle adresse à votre backend
            const response = await axios.post("https://127.0.0.1:9000/api/user", user,
        
            {
              headers: {
                'Content-Type': 'application/ld+json',
                ...authHeader(), withCredentials: true,
              }
            });
            setUserDrop((prevState) => !prevState); 
            navigate('/react/Admin/User');

          } catch (error) {
            console.error("Erreur lors de l'ajout de l'adresse :", error);
          }
       
        // Envoyer les données d'utilisateur où vous en avez besoin
    };
    const handleNewAdresseChange = (e) => {
        const { name, value } = e.target;
        setNewAdresse((prevNewAdresse) => ({
          ...prevNewAdresse,
          [name]: name === "code" ? parseInt(value) || '' : value
        }));
      };
      
    
      const handleAjouterClick = () => {
        setNewAdresseFieldsVisible(true);
      };
    
      const handleAjouterAdresseClick = async () => {
        try {
          // Effectuez une requête POST pour ajouter la nouvelle adresse à votre backend
          const response = await axios.post("https://127.0.0.1:9000/api/adresses", newAdresse,      {
            headers: {
              'Content-Type': 'application/ld+json',
            }
          });
    
          // Mettez à jour les options d'adresse avec la nouvelle adresse

          
          fetchData();
    
          // Sélectionnez la nouvelle adresse dans le formulaire
          handleAdresseChange({ label: response.data.code+' '+response.data.ville, value: response.data['@id'] });
    
          // Réinitialisez les champs de la nouvelle adresse
          setNewAdresse({
            ville: '',
            code: ''
          });
    
          // Masquez les champs de la nouvelle adresse
          setNewAdresseFieldsVisible(false);
        } catch (error) {
          console.error("Erreur lors de l'ajout de l'adresse :", error);
        }
      };
      const roleOptions = [
        { value: 'ROLE_BUYER', label: 'Acheteur' },
        { value: 'ROLE_SELLER', label: 'Vendeur' },
        { value: 'ROLE_ADMIN', label: 'Administrateur' },
      ];
    
      // Mettez à jour le state lorsqu'une option est sélectionnée dans le sélecteur de rôles
      const handleRoleChange = (selectedOption) => {
        setUser((prevUser) => ({
          ...prevUser,
          roles: [selectedOption.value],
        }));
      };
    

      return (
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="border p-4 mt-4">
                <h3 className="bg-gray p-3 mb-4">Mon Compte</h3>
                <form>
                  <fieldset className="p-3 mb-4">
                    <div className="mb-3">
                      <h5>Identité</h5>
                      <div className="d-flex justify-content-between">
                        <div>
                          <label>Nom:</label>
                          <input
                            className="form-control"
                            type="text"
                            name="nom"
                            value={user.nom}
                            onChange={handleInputChange}
                            
                          />
                        </div>
                        <div>
                          <label>Prénom:</label>
                          <input
                            className="form-control"
                            type="text"
                            name="prenom"
                            value={user.prenom}
                            onChange={handleInputChange}
                            
                          />
                        </div>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div>
                          <label>Username:</label>
                          <input
                            className="form-control"
                            type="text"
                            name="uuid"
                            value={user.uuid}
                            onChange={handleInputChange}
                            
                          />
                        </div>
                        <div>
                          <label>Email:</label>
                          <input
                            className="form-control"
                            type="email"
                            name="email"
                            value={user.email}
                            onChange={handleInputChange}
                            
                          />
                        </div>
                      </div>
                      <div>
                        <label>Sexe:</label>
                        <Select
                          name="sexe"
                          value={options.find((option) => option.value === user.sexe)}
                          options={options}
                          onChange={handleSelectChange}
                       
                        />
    
                      </div>
                      <div>
                        <label>Téléphone:</label>
                        <input
                          type="tel"
                          id="telephone"
                          className="form-control"
                          name="telephone"
                          pattern="[0-9]{10}"
                          value={user.telephone}
                          onChange={handleInputChange}
                          
                        />
                      </div>
                      <div className="mb-3">
                  <h5>Type</h5>
                  <Select
                    name="roles"
                    value={roleOptions.find((option) => option.value === user.roles[0])}
                    options={roleOptions}
                    onChange={handleRoleChange}
                  />
                </div>
                    </div>
    
                    <div className="mb-3">
                      <h5>Adresse</h5>
                      <div>
                        <label>Adresse:</label>
                        <Select
                          name="adresse"
                          value={selectedAdresse}
                          onChange={(selectedOption) => handleAdresseChange(selectedOption)}
                          options={optionsAdresses.map((option) => ({ label: option.code + ' ' + option.ville, value: option['@id'] }))}
                          isCreatable={true}
                          formatCreateLabel={(inputValue) => `Ajouter "${inputValue}"`}

                    
                        />
                        {newAdresseFieldsVisible && (
                          <>
                            <input
                              type="text"
                              name="ville"
                              className="form-control mt-2"
                              placeholder="Ville"
                              value={newAdresse.ville}
                              onChange={handleNewAdresseChange}
                            />
                            <input
                              type="text"
                              name="code"
                              className="form-control mt-2"
                              placeholder="Code"
                              value={newAdresse.code}
                              onChange={handleNewAdresseChange}
                            />
                            <button type="button" className="btn btn-primary mt-2" onClick={handleAjouterAdresseClick} >
                              Ajouter Adresse
                            </button>
                          </>
                        )}
                      </div>
                      <button type="button" className="btn btn-secondary mt-2" onClick={handleAjouterClick} >
                        Ajouter
                      </button>
                    </div>
                    <div className="mb-3">
                    <h5>Mot de Passe</h5>

                    <input
                    className="form-control mb-3"
                    type="password"
                    placeholder="Password*"
                    name="password"
                    value={user.password}
                    onChange={handleInputChange}
                    required
                    />

                    <input
                    className="form-control mb-3"
                    type="password"
                    name='password'
                    placeholder="Confirm Password*"
                    value={user.confirmPassword}
                    onChange={handleInputChange}
                    required
                    />

                    </div>
                  </fieldset>
                
                    <button type="submit" className="btn btn-success font-weight-bold ms-2"  onClick={handleSubmit}>
                    Ajouter
                  </button>
                    
                  
                </form>
              </div>
            </div>
          </div>
        </div>
      );
}

export default AddUser;



