import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../../../headerZf";
import { useNavigate,useLocation, useParams  } from 'react-router-dom';
import { useData } from '../../../DataContext';

const Ed_Ct = () => {
  const { state, dispatch } = useData();
  const { id } = useParams();
   useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`https://127.0.0.1:9000/api/categories/${id}`);
        const categoryData = response.data; // Données de la catégorie avec l'identifiant spécifié
        // Utilisez ces données pour pré-remplir le formulaire d'édition
        setFormData({ nomcat: categoryData.nomcat });
        setDataForme({ categorieParent: categoryData.categorieParent });
      } catch (error) {
        console.error('Erreur lors de la récupération des données de la catégorie :', error);
      }
    };

    fetchData();
  }, [id]);
  const location = useLocation();
  const { recordData } = location.state || {};
  useEffect(() => {
    if (recordData) {
      // Mettez à jour les états avec les données d'édition
      setFormData({ nomcat: recordData.nom });
      setDataForme({ categorieParent: recordData.parente });
    }
  }, [recordData]);
 

  const [formData, setFormData] = useState({
    nomcat: '',
  });
  const [dataForm, setDataForme]= useState({
    categorieParent: null,
  })

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("https://127.0.0.1:9000/api/categories");
        console.log('Données de la requête GET :', response.data);

        const hydraView = response.data['hydra:view'];
        const categoriesData = Array.isArray(response.data['hydra:member']) ? response.data['hydra:member'] : [];

        setCategories(categoriesData);

        if (hydraView) {
          // Access properties of 'hydra:view' here
        }
      } catch (error) {
        console.error('Erreur lors de la requête GET pour les catégories :', error);
        setError('Erreur lors de la récupération des catégories.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (e) => {
    setDataForme({
      ...dataForm,
      [e.target.name]: e.target.value === '' ? null : "api/categories/"+e.target.value
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const selectedCategory = categories.find(category => category.nomcat === formData.categorieParent);

      const response = await axios.patch(
        `https://127.0.0.1:9000/api/categories/${id}`,
        { ...formData, ...dataForm },
        {
          headers: {
            'Content-Type': "application/merge-patch+json",
          }
        }
      );

      console.log('Réponse du serveur :', response.data);

      dispatch({ type: 'SET_CATEGORIES', payload: response.data });

      navigate('../react/Zafy/Catégorie');
    } catch (error) {
      console.error('Erreur lors de la requête POST :', error);
    }
  };

  return (
    <>
      
          <Header/>
        
      <div className="col-lg-5 d-none d-lg-block bg-register-image"></div>
      <div className="col-lg-7">
        <div className="p-5">
          <div className="text-center">
            <h1 className="h4 text-gray-900 mb-4">Edit Catégorie</h1>
          </div>
          <form className="user" onSubmit={handleFormSubmit}>
            {loading && <p>Chargement des catégories...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
              <input
                type="text"
                name="nomcat"
                value={formData.nomcat}
                onChange={handleInputChange}
                className="form-control text-black bg-default"
                placeholder="Nom"
              />
            </div>
            <div>
            <select
              name="categorieParent"
              value={dataForm.categorieParent || ''}
              onChange={handleSelectChange}
              className="form-control text-black bg-default"
            >
              {!dataForm.categorieParent && (
                <option value="" disabled>
                  Sélectionnez une catégorie parente
                </option>
              )}
              {categories.map((category) => {
                const idMatch = category["@id"] ? category["@id"].match(/\d+$/) : null;
                const id = idMatch ? parseInt(idMatch[0]) : null;
                return (
                  <option key={id} value={id}>
                    {category.nomcat}
                  </option>
                );
              })}
            </select>
            </div>
            <button type="submit" className="btn btn-success btn-user btn-block">
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Ed_Ct;
