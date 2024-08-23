import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import AddDataComponenty from './lignecom';

function Accesseur({ nomprod, unites, id, user }) {
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

    return (
        <div>
            <AddDataComponenty onAddData={handleAddData} unites={unites && unites} nomprod={nomprod && nomprod} id={id && id}/>
        </div>
    )
};

export default Accesseur;