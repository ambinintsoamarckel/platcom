import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Categorie from "./categorie";
import Yatra from "./newdescri";
import Register from "./register";
import Login from "./login";
import Accueil from "./accueil";

function Comprender() {
    const router = createBrowserRouter([
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
            path: "/react/lino/login",
            element: <Login />,
        },
        {
            path: "/react/lino/regis",
            element: <Register />,
        },
    ]
    )
    return(
        <React.StrictMode >
            <RouterProvider router={router} />
        </React.StrictMode>
    );
}

export default Comprender


