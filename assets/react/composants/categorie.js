import React from 'react';
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
import AdvSearch from './advsearch';

function Categorie() {
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

    return(
        <>
            <Header />

            <section className="page-search">
                <div className="container">
                    <AdvSearch />
                </div>
            </section>

            <section className="section bg-gray">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="section-title">
                                <h2> PRODUITS </h2>
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

            <Footer />
        </>
    )
}

export default Categorie

