
/*import Zafy from './Stock/composant/Zafy'
import { useState } from "react";*/
import React, { useState } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Nav from './Stock/composant/nav';
import Dsh from './Stock/composant/Tab/Dashboard';
import Tab from './Stock/composant/Tab/tab_Prod';
import Cd from './Stock/composant/Tab/tab_Cd';
import Stk from './Stock/composant/Tab/tab_Appro';
import CAT from './Stock/composant/Tab/tab_Cat';
import AJ_p from './Stock/composant/Ajout/Aj_Prod';
import AJ_Ap from './Stock/composant/Ajout/Aj_Op';
import AJ_Cd from './Stock/composant/Ajout/Aj_Cd';
import AJ_Ct from './Stock/composant/Ajout/Aj_Cat';
import Categorie from "../react/composants/categorie";
import Yatra from "../react/composants/description";
import Register from "../react/composants/register";
import Login from "./login";
import Accueil from "../react/composants/accueil";
import Vendeur from './register';
import Tab_user from './Stock/composant/Tab/tab_user';
import Header from './headerZf';
import AdminCat from '../Admin/Tab/tab_Cat';
import AdminCd from '../Admin/Tab/tab_Cd';
import AdminOp from '../Admin/Tab/tab_Appro';
import AdminPro from '../Admin/Tab/tab_Prod';
import AdminUser from '../Admin/Tab/tab_user';
import AdminNavbar from '../Admin/NavMahm';
import MonCompte from './Me';
import AddUser from '../Admin/AddUser';
import EditUser from './EditUser';
import ResetSend from './ResetPasswordSend';
import ResetReceive from './ResetPasswordReceive';
import Ed_Ct from './Stock/composant/EDIT/cat';
import Ed_p from './Stock/composant/EDIT/Ed_Prod';
import { DataProvider } from './DataContext';
import Ed_Cd from './Stock/composant/EDIT/cd';
import AdminDsh from '../Admin/Tab/Dashboard';
function Mahm() {
  const [userId,setUserId]=useState(null);
  const [user,SetUser]=useState(JSON.parse(localStorage.getItem('current_user')));
  const [drop,SetDrop]=useState(false);
const router = createBrowserRouter([
  {
    path: "/react",
    element: <Login />,
  },
  {
    path: "/react/reg",
    element: <Register />,
  },
  {
        
    path:"/react/reset/:token",
    loader:({ params }) => {
      return params.token; // abc
 
     },
     // and actions
     action:({ params }) => {
       return params.token; // abc
 
     },
    element: <ResetReceive/>,
},
  {
    path: "/react/reset",
    element: <ResetSend />,
  },
  {
    path: "/react/reg/vendeur",
    element: <Vendeur />,
  },
  {
    path: "/react/Zafy",
    element:<Nav/>,
    children: [
        {
            path:"/react/Zafy/Dashboard/",
            element: <Dsh/>,
        },
        {
            path:"/react/Zafy/Produits/",
            element: <Tab/>,
        },
        {
            path:"/react/Zafy/Commande/",
            element: <Cd/>,
        },
        {
            path:"/react/Zafy/Catégorie/",
            element: <CAT/>,
        },
        {
            path:"/react/Zafy/Opération/",
            element: <Stk/>,
        },
        {
          path:"/react/Zafy/User/",
          element: <Tab_user/>,
      },
      {
        
        path:"/react/Zafy/Me/:id",
        loader:({ params }) => {
          return params.id; // abc
     
         },
         // and actions
         action:({ params }) => {
           return params.id; // abc
     
         },
        element: <MonCompte/>,
    },
    ],

},
{
    path: "/react/Zafy/Produits/Ajout",
    element:<AJ_p/>
},
{
    path: "/react/Zafy/Commande/Ajout",
    element:<AJ_Cd/>
},
{
    path: "/react/Zafy/Catégorie/Ajout",
    element:<AJ_Ct/>
},
{
    path: "/react/Zafy/Opération/Ajout",
    element:<AJ_Ap/>
},
,
{
  path: "/react/lino/cate",
  element: <Categorie />,
},
{
  path: "/react/lino/descri/:id",
  loader:({ params }) => {
     return params.id; // abc

    },
    // and actions
    action:({ params }) => {
      return params.id; // abc

    },
  element: <Yatra />,
},
{
  path: "/react/Zafy/Catégorie/Edit/:id",
  loader:({ params }) => {
      return params.id; // abc

     },
     action:({ params }) => {
      return params.id; // abc

    },
  element:<Ed_Ct/>
},
{
  path: "/react/Zafy/Produits/Edit/:id",
  loader:({ params }) => {
      return params.id; // abc

     },
     action:({ params }) => {
      return params.id; // abc

    },
  element:<Ed_p/>
},{
  path: "/react/Zafy/Commandes/Edit/:id",
  loader:({ params }) => {
      return params.id; // abc

     },
     action:({ params }) => {
      return params.id; // abc

    },
  element:<Ed_Cd/>
}
,
{
  path: "/react/lino",
  element: <Accueil />,
},
{
  path: "/react/lino/cate",
  element: <Categorie />,
},
{
  path: "/react/lino/descri/:id",
  loader:({ params }) => {
     return params.id; // abc

    },
    // and actions
    action:({ params }) => {
      return params.id; // abc

    },
  element: <Yatra />,
},
{
  path: "/react/Admin",
  element:<AdminNavbar onSelectUser={setUserId} drop={drop} userRoles={user}/>,
  children: [
      {
          path:"/react/Admin/Dashboard/",
          element: <AdminDsh id={userId}/>,
      },
      {
          path:"/react/Admin/Produits/",
          element: <AdminPro userId={userId}/>,
      },
      {
          path:"/react/Admin/Commande/",
          element: <AdminCd userId={userId}/>,
      },
      {
          path:"/react/Admin/Catégorie/",
          element: <AdminCat/>,
      },
      {
          path:"/react/Admin/Opération/",
          element: <AdminOp userId={userId}/>,
      },
      {
        path:"/react/Admin/User/",
        element: <AdminUser setUserDrop={SetDrop}/>,
    },
    {
      path:"/react/Admin/AddUser/",
      element: <AddUser setUserDrop={SetDrop}/>,
  },
    
    {
        
      path:"/react/Admin/Me/:id",
      loader:({ params }) => {
        return params.id; // abc
   
       },
       // and actions
       action:({ params }) => {
         return params.id; // abc
   
       },
      element: <MonCompte setUserRoles={SetUser}/>,
  },
  {
        
    path:"/react/Admin/EditUser/:id",
    loader:({ params }) => {
      return params.id; // abc
 
     },
     // and actions
     action:({ params }) => {
       return params.id; // abc
 
     },
    element: <EditUser setUserDrop={SetDrop}/>,
},
  ],

},


]);
  
  
  
  
  return (
  <React.StrictMode>
  <DataProvider>
      <RouterProvider router={router} />
  </DataProvider>
    
  </React.StrictMode>


  );
}

export default Mahm;
