import React from 'react';
import{
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";

import navbar from './nav';
import Tab from './Tab/tab_Prod';
import Cd from './Tab/tab_Cd';
import Stk from './Tab/tab_Appro';
import CAT from './Tab/tab_Cat';
import AJ_p from './Ajout/Aj_Prod';
import AJ_Ap from './Ajout/Aj_Op';
import AJ_Cd from './Ajout/Aj_Cd';
import AJ_Ct from './Ajout/Aj_Cat';
import Dsh from './Tab/Dashboard';
import Ed_Cd from './EDIT/cd';
import Ed_Ct from './EDIT/cat';
import Ed_p from './EDIT/prod';

function Zafy(){
    const router = createBrowserRouter([
        {
            path: "/Zafy",
            element:<navbar/>,
            children: [
                {
                    path:"/Zafy/Dashboard/",
                    element: <Dsh/>,
                },
                {
                    path:"/Zafy/Produits/",
                    element: <Tab/>,
                },
                {
                    path:"/Zafy/Commande/",
                    element: <Cd/>,
                },
                {
                    path:"/Zafy/Catégorie/",
                    element: <CAT/>,
                },
                {
                    path:"/Zafy/Opération/",
                    element: <Stk/>,
                },
            ],

        },
        {
            path: "/Zafy/Produits/Ajout",
            element:<AJ_p/>
        },
        {
            path: "/Zafy/Commande/Ajout",
            element:<AJ_Cd/>
        },
        {
            path: "/Zafy/Catégorie/Ajout",
            element:<AJ_Ct/>
        },
        {
            path: "/Zafy/Opération/Ajout",
            element:<AJ_Ap/>
        },
        {
            path: "/Zafy/Catégorie/Edit/:id",
            loader:({ params }) => {
                return params.id; // abc
 
               },
               action:({ params }) => {
                return params.id; // abc

              },
            element:<Ed_Ct/>
        },
        {
            path: "/Zafy/Produits/Edit/:id",
            loader:({ params }) => {
                return params.id; // abc
 
               },
               action:({ params }) => {
                return params.id; // abc

              },
            element:<Ed_p/>
        },
        {
            path: "/Zafy/Commandes/Edit/:id",
            loader:({ params }) => {
                return params.id; // abc
 
               },
               action:({ params }) => {
                return params.id; // abc

              },
            element:<Ed_Cd/>
        }
    ]);
        return(
            <> 
          <React.StrictMode>
            <RouterProvider router={router}/>

          </React.StrictMode>
               



            {/*<div>
                <div className= "from-group row">
                    <div className="col-md-2">
                        <Nav/>
                    </div>
                    <div className="col-md-10">
                        <Tab/>  
                    </div>
                </div>
            </div>
               <AJ_p/>
                   <Cli/>
                   <Cd/>
                   <Stk/>
                  
                <CAT/>        */          }  
            
            </>
            
          
        )
    }

export default Zafy;    