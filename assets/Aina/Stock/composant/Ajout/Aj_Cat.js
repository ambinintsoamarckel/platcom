import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "../../../headerZf";
import { useNavigate } from 'react-router-dom';

const AJ_Ct = () => {
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

      const response = await axios.post(
        "https://127.0.0.1:9000/api/categories",
        { ...formData, ...dataForm },
        {
          headers: {
            'Content-Type': 'application/ld+json',
          }
        }
      );

      console.log('Réponse du serveur :', response.data);
      navigate('../react/Zafy/Catégorie');
    } catch (error) {
      console.error('Erreur lors de la requête POST :', error);
    }
  };

  return (
    <>

        <Header />
 
     
    
  
      <div className="row">
        <div className="col-lg-7">
          <div className="p-5">
            <div className="text-center">
              <h1 className="h4 text-gray-900 mb-4">Ajout Catégorie</h1>
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
      </div>
    </>
  );
  
};

export default AJ_Ct;
