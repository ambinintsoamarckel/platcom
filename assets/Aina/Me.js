import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import useAxios from '../api/useAxios';
import { json, useParams } from 'react-router-dom';
import authHeader from '../api/auth-header';
import AuthService from '../api/auth';
import { useNavigate } from 'react-router-dom';
import useLogout from '../api/useLogoutLino';
import { Modal, Button} from "antd";

const MonCompte = ({setUserRoles}) => {
  const [user, setUser] = useState({
    uuid: '',
    adresse: '',
    telephone: '',
    nom: '',
    prenom: '',
    email: '',
    sexe: '',
  });
  let roles='';
  const { id } = useParams();
  const [selectedAdresse, setSelectedAdresse] = useState(null);
  const [optionsAdresses, setOptionsAdresses] = useState([]);
  const [newAdresseFieldsVisible, setNewAdresseFieldsVisible] = useState(false);
  const [newAdresse, setNewAdresse] = useState({
    ville: '',
    code: '',
  });
  const [enabled,setEnabled]= useState(false);
  const axiosauth= useAxios();
  const navigate= useNavigate();
  const logout=useLogout();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [username,setUsername]=useState('') ;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);



  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await fetchOptions('https://127.0.0.1:9000/api/adresses', setOptionsAdresses);
    await fetchuser();
  };

  const fetchOptions = async (url, setOptions) => {
    try {
      const response = await axios.get(url);
      const data = response.data['hydra:member'];

      if (Array.isArray(data)) {
        setOptions(data);
      } else {
        console.error("Les données récupérées ne sont pas un tableau.");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des options :", error.message);
    }
  };
  const fetchuser = async (url, setOptions) => {
    try {
      const response = await axiosauth.get(`https://127.0.0.1:9000/api/users/${id}`, { headers:authHeader(), withCredentials: true});
      console.log(response.data)
      const data=response.data;
      setUser({
        uuid: data.uuid,
        adresse: data.adresse ? data.adresse['@id'] : '', // Assurez-vous que data.adresse est défini avant d'accéder à data.adresse['@id']
        telephone: data.telephone,
        nom: data.nom,
        prenom: data.prenom,
        email: data.email,
        sexe: data.sexe,
      });
      roles=data.roles;
      setUsername(data.uuid);
      handleAdresseChange({value: user?.adresse?.id,label: data?.adresse?.code+' '+data?.adresse?.ville});
 

      } 
    catch (error) {
      console.error("Erreur lors de la récupération des options :", error.message);
    }
  };
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        // Effectuez une requête POST pour ajouter la nouvelle adresse à votre backend
        const response = await axiosauth.patch(`https://127.0.0.1:9000/api/users/${id}`, user,      {
          headers: {
            'Content-Type': "application/merge-patch+json",
            ...authHeader(), withCredentials: true,
          }
        });
        const user456=JSON.parse(localStorage.getItem('current_user'))
        user456.username=response.data.uuid;
        localStorage.setItem("current_user",JSON.stringify(user456));
        setUserRoles(user456);
        console.log(JSON.parse(localStorage.getItem('current_user')));

        navigate('/react/Admin/User')

      } catch (error) {
        console.error("Erreur lors de l'ajout de l'adresse :", error);
      }
   
    // Envoyer les données d'utilisateur où vous en avez besoin
};
const handleDelete = async(e) => {
  e.preventDefault();
  try {
      // Effectuez une requête POST pour ajouter la nouvelle adresse à votre backend
      const response = await axiosauth.patch(`https://127.0.0.1:9000/api/users/${id}`, {isactive: false},      {
        headers: {
          'Content-Type': "application/merge-patch+json",
          ...authHeader(), withCredentials: true,
        }
      });
      await logout();

      navigate('/react')

    } catch (error) {
      console.error("Erreur lors de l'ajout de l'adresse :", error);
    }
 
  // Envoyer les données d'utilisateur où vous en avez besoin
};

  const handleAdresseChange = (selectedOption) => {
    const { value: id, label: ville } = selectedOption || {};

    setUser((prevUser) => {
      const newUser = { ...prevUser, adresse: id };
      return newUser;
    });

    setSelectedAdresse(selectedOption ? selectedOption : null);
  };

  const options = [
    { label: 'Homme', value: true },
    { label: 'Femme', value: false },
  ];

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

  const handleAjouterClick = () => {
    setNewAdresseFieldsVisible(true);
  };

  const handleAjouterAdresseClick = async () => {
    try {
      const response = await axios.post('https://127.0.0.1:9000/api/adresses', newAdresse, {
        headers: {
          'Content-Type': 'application/ld+json',
        },
      });

      fetchData();

      handleAdresseChange({ label: response.data.code + ' ' + response.data.ville, value: response.data['@id'] });

      setNewAdresse({
        ville: '',
        code: '',
      });

      setNewAdresseFieldsVisible(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'adresse :", error);
    }
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === 'currentPassword') {
      setCurrentPassword(value);
    } else if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmNewPassword') {
      setConfirmNewPassword(value);
    }
  };


  const handleToggleChangePassword = () => {
    setChangePasswordMode(!changePasswordMode);
  };
  const handleSubmitPassword = async () => {
    try {
      console.log(username);
      await AuthService.login(username,currentPassword);
      console.log(username);
      const response = await axiosauth.patch(`https://127.0.0.1:9000/api/users/${id}`, {password: newPassword},      {
        headers: {
          'Content-Type': "application/merge-patch+json",
          ...authHeader(), withCredentials: true,
        }
      });
      await logout();
      await AuthService.login(username,newPassword);
      setConfirmNewPassword('');
      setNewPassword('');
      setChangePasswordMode(!changePasswordMode);
    } catch (error) {
      console.error(error)
      
    }

  };
  const showDeleteModal = () => {
    setDeleteModalVisible(true);
  };
  
  const hideDeleteModal = () => {
    setDeleteModalVisible(false);
  };
  

  const renderChangePasswordFields = () => {
    if (changePasswordMode) {
      return (
        <>
          <div>
            <label>Ancien Mot de Passe:</label>
            <input
              type="password"
              name="currentPassword"
              className="form-control"
              value={currentPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            <label>Nouveau Mot de Passe:</label>
            <input
              type="password"
              name="newPassword"
              className="form-control"
              value={newPassword}
              onChange={handlePasswordChange}
            />
          </div>
          <div>
            <label>Confirmer Nouveau Mot de Passe:</label>
            <input
              type="password"
              name="confirmNewPassword"
              className="form-control"
              value={confirmNewPassword}
              onChange={handlePasswordChange}
            />
        <button className="btn btn-success font-weight-bold ms-2" type="button" onClick={handleSubmitPassword}>
          Enregistrer
        </button>


          </div>
        </>
      );
    }
    return null;
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
                        disabled={!enabled}
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
                        disabled={!enabled}
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
                        disabled={!enabled}
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
                        disabled={!enabled}
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
                      isDisabled={!enabled}
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
                      disabled={!enabled}
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
                      isDisabled={!enabled}
                
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
                        <button type="button" className="btn btn-primary mt-2" onClick={handleAjouterAdresseClick} disabled={!enabled}>
                          Ajouter Adresse
                        </button>
                      </>
                    )}
                  </div>
                  <button type="button" className="btn btn-secondary mt-2" onClick={handleAjouterClick} disabled={!enabled}>
                    Ajouter
                  </button>
                </div>
                <div className="mb-3">
                <h5>Changer le Mot de Passe</h5>
                  <button
                    type="button"
                    className="btn btn-secondary mt-2"
                    onClick={handleToggleChangePassword}
                  >
                    Changer le Mot de Passe
                  </button>
                  {renderChangePasswordFields()}

                </div>
              </fieldset>
              <div className="my-2">
              <button
                type="button"
                className="btn btn-primary font-weight-bold m-8"
                onClick={() => setEnabled(!enabled)}
                style={{ marginRight: '8px' }}
              >
                {enabled ? "Annuler" : "Modifier"}
              </button>
              {
                enabled && (
                  <button
                    type="submit"
                    className="btn btn-success font-weight-bold ms-2"
                    disabled={!enabled}
                    onClick={handleSubmit}
                    style={{ marginRight: '8px' }}
                  >
                    Enregistrer
                  </button>
                )
              }
            </div>

            <div className="my-2 mb-3">
              <button
                type="button"
                danger
                className="btn btn-outline-danger bg-danger sweet-confirm font-weight-bold  "
                onClick={showDeleteModal}
                style={{ marginRight: '8px' }}
              >
                Supprimer mon Compte
              </button>
              <Modal
                title="Confirmation de suppression"
                visible={deleteModalVisible}
                onOk={handleDelete}
                onCancel={hideDeleteModal}
                okText="Supprimer"
                cancelText="Annuler"
              >
                <p>Êtes-vous sûr de vouloir supprimer cet élément?</p>
              </Modal>
            </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonCompte;
