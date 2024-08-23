import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faUser, faChevronDown, faChevronUp, faSignOutAlt, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import useLogout from '../api/useLogout';
import Button from 'react-bootstrap/Button';
import UserDropdown from '../Aina/UserDropdown';
import '../styles/app.css';
import '../styles/bootstrap-slider.css';
import '../styles/bootstrap.min.css';
import '../styles/slick-theme.css';
import '../styles/slick.css';

// ... (autres importations)

function AdminHeader({ onSelectUser, userRoles,drop}) {
  const [showMenu, setShowMenu] = useState(false);
  let data=JSON.parse(localStorage.getItem('current_user'));

  const nomutil = "alt-color";
  const connected = "nav-link login-button";
  const logout = useLogout();
  useEffect(() => {
    data=JSON.parse(localStorage.getItem('current_user'));
    loadData(data.role);
  }, [userRoles]);

  const loadData =  (role) => {

      console.log('appel leka');
      if (data && role.includes('ROLE_BUYER')) {
          navigate('../react/lino');
        /*   window.location.reload(); */
      } else if (data && (role.includes('ROLE_SELLER'))) {
          navigate('../react/Zafy');
          /* window.location.reload(); */
      }
      else if (data && (role.includes('ROLE_ADMIN'))) {

      }
      else 
      {
        navigate('/react');
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
        <div className="col-lg-9">
          <UserDropdown onSelectUser={onSelectUser} drop={drop} />
        </div>
        <div className="col-lg-3">
          <div className="float-right">
            <div className="dropdown dib">
              <nav className="navbar-expand-lg custom-navbar">
                <ul className="navbar-nav ml-auto">
                  <li className="nav-item position-relative">
                    <div className="d-flex align-items-center">
                    <p className={`nav-link ${nomutil} mb-0 text-dark`}>
                      <FontAwesomeIcon icon={faUser} className="mr-1" />
                      {data&&data.username&&data.username}
                    </p>

                      <div className="ml-2">
                        <Button onClick={handleToggleMenu} variant="light" className="btn-sm">
                          <FontAwesomeIcon icon={showMenu ? faChevronUp : faChevronDown} />
                        </Button>
                      </div>
                    </div>
                    {showMenu && (
                    <div className="bg-white position-absolute menu-container p-3" style={{ zIndex: 1000 }}>
                      <ul className="list-unstyled">
                        <li>
                          <Link
                              to={`../react/Admin/Me/${data.id}`}
                            variant="light"
                            className="btn-sm btn-block bg-transparent"
                            onClick={()=>setShowMenu(false)}
                          >
                            <FontAwesomeIcon icon={faUserCircle} className="mr-2" />
                            Mon compte
                          </Link>
                        </li>
                        <li>
                          <Button
                            onClick={handleLogoutClick}
                            variant="light"
                            className="btn-sm btn-block bg-transparent"
                          >
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                            Déconnexion
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

export default AdminHeader;
