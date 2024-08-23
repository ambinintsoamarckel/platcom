import React from 'react';
import { Link } from 'react-router-dom';

import '../../styles/app.css'
import '../../styles/bootstrap-slider.css'
import '../../styles/bootstrap.min.css'
import '../../styles/slick-theme.css'
import '../../styles/slick.css'

import gaara from './img/gaara.jpg'

function Element({ nomprod, nomcat, unites, id }) {

    
  return (
      <div className="col-md-4">
        <Link
          className="product-item bg-light"
          to={`../react/lino/descri/${id}`}
          title="cliquez pour plus de détails"
        >
          <div className="card">
            <div className="thumb-content">
              <img className="loulou" src={gaara} alt="" />
              <div className="card-body">
                <h4 className="card-title">{nomprod}</h4>
                <ul className="list-inline product-meta">
                  <li className="list-inline-item">
                    <i className="fa fa-folder-open-o">
                      <ul>
                        {unites.map((item) => {
                          id = parseInt(item['@id'].match(/\d+$/)[0]);

                          return (
                            <li key={id}>
                              {`Prix: ${item.prix}, ${item.nomunit ? item.nomunit: ""}, Disponible: ${item.quantitestock}`}
                            </li>
                          );
                        })}
                      </ul>
                    </i>
                  </li>
                  <br />
                  <li className="list-inline-item">
                    <Link href="category.html">
                      <i className="fa fa-calendar">{nomcat}</i>
                    </Link>
                  </li>
                </ul>
                <p className="card-text"></p>
                <div className="product-ratings">
                  <ul className="list-inline">
                    <li className="list-inline-item selected">
                      <i className="fa fa-star"></i>
                    </li>
                    <li className="list-inline-item selected">
                      <i className="fa fa-star"></i>
                    </li>
                    <li className="list-inline-item selected">
                      <i className="fa fa-star"></i>
                    </li>
                    <li className="list-inline-item selected">
                      <i className="fa fa-star"></i>
                    </li>
                    <li className="list-inline-item">
                      <i className="fa fa-star"></i>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  }
  
  export default Element;