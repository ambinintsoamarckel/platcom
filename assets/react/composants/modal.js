import React from 'react';
import { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import authHeader from '../../api/auth-header';

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
                <button onClick={() => onDelete(row.original)}>Supprimer</button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

function Nonoa() {
  const handleClose = () => {
    localStorage.removeItem("commande");
    setShow(false);
/*     window.location.reload(); */
  }

  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);

  const columns = [
    { Header: 'Nom', accessor: 'nomprod' },
    { Header: 'Prix', accessor: 'prixunitaire' },
    { Header: 'Quantite', accessor: 'quantitecom' },
    { Header: 'Total', accessor: 'sousTotal', Cell: ({ value }) => <span>{value}</span> },
  ];

  const localStorageData = JSON.parse(localStorage.getItem("commande")) || [];

  const loadData = () => {
    try {
      const datatable = localStorageData.flatMap(item => item.lignecom);
      const monSousTotal = datatable.map(row => ({
        ...row,
        sousTotal: (row.prixunitaire || 0) * (row.quantitecom || 0)
      }));
      const totalAmount = monSousTotal.reduce((acc, row) => acc + row.sousTotal, 0);
      setTotal(totalAmount);

      setTableData(monSousTotal);
    } catch (error) {
      console.error("Error loading data", error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = (row) => {
  const updatedData = tableData.filter(item => item !== row && item.prixunitaire !== undefined && item.quantitecom !== undefined);
  setTableData(updatedData);

  const totalAmount = updatedData.reduce((acc, item) => acc + item.sousTotal, 0);
  setTotal(totalAmount);

  const localStorageUpdatedData = localStorageData.map(item => ({
    ...item,
    lignecom: item.lignecom.filter(line => line !== row)
  }));

  localStorage.setItem("commande", JSON.stringify(localStorageUpdatedData));
};


  const handleConfirmClick = async () => {
    try {
      await Promise.all(
        localStorageData.map(async (item) => {
          await axios.post(
            "https://127.0.0.1:9000/api/commandes",
            item && item,
            {
              headers: {
                'Content-Type': 'application/ld+json',
                ...authHeader(),
                withCredentials: true,
              },
            }
          );
        })
      );
      localStorage.removeItem("commande");
     /*  window.location.reload(); */
    } catch (error) {
      console.log("error", error);
      navigate('../react/lino/login');
    }
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Voir Panier
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>VOTRE PANIER</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
          <TableComponent columns={columns} data={tableData} onDelete={handleDelete} />
            <span className="form-control my-2 my-lg-1">PRIX TOTAL : {total}</span>
          </div>
          <ul className="list-inline">
            <li className="list-inline-item">
              <input type="checkbox" id="keep-me-logged-in" />
              <label htmlFor="keep-me-logged-in" className="pt-3 pb-2">par telephone</label>
            </li>
            <li className="list-inline-item">
              <input type="checkbox" id="keep-me-logged-in" />
              <label htmlFor="keep-me-logged-in" className="pt-3 pb-2">en personne</label>
            </li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleConfirmClick}>Confirmer</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Nonoa;
