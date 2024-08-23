import React from 'react';
import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/lib/calendar2/pignose.calendar.min.css";
import "./css/lib/chartist/chartist.min.css";
import "./css/lib/font-awesome.min.css";
import "./css/lib/themify-icons.css";
import "./css/lib/owl.carousel.min.css";
import "./css/lib/owl.theme.default.min.css" ;
import "./css/lib/weather-icons.css";
import "./css/lib/menubar/sidebar.css";
import "./css/lib/bootstrap.min.css";
import "./css/lib/helper.css";
import "./css/style.css";
import Header from '../../headerZf';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt, faBox, faShoppingCart, faFolder, faCogs, faUser } from '@fortawesome/free-solid-svg-icons';

function Component({ zf, link, icon }) {
  const buttonStyle = {
    backgroundColor: '#1234', // Couleur bleu nuit
    borderColor: 'transparent', // Pour rendre le contour transparent
  };

  return (
    <Link to={link} className="btn btn-secondary  btn-lg btn-block text-left p-4 mb-3 rounded-1 shadow text-white" style={buttonStyle}>
      <FontAwesomeIcon icon={icon} className="me-2" />
      <span className="h20">{zf}</span>
    </Link>
  );
}



  
  
function Navbar() {
    const Tiana = [
        { zf: "Dashboard", link: "Dashboard/", icon: faTachometerAlt },
        { zf: "Produits", link: "Produits/", icon: faBox },
        { zf: "Commandes", link: "Commande/", icon: faShoppingCart },
        { zf: "Catégorie", link: "Catégorie/", icon: faFolder },
        { zf: "Opération", link: "Opération/", icon: faCogs },
      ];

  const [index, setIndex] = useState(0);
  const [zf, setzf] = useState("Dashboard");

  const handleOnClick = (value, index) => {
    setzf(value);
    setIndex(index);
  };

  return (
    <>

                  <Header />
      

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
            </ul>
            <ul>
            {Tiana.map((lib, i) => (
            <Component
                key={lib.link}
                zf={lib.zf}
                index={i}
                link={lib.link}
                icon={lib.icon}
                onClick={handleOnClick}
            />
              ))}
            </ul>
          </div>
        </div>
      </div>

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
    </>
  );
}

export default Navbar;
