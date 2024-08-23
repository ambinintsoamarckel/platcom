import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBox, faShoppingCart, faFolder, faCogs, faUser } from '@fortawesome/free-solid-svg-icons';
import AdminHeader from './HeaderMahm';

function Component({ zf, link, icon, onClick }) {
  return (
    <li>
      <Link className="btn btn-secondary btn-user btn-block text-left pl-3" to={link} onClick={() => onClick(zf)}>
        <FontAwesomeIcon icon={icon} /> <span className="pl-3">{zf}</span>
      </Link>
    </li>
  );
}

function AdminNavbar({ onSelectUser ,userRoles,drop}) {
  const Tiana = [
    { zf: "Dashboard", link: "Dashboard/", icon: faTachometerAlt },
    { zf: "Produits", link: "Produits/", icon: faBox },
    { zf: "Commandes", link: "Commande/", icon: faShoppingCart },
    { zf: "Catégorie", link: "Catégorie/", icon: faFolder },
    { zf: "Opération", link: "Opération/", icon: faCogs },
    { zf: "Utilisateur", link: "User/", icon: faUser },

  ];

  const [zf, setzf] = useState("Dashboard");

  const handleOnClick = (value) => {
    setzf(value);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-2 ">
          <div className="sidebar sidebar-hide-to-small sidebar-shrink sidebar-gestures">
            <div className="nano">
              <div className="nano-content">
                <ul>
                  <div className="logo">
                    <a href="index.html">
                      <span>Dovahkin</span>
                    </a>
                  </div>
                  <li className="label">MENU</li>
                  {Tiana.map((lib) => (
                    <Component
                      key={lib.link}
                      zf={lib.zf}
                      link={lib.link}
                      icon={lib.icon}
                      onClick={handleOnClick}
                    />
                  ))}
                </ul>
              </div>s
            </div>
          </div>
        </div>

        <div className="col-lg-10 ">
          <AdminHeader onSelectUser={onSelectUser} drop={drop} userRoles={userRoles}/>
          <div className="content-wrap">
            <div className="main">
              <div className="container-fluid">
                <div className="row">
                  <div className="page-header">
                    <div className="page-title">
                      <Outlet />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;
