import React from 'react';
import { useState, useEffect } from 'react';
import { useTable } from 'react-table';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



const TableComponent = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data });

  return (
    <div className="table-container" style={{ maxHeight: '300px', overflowY: 'auto' }}>
      {/* maxHeight et overflowY ajustent la hauteur maximale et activent la barre de défilement vertical */}
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};


function Nonoa({data}) {
  const handleClose = () => {
    setShow(false);
  }

  const handleShow = () => setShow(true);
  const [show, setShow] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(0);

  const columns = [
    { Header: 'Nom', accessor: 'nomprod' },
    { Header: 'Prix', accessor: 'prixunitaire' },
    { Header: 'Quantite', accessor: 'quantitecom' },
    { Header: 'Total', accessor: 'sousTotal', Cell: ({ value }) => <span>{value}</span> },
  ];


  const loadData = () => {
    try {
      const datatable = data && data.map((ligne, index) => ({
        nomprod: ligne.produits.nomprod,
        quantitecom: ligne.quantitecom,
        quantiteL: ligne.quantiteL, // Assurez-vous que la propriété exacte est utilisée
        prixunitaire: ligne.unite.prix,
      }));
      

      const monSousTotal = datatable.map(row => ({
        ...row,
        sousTotal: row.prixunitaire * row.quantitecom
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


 

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        line
      </Button>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Ligne de commandes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
          <TableComponent columns={columns} data={tableData}  />
            <span className="form-control my-2 my-lg-1">PRIX TOTAL : {total}</span>
          </div>

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            quitter
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Nonoa;
