import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthService from '../api/auth';
import '../styles/app.css';
import '../styles/bootstrap-slider.css';
import '../styles/bootstrap.min.css';
import '../styles/slick-theme.css';
import '../styles/slick.css';
import Header from '../react/composants/header';
import Footer from '../react/composants/footer';
import { notification } from 'antd';

function Login() {
  const [uuid, setUuid] = useState(null);
  const [password, setPassword] = useState(null);
  const uuidOnChange = (e) => setUuid(e.target.value);
  const passwordOnChange = (e) => setPassword(e.target.value);
  const isValid = true;
  const navigate = useNavigate();

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (isValid) {
      try {
        await AuthService.login(uuid, password);

        const userRoles = JSON.parse(localStorage.getItem('current_user'));
        console.log(localStorage.getItem('current_user'));

        if (userRoles && userRoles.role.includes('ROLE_BUYER')) {
          navigate('../react/lino');
          /*  window.location.reload(); */
        } else if (userRoles && userRoles.role.includes('ROLE_SELLER')) {
          navigate('../react/Zafy');
        } else if (userRoles && userRoles.role.includes('ROLE_ADMIN')) {
          navigate('../react/Admin');
        }
      } catch (error) {
/*         notification.error({
          message: "Erreur Interne du Serveur",
          description: "Une erreur interne du serveur s'est produite. Veuillez réessayer plus tard.",
        }); */
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
                <h3 className="bg-gray p-4">se connecter</h3>
                <form action="#" onSubmit={handleOnSubmit}>
                  <fieldset className="p-4">
                    <input className="form-control mb-3" type="text" placeholder="Username" required onChange={uuidOnChange} />
                    <input className="form-control mb-3" type="password" placeholder="Password" onChange={passwordOnChange} />
                    <div className="loggedin-forgot">
                      <input type="checkbox" id="keep-me-logged-in" />
                      <label htmlFor="keep-me-logged-in" className="pt-3 pb-2">se souvenir de moi</label>
                    </div>
                    <button type='submit' className="btn btn-primary font-weight-bold mt-3">connexion</button>
                    <Link className="mt-3 d-block text-primary" to="../react/reset">mot de passe oublié?</Link>
                    <Link className="mt-3 d-inline-block text-primary" to="../react/reg">s'inscrire</Link><br />
                    <Link className="mt-3 d-inline-block text-primary" to="../react/reg/vendeur">devenir un vendeur?</Link>
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

export default Login;
