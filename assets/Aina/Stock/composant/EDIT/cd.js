import React, { useState, useEffect } from "react";
import { useTable } from 'react-table';
import Ed_cmd from "./Ed_cmd";
import AdDataComponent from "./Ed_lncmd";
import Header from "../../../headerZf";
import authHeader from "../../../../api/auth-header";
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../../DataContext';
import useAxios from "../../../../api/useAxios";

const TableComponent = ({ columns, data, onDelete }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });
  console.log("zafyyyy", data);

  return (
    <table {...getTableProps()} className="table" style={{ overflowY: 'auto' }}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
            <th>Action</th>
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => (
                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              ))}
              <td>
                <button className="btn btn-outline-danger btn-user btn sweet-confirm" onClick={() => onDelete(row.original)}>Delete</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

  
function Ed_Cd() {
  const { state, dispatch } = useData();
  const [tableData, setTableData] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const axios= useAxios();
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://127.0.0.1:9000/api/commandes_recu/${id}`, {
          headers: {
            'Content-Type': "application/merge-patch+json",
            ...authHeader(),
            withCredentials: true,
          }
        });
   
        const responseData = response.data;
        console.log("latakaaa", response.data);
  
        // Assurez-vous que la structure de données correspond à celle que vous attendez
        const lignecomsData = responseData.lignecoms || [];
  
        // Mettez à jour le tableau avec les données récupérées
        const mappedData = lignecomsData.map((lignecom) => ({
          'nomprod':lignecom.produits.nomprod,
          'prixunitaire':lignecom.unite.prix0,
          'quantitecom':lignecom.quantitecom,
          'quantiteL':lignecom.quantiteL,
        }));
        setUsers({
          value: responseData.user["@id"],
          label: responseData.user.nom+' '+responseData.user.prenom,
        });
        setTableData(mappedData);
        
      } catch (error) {
        console.error('Erreur lors de la requête GET :', error);
        // Gérez les erreurs si nécessaire
      }
    };
  
    // Appelez la fonction fetchData lors du montage du composant
    fetchData();
  }, [id]);
  console.log("zayy", tableData);
  const columns = [
    { Header: 'Type de produit', accessor: 'nomprod' },
    { Header: 'Prix unitaire', accessor: 'prixunitaire' },
    { Header: 'Quantité', accessor: 'quantitecom' },
    { Header: 'Quantité Livré', accessor: 'quantiteL' },
  ];
  


  const handleDelete = (row) => {
    setTableData((prevData) => prevData.filter((data) => data !== row));
  };

  const handleAddData = (newData) => {
    setTableData((prevData) => [...prevData, newData]);
    console.log('amboa',newData);
  };

  const handleFormSubmit = async (e,formData) => {
    e.preventDefault();
    const postobject = tableData.map(({ produits, unite, quantitecom, quantiteL }) => ({ produits, unite, quantitecom, quantiteL}));
    const query = {user:formData,lignecoms:postobject};
    console.log('query',query);
    try {
      // Enregistrez les données du formulaire
      
      const response = await axios.patch(`https://127.0.0.1:9000/api/commandes_recu/${id}`,  query,
      {
        headers: {
          'Content-Type': "application/merge-patch+json",
          ...authHeader(), withCredentials: true,
        }
      });
   
      // Effectuez d'autres actions avec les réponses si nécessaire
      navigate('../react/Zafy/Commande');
    } catch (error) {
      console.error('Erreur lors de la requête POST :', error);
      // Gérez les erreurs si nécessaire
    }
  };
  console.log("izyyyy", users);

  return (
    <>
      
          <Header/>
          <div className="card-body p-0" style={{ overflowY: 'auto' }}>
      <div className="card-body p-0">
        <div className="from-group row">
          <div className="col-md-4">
            <div className="p-5">
              <Ed_cmd onFormSubmit={handleFormSubmit} categoryData={users} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-5">
              <AdDataComponent onAddData={handleAddData} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-5">
              <TableComponent columns={columns} data={tableData} onDelete={handleDelete} />
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default Ed_Cd;
