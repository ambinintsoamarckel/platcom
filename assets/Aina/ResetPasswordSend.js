import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState,useEffect } from 'react';
import AuthService from '../api/auth';
import '../styles/app.css';
import '../styles/bootstrap-slider.css';
import '../styles/bootstrap.min.css';
import '../styles/slick-theme.css';
import '../styles/slick.css';
import axios from '../api/axios';
import Header from '../react/composants/header';
import Footer from '../react/composants/footer';
import { notification } from 'antd';

function ResetSend() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const uuidOnChange = (e) => setEmail(e.target.value);
  const isValid = true;
  const userRoles = JSON.parse(localStorage.getItem('current_user'));
  useEffect(()=>{
    if (userRoles) {
      navigate('../react');
    }

  },[])


  const handleOnSubmit = async (e) => {
    e.preventDefault();
   

      
    if (isValid) {
      try {
        await axios.post('https://127.0.0.1:9000/api/resetPassword',
        {'email':email},
        {
          headers: {
            'Content-Type': 'application/ld+json',
          }
        });
        notification.success({
            message:"Succes",
            description: "Le lien pour rénitialiser votre mot de passe est envoyé à votre adresse email.",
        })

        
      } catch (error) {
        if (error.response) {
            // La requête a été effectuée, mais le serveur a répondu avec un statut autre que 2xx
            if (error.response.status === 400) {
              // Statut 401 : Unauthorized
              notification.error({
                message: "Erreur",
                description: "Erreur de syntaxe.",
              });
            }
              else if (error.response.status === 404) {
                // Statut 401 : Unauthorized
                notification.error({
                  message: "Erreur",
                  description: "L'adresse Email n'existe pas ou appartient à un compte désactivé.",
                });
            }
            else if (error.response.status === 500) {
                // Statut 401 : Unauthorized
                notification.error({
                  message: "Erreur",
                  description: "Erreur d'envoi de mail veuillez réessayez.",
                });
            }  
          }   
        
      
      
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
                <h3 className="bg-gray p-4">Rénitialisation du mot de passe</h3>
                <form action="#" onSubmit={handleOnSubmit}>
                  <fieldset className="p-4">
                    <input className="form-control mb-3" type="email" placeholder="Entrer votre adresse Email ..." required onChange={uuidOnChange} />
                    <button type='submit' className="btn btn-primary font-weight-bold mt-3">Envoyer</button><br/>
                    <Link className="mt-3 d-inline-block text-primary" to="../react">se connecter?</Link>
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
  


export default ResetSend;
