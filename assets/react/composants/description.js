import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authHeader from '../../api/auth-header';
import AddDataComponent from './lignecom';
import { useNavigate } from 'react-router-dom';

import '../../styles/app.css'
import '../../styles/bootstrap-slider.css'
import '../../styles/bootstrap.min.css'
import '../../styles/slick-theme.css'
import '../../styles/slick.css'

import img5 from '../../image/img5.jpg'
import img6 from '../../image/img6.jpg'
import img7 from '../../image/img7.jpg'
import img8 from '../../image/img8.jpg'

function Description({ nomprod, categorie, description, unites, createdAt, user, id }) {

    const [ ligneCommande, setLigneCommande ] = useState([{}]);
    const Navigate = useNavigate();
    
    const handleAddData = async (newData) => {
        setLigneCommande((prevLigneCommande) => [...prevLigneCommande, newData && newData]);


        const inaPory = {vendeur: user, lignecom: [newData]};
        const actualCommande = JSON.parse(localStorage.getItem("commande"));
        if (actualCommande) {
            let efaao = false;
            const vaovao = 
            actualCommande.map(
                (item, i) => {
                    if (item.vendeur === inaPory.vendeur) {
                        efaao = true;
                        return{ ...item, lignecom:[...item.lignecom , newData]  }
                    }
                    else {
                        return item;
                    }
                }
            )
            if (efaao) {
                let fory = [];
                fory = [...fory,vaovao];
                localStorage.setItem("commande", JSON.stringify(vaovao));
            }
            else {
              
               
                localStorage.setItem("commande", JSON.stringify([...actualCommande, inaPory]));
                
            }
        }
        else {
            let fory = [];
             fory = [...fory,inaPory];
            localStorage.setItem("commande", JSON.stringify(fory));
        }

        Navigate("../react/lino");
    };  

    return(
        <>
            <div className="row">
                <div className="col-lg-8">
                    <div className="product-details">
                        <h1 className="product-title">{nomprod}</h1>
                        <div className="product-meta">
                            <ul className="list-inline">
                            {/* {unites && unites.map((item, i) => {
                                return (
                                    <li key={i}>
                                    {`Prix: ${item.prix}, ${item.nomunit ? item.nomunit: ""}, Disponible: ${item.quantitestock}`}
                                    </li>
                                );
                            })} */}
                            </ul>
                        </div>

                        {/*sary*/}
                        <div className="product-slider">
                            <div className="product-slider-item my-4" data-image="">
                                <img className="img-fluid w-100" src={img5} alt="product-img" />
                            </div>
                            <div className="row">
                                <div className="col-md-3" data-image="">
                                    <img className="loulou" src={img6} alt="Second slide" />
                                </div>
                                <div className="col-md-3" data-image="">
                                    <img className="loulou" src={img7} alt="Third slide" />
                                </div>
                                <div className="col-md-3" data-image="">
                                    <img className="loulou" src={img8} alt="Third slide" />
                                </div>
                            </div>
                        </div>

                        <div className="tab-content" id="pills-tabContent">
                            <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
                                <h2>{description}</h2>
                                <table className="table table-bordered product-table">
                                    <tbody>
                                        <tr>
                                            <td>Nom :</td>
                                            <td>{nomprod}</td>
                                        </tr>
                                        <tr>
                                            <td>Ajouté le :</td>
                                            <td>{createdAt}</td>
                                        </tr>
                                        <tr>
                                            <td>Categorie :</td>
                                            <td>{categorie ? categorie : ''}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="sidebar">
                        <div className="widget price text-center">
                            <AddDataComponent onAddData={handleAddData} unites={unites && unites} nomprod={nomprod && nomprod} id={id && id}/>
                            <h4></h4>
                        </div>
                        <div className="widget user text-center">
                            <img className="rounded-circle img-fluid mb-5 px-5" src="images/user/user-thumb.jpg" alt="" />
                            <h4><Link href="user-profile.html"></Link></h4>
                            <ul className="list-inline mt-20">
                                <li className="list-inline-item"><button className="btn btn-contact d-inline-block  btn-primary px-lg-5 my-1 px-md-3">Contact</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">

            </div>
        </>
    )
}

export default Description;
