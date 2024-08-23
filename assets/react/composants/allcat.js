import React from 'react';
import { Link } from 'react-router-dom';

import '../../styles/app.css'
import '../../styles/bootstrap-slider.css'
import '../../styles/bootstrap.min.css'
import '../../styles/slick-theme.css'
import '../../styles/slick.css'

function Allcat({ nomcat, nomprod, unites }) {
    return(
        <>
            <Link className="col-lg-3 offset-lg-0 col-md-5 offset-md-1 col-sm-6" to='../react/lino/cate'>
                <div className="category-block">
                    <div className="header">
                        <i className="fa fa-laptop icon-bg-1"></i>
                        <h4>{nomcat}</h4>
                    </div>
                    <ul className="category-list">
                        {unites.map((item, i) => {
                          
                          return (
                            <li key={i}>
                              {nomprod}{`: ${item.quantitestock}`}
                            </li>
                          );
                        })}
                    </ul>
                </div>
            </Link>    
        </>
    )
}

export default Allcat;