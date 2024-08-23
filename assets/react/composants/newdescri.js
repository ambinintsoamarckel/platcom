import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import '../../styles/app.css'
import '../../styles/bootstrap-slider.css'
import '../../styles/bootstrap.min.css'
import '../../styles/slick-theme.css'
import '../../styles/slick.css'

import Header from './header';
import Footer from './footer';
import Description from './description';
import AdvSearch from './advsearch';

function Yatra() {
    const [gridData, setGridData]= useState({});

    const [categorie, setCategorie] = useState({});
    const [loading, setLoading] = useState(true);
    const [optionsTp, setOptionsTp] = useState([]);

    const  id  = useParams();
    id.id;

    const loadData = async () => {
        try {
            const produitsResponse = await axios.get(`https://127.0.0.1:9000/api/produits/${id.id}`);
            const produitsData = produitsResponse.data;
            setCategorie(produitsResponse.data.categorie);
            setGridData(produitsData);
        } catch (error) {
            console.error("Error loading data", error);
        }
    };
    
    
    useEffect(() => {

        loadData();

        const fetchData = async () => {
            await fetchOptions("https://127.0.0.1:9000/api/produits", setOptionsTp);
          };
      
        fetchData();
    },
    []
    );

    const fetchOptions = async (url, setOptions) => {
        try {
          const response = await axios.get(url);
          const data = response.data["hydra:member"];
          if (Array.isArray(data)) {
            setOptions(data);
          } else {
            console.error("Les données récupérées ne sont pas un tableau.");
            setError("Erreur lors de la récupération des options : données invalides");
          }
        } catch (error) {
          console.error("Erreur lors de la récupération des options :", error.message);
          setError(`Erreur lors de la récupération des options : ${error.message}`);
        } finally {
          setLoading(false);
        }
    };

    return(
        <>
            <Header />

            <section className="page-search">
                <div className="container">
                    <AdvSearch />
                </div>
            </section>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <div className="section-title">
                            <h2> DESCRIPTION DU PRODUIT </h2>
                        </div>
                    </div>
                </div>
                <Description
                    id={id.id}
                    categorie={categorie ? categorie.nomcat : null}
                    nomprod={gridData.nomprod ? gridData.nomprod : null}
                    description={gridData.description ? gridData.description : null}
                    unites={gridData.unites}
                    createdAt={gridData.createdAt}
                    onAddData={gridData.onAddData}
                    user={gridData.user}
                />
            </div>

            

            <Footer />
        </>
    )
}

export default Yatra;