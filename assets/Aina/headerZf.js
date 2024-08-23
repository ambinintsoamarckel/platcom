import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faChevronDown, faChevronUp, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import AuthService from '../api/auth';
import useAxios from '../api/useAxios';
import authHeader from '../api/auth-header';
import useLogout from '../api/useLogout';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import '../styles/app.css';
import '../styles/bootstrap-slider.css';
import '../styles/bootstrap.min.css';
import '../styles/slick-theme.css';
import '../styles/slick.css';

function Header() {
  const [util, setUtil] = useState(undefined);
  const [showMenu, setShowMenu] = useState(false);

  const nomutil = "alt-color";
  const connected = "nav-link login-button";
  const logout = useLogout();
  const axios = useAxios();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get('https://127.0.0.1:9000/api/me', {
        headers: authHeader(),
        withCredentials: true,
      });
     
      setUtil(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleMenu = () => {
    setShowMenu(!showMenu);
  };

  const handleLogoutClick = () => {
    setShowMenu(false);
    logout();
  };

  return (
    <div className={`container-fluid bg-light ${showMenu ? 'menu-open' : ''}`}>
      <div className="row">
        <div className="col-lg-12">
          <div className="float-right">
            <div className="dropdown dib">
              <nav className="navbar-expand-lg custom-navbar">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item position-relative">
                    <div className="d-flex align-items-center">
                      <p className={`nav-link ${nomutil} mb-0`}>
                        <FontAwesomeIcon icon={faUser} className="mr-1" />
                        {util && util['username']}
                      </p>
                      <div className="ml-2">
                        <Button onClick={handleToggleMenu} variant="light" className="btn-sm">
                          <FontAwesomeIcon icon={showMenu ? faChevronUp : faChevronDown} />
                        </Button>
                      </div>
                    </div>
                    {showMenu && (
                      <div className="bg-white position-absolute menu-container">
                        <ul>
                          <li>
                            <Button onClick={handleLogoutClick} variant="light" className="btn-sm btn-block">
                              <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                              Déconnexion
                            </Button>
                          </li>
                          <li>
                            <Button onClick={handleLogoutClick} variant="light" className="btn-sm btn-block">
                              <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                              Mon compte
                            </Button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;


