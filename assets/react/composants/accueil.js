import React from 'react';
import { Link, Outlet} from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';

import '../../styles/app.css'
import '../../styles/bootstrap-slider.css'
import '../../styles/bootstrap.min.css'
import '../../styles/slick-theme.css'
import '../../styles/slick.css'

import Header from './header';
import Footer from './footer';
import Allcat from './allcat';
import Element from './element';


function Ravalo({lino, link}) {
    return(
        <li className="list-inline-item">
            <Link to={link}>{lino}</Link>
        </li>
    )
}

function Accueil() {
    const [gridData, setGridData]= useState([]);

    const loadData = async () => {
        try {
            const produitsResponse = await axios.get("https://127.0.0.1:9000/api/produits");
            const produitsData = produitsResponse.data["hydra:member"];
            setGridData(produitsData);
        } catch (error) {
            console.error("Error loading data", error);
        }
    };
    
    
    useEffect(() => {
        loadData();
    },
    []
    );
    
    const Lalao = [
        {helo:'electroniques', link:'cate/'},
        {helo:'cosmetiques', link:'cate/'},
        {helo:'textiles', link:'cate/'},
        {helo:'mobiliers', link:'cate/'},
    ];
    
    return(
        <>
            <Header />
            
            <section className="hero-area bg-1 text-center overly">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="content-block">
                                <h1>Achetez & Vendez Des Articles Près De Chez Vous</h1>
                                <p></p>
                                <div className="short-popular-category-list text-center">
                                    <h2>Categorie Populaire</h2>
                                    <ul className="list-inline">
                                        {Lalao.map((lib, i) => {
                                            return(
                                            <Ravalo  
                                                key={i}
                                                lino={lib.helo} 
                                                index={i}
                                                link={lib.link}
                                            />)
                                        })}
                                    </ul>
                                </div>
                                <Outlet />
                            </div>

                            {/*recherche*/}

                            <div className="advance-search">
                                <div className="container">
                                    <div className="row justify-content-center">
                                        <div className="col-lg-12 col-md-12 align-content-center">
                                            <form>
                                                <div className="form-row">
                                                    <div className="form-group col-xl-4 col-lg-3 col-md-6">
                                                        <input type="text" className="form-control my-2 my-lg-1" id="inputtext4"
                                                            placeholder="Que recherchez-vous..." />
                                                    </div>
                                                    <div className="form-group col-lg-3 col-md-6">
                                                        <select className="w-100 form-control mt-lg-1 mt-md-2">
                                                            <option>categorie</option>
                                                            <option value="1">olombelona</option>
                                                            <option value="2">alika</option>
                                                            <option value="4">zanapiso</option>
                                                        </select>
                                                    </div>
                                                    <div className="form-group col-lg-3 col-md-6">
                                                        <input type="text" className="form-control my-2 my-lg-1" id="inputLocation4" placeholder="precision" />
                                                    </div>
                                                    <div className="form-group col-xl-2 col-lg-3 col-md-6 align-self-center">
                                                        <button type="submit" className="btn btn-primary active w-100">Rechercher</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/*elem*/}
            <section className="popular-deals section bg-gray">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="section-title">
                                <h2> PRODUITS POPULAIRE</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {gridData && gridData.map((item, i) => {
                            const id = parseInt(item['@id'].match(/\d+$/)[0]);

                            return (
                                <Element
                                    id={id}
                                    key={i}
                                    nomprod={item.nomprod}
                                    unites={item.unites}
                                    nomcat={item.categorie.nomcat}
                                />
                            );
                        })}
                    </div>
                </div>
            </section>

            <section className=" section">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-title">
                                <h2>TOUTES LES CATEGORIES</h2>
                                <p>retrouvez ici tous les produits du plateforme</p>
                            </div>
                            <div className="row">
                                { gridData && gridData.map((item, i) => 
                                    {
                                        return(
                                            <Allcat
                                                id={i}
                                                key={i}
                                                nomcat={item.categorie.nomcat}
                                                unites={item.unites}
                                                nomprod={item.nomprod}
                                            />
                                        )
                                    }) 
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="call-to-action overly bg-3 section-sm">
                <div className="container">
                    <div className="row justify-content-md-center text-center">
                        <div className="col-md-8">
                            <div className="content-holder">
                                <h2>Rejoignez-nous en tant que vendeur, créez votre business .</h2>
                                <ul className="list-inline mt-30">
                                    <li className="list-inline-item"><Link className="btn btn-secondary" to=''>en savoir plus</Link></li>
                                    <li className="list-inline-item"><Link className="btn btn-secondary" to=''>suggestions</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </>
    )
}

export default Accueil