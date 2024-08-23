import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import useAxios from "../../../../api/useAxios";
import { useTable } from 'react-table';
import authHeader from "../../../../api/auth-header";
import AddDataComponent from "./Ln_Prod";
import { useNavigate } from 'react-router-dom';
import Select from "react-select";
import Rnt from "./image";

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
            <th></th>
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

function Pro() {
  const columns = [
    { Header: "Nom de l'unité", accessor: 'nomunit' },
    { Header: 'Limite', accessor: 'limite' },
    { Header: 'Prix', accessor: 'prix' },
    { Header: 'Quantité ', accessor: 'quantitestock' },
  ];
  const [loading, setLoading] = useState(true);
  const [categorie, setCategorie] = useState([]);
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [formData, setFormData] = useState({
    nomprod: '',
    categorie: '',
    description: '',
    limite: ''
  });
  const axios = useAxios();
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  
  useEffect(() => {
    const fetchCategorie = async () => {
      try {
        const response = await axios.get("https://127.0.0.1:9000/api/categories");
        const categorieData = Array.isArray(response.data['hydra:member']) ? response.data['hydra:member'] : [];
        setCategorie(categorieData);


      } catch (error) {
        console.error('Erreur lors de la requête GET pour les catégories :', error);
        setError('Erreur lors de la récupération des catégories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategorie();
  }, []);
  const handleSelectChange = (e) => {
    const{value: value} = e || {};

  
    // Mise à jour de l'état formData
    setFormData({
      ...formData,
      categorie: value === '' ? null : value,
    });
  };

  const handleDelete = (row) => {
    setTableData((prevData) => prevData.filter((data) => data !== row));
  };
  const handleDeletePhoto = (index) => {
    // Supprimez l'image à l'index spécifié de la liste des fichiers sélectionnés
    const updatedFiles = [...selectedFiles];
    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddData = (data) => {
    setTableData((prevData) => [...prevData, data]);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;

    // Convertir la liste de fichiers File en un tableau
    const filesArray = Array.from(files);

    // Mettre à jour l'état avec la nouvelle liste de fichiers
    setSelectedFiles((prevFiles) => [...prevFiles, ...filesArray]);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    try {
      let query = { ...formData, unites: tableData };
      let photos = [];
  
      // Utiliser Promise.all pour attendre que toutes les requêtes de photos se terminent
      await Promise.all(selectedFiles.map(async (item) => {
        const photo = new FormData();
        photo.append('file', item);
  
        const responsePhoto = await axios.post(
          "https://127.0.0.1:9000/api/media_objects",
          photo,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              ...authHeader(),
              withCredentials: true,
            }
          }
        );
        photos = [...photos, responsePhoto && responsePhoto['data']['@id']];

      }));

      if (photos.length > 0) {
        query = { ...query, photos: photos };

      }
  
      const response = await axios.post(
        "https://127.0.0.1:9000/api/produits_post",
        query,
        {
          headers: {
            'Content-Type': 'application/ld+json',
            ...authHeader(),
            withCredentials: true,
          }
        }
      );
  
      navigate('../react/Zafy/Produits');
      console.log('Réponse du serveur :', response.data);
    } catch (error) {
      console.error('Erreur lors de la requête POST :', error);
    }
  };
  

  console.log("form",formData);

  return (
    <>
      <div className="text-center">
        <h1 className="h4 text-gray-900 mb-4">Ajout des Produits</h1>
      </div>

  <div className="row">
  <div className="col-md-6">
    <form onSubmit={handleFormSubmit}>
      <div>
              <input
                type="text"
                name="nomprod"
                value={formData.nomprod}
                onChange={handleInputChange}
                className="form-control text-black bg-default"
                placeholder="Nom du produit"
              />
            </div>
            <div>
             <Select
                name="categorie"
         
                onChange={(selectedOption) => handleSelectChange(selectedOption)}
                options={categorie.map((option) => ({ label: option.nomcat, value: option["@id"] }))}
              />
            <Link className="btn btn-outline-secondary btn-user" to="/react/Zafy/catégorie/Ajout" >Add</Link>
            </div>
        <div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="form-control text-black bg-default"
            placeholder="Déscription"
          />
        </div>
        <input
        className="btn btn-outline-secondary btn-user"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            multiple
          />
     {/*    <div>
          <button className="btn btn-outline-secondary btn-user">Photo des Produits</button>
        </div> */}
          <AddDataComponent onAddData={handleAddData} />
          <div>
          <TableComponent columns={columns} data={tableData} onDelete={handleDelete} />
        </div>
          <button type="submit" className="btn btn-success btn-user btn-block">
          Save
        </button>
     
        
        </form>
  </div>

  <div className="col-md-6">
    <div className="p-5">
      <Rnt photos={selectedFiles} onDelete={handleDeletePhoto} />
    </div>
  </div>
</div>

  
    </>
  );

}

export default Pro;
