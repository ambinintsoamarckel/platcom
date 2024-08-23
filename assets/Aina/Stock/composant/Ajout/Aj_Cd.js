import React, { useState } from "react";
import { useTable } from 'react-table';
import Aj_cmd from "./AjoutCmd";
import AddDataComponent from "./LigneCmd";
import Header from "../../../headerZf";
import authHeader from "../../../../api/auth-header";
import useAxios from "../../../../api/useAxios";
import { useNavigate } from 'react-router-dom';

const TableComponent = ({ columns, data, onDelete }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <table {...getTableProps()} className="table">
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
  
function AJ_Cd() {
  const columns = [
    { Header: 'Type de produit', accessor: 'nomprod' },
    { Header: 'Prix unitaire', accessor: 'prixunitaire' },
    { Header: 'Quantité', accessor: 'quantitecom' },
    { Header: 'Quantité Livré', accessor: 'quantiteL' },
  ];
  const axios = useAxios();

  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

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
      const responseForm = await axios.post(
        "https://127.0.0.1:9000/api/commandes",
      query,
        
        {
          headers: {
            'Content-Type': 'application/ld+json',
            ...authHeader(), withCredentials: true,
          }
        }
      );
      // Effectuez d'autres actions avec les réponses si nécessaire
      navigate('../react/Zafy/Commande');
    } catch (error) {
      console.error('Erreur lors de la requête POST :', error);
      // Gérez les erreurs si nécessaire
    }
  };

  return (
    <>
      <Header/>
    
      <div className="card-body p-0">
        <div className="from-group row">
          <div className="col-md-4">
            <div className="p-5">
              <Aj_cmd onFormSubmit={handleFormSubmit} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-5">
              <AddDataComponent onAddData={handleAddData} />
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-5">
              <TableComponent columns={columns} data={tableData} onDelete={handleDelete} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AJ_Cd;
