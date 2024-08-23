import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import axios from '../api/axios';
import '../styles/app.css';
import '../styles/bootstrap-slider.css';
import '../styles/bootstrap.min.css';
import '../styles/slick-theme.css';
import '../styles/slick.css';
import Header from '../react/composants/header';
import Footer from '../react/composants/footer';
import { notification } from 'antd';

function ResetReceive() {
  const navigate = useNavigate();
  const [uuid, setUuid] = useState(null);
  const [id, setId] = useState('');
  const [password, setPassword] = useState(null);
  const isValid = true;
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const { token } = useParams();
  const userRoles = JSON.parse(localStorage.getItem('current_user'));
  useEffect(()=>{
    if (userRoles) {
      navigate('../react');
    }
    loadData();

  },[])


  const loadData= async()=>{
    try {
      const response= await axios.get(`https://127.0.0.1:9000/api/resetPassword/${token}`)
      setId(response.data.id&&response.data.id);
    } catch (error) {
      if (error.response) {
        // La requête a été effectuée, mais le serveur a répondu avec un statut autre que 2xx
        if (error.response.status === 401) {
          // Statut 401 : Unauthorized
          notification.error({
            message: "Erreur",
            description: "Token invalide.",
          });
        }
          else if (error.response.status === 403) {
            // Statut 401 : Unauthorized
            notification.error({
              message: "Erreur",
              description: "Token expiré.",
            });
        }
        else if (error.response.status === 500) {
            // Statut 401 : Unauthorized
            notification.error({
              message: "Erreur",
              description: "Erreur du serveur.",
            });
        }  
      } 
      navigate('../react');  
    
      
    }
    

  }
  console.log(id);
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
   if (name === 'newPassword') {
      setNewPassword(value);
    } else if (name === 'confirmNewPassword') {
      setConfirmNewPassword(value);
    }
  };

  const handleSubmitPassword = async () => {
    try {
      console.log(username);
      await AuthService.login(username,currentPassword);
      console.log(username);
      const response = await axiosauth.patch(`https://127.0.0.1:9000/api/reset/${id}`, {password: newPassword},      {
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
    const handleOnSubmit = async (e) => {
      e.preventDefault();
      if (isValid) {
        try {
          const response = await axios.patch(`https://127.0.0.1:9000/api/reset/${id}`, {password: newPassword},      {
            headers: {
              'Content-Type': "application/merge-patch+json",
            }
          });
          navigate('../react');  
    

        } catch (error) {
  console.error(error);
        }
      }
    };
  
    return (
      <>
        <Header />
  
        <section className="login py-5 border-top-1">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-5 col-md-8 align-item-center">
                <div className="border">
                  <h3 className="bg-gray p-4">Rénitialisation de mot de passe</h3>
                  <form action="#" onSubmit={handleOnSubmit}>
                    <fieldset className="p-4">
                    <div>
                      <label>Nouveau Mot de Passe:</label>
                      <input
                        type="password"
                        name="newPassword"
                        className="form-control"
                        value={newPassword}
                        onChange={handlePasswordChange}
                      />
              
                      <label>Confirmer Nouveau Mot de Passe:</label>
                      <input
                        type="password"
                        name="confirmNewPassword"
                        className="form-control"
                        value={confirmNewPassword}
                        onChange={handlePasswordChange}
                      />
                    </div>
                      <button type='submit' className="btn btn-primary font-weight-bold mt-3">Enregistrer</button><br />
                      <Link className="mt-3 d-block text-primary" to="../react">Se connecter?</Link>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        <Footer />
      </>
    );

  }
 


export default ResetReceive;
