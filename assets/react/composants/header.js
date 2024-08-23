import React from 'react';
import { Link } from 'react-router-dom';
import Nonoa from './modal';
import AuthService from '../../api/auth';
import { useState, useEffect } from 'react';
import axios from 'axios';
import authHeader from '../../api/auth-header';

import '../../styles/app.css'
import '../../styles/bootstrap-slider.css'
import '../../styles/bootstrap.min.css'
import '../../styles/slick-theme.css'
import '../../styles/slick.css'

function Header() {
    const [ isconnected , setIsConnected] = useState(false);
    const [ util, setUtil ] = useState(undefined);
    const nomutil = isconnected ? "alt-color" : "zay"; 
    const connected= isconnected ? "nav-link login-button" : "zay";
    const notconnected= isconnected ? "zay" : "nav-link login-button";

    useEffect(() => {
            loadData();
        }
        
    ,
    []
    );

    const loadData = async()=> {
        try
        {            
        axios
            .get('https://127.0.0.1:9000/api/me', { headers:authHeader(), withCredentials: true})
            .then(response=> response.data)
            .then(data=> {
              setUtil(data);
              setIsConnected(true);
            },
            (error) => {
              console.log(error);
              setIsConnected(false);
          })
      }
      catch (err) {
        console.log(err);
        setIsConnected(false);
    }
        

      
};
    const  logout=e => {      
        if (AuthService.getCurrentUser()) {
            AuthService.logout();
            setIsConnected(false);
            //window.location.reload();

        
    }


    }
    
    return(
        <>
        <header>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <nav className="navbar navbar-expand-lg navbar-light navigation">
                                <Link className="navbar-brand" to="index.html">
                                    <img src="" alt="" />
                                </Link>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav ml-auto main-nav ">
                                        <li className="nav-item active">
                                            <Link className="nav-link" to='../react/lino'>Accueil</Link>
                                        </li>
                                        <li className="nav-item active">
                                            <Link className="nav-link" to='../react/lino/cate/'>Nouveautes</Link>
                                        </li>
                                        <li className="nav-item active">
                                            <Link className="nav-link"  to='../react/lino/cate/'>Nos Meilleures Ventes</Link>
                                        </li>
                                        <li className="nav-item active">
                                            <Link className="nav-link" to='../react/lino/cate/'>Seconde Main</Link>
                                        </li>
                                        <li className="nav-item active">
                                            <Link className="nav-link" to='../react/lino/cate/'>Soldes & Promotions</Link>
                                        </li>
                                        
                                    </ul>
                                    <ul className="navbar-nav ml-auto mt-10">
                                        <li className="nav-item">
                                            <Nonoa />
                                        </li>
                                            <Link className={notconnected} to='../react'>se connecter</Link>
                                            <button onClick={logout} className={connected} >se deconnecter</button>
                                            <li className="nav-item active">
                                            <p className={nomutil}>{util && util['username']}</p>
                                            <img src="" alt=''></img>
                                            </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default Header;