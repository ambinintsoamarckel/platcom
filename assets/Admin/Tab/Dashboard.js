import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBox, faShoppingCart, faLink } from '@fortawesome/free-solid-svg-icons';
import authHeader from "../../api/auth-header";
import useAxios from "../../api/useAxios";
import Barchart from "../Barchart";
import Linechart from "../LineChart";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/lib/calendar2/pignose.calendar.min.css";
import "./css/lib/chartist/chartist.min.css";
import "./css/lib/font-awesome.min.css";
import "./css/lib/themify-icons.css";
import "./css/lib/owl.carousel.min.css";
import "./css/lib/owl.theme.default.min.css";
import "./css/lib/weather-icons.css";
import "./css/lib/menubar/sidebar.css";
import "./css/lib/bootstrap.min.css";
import "./css/lib/helper.css";
import "./css/style.css";

function AdminDsh(id) {
  const axios = useAxios();
  const [articleVendu, setArticleVendu] = useState(null);
  const [clientsCount, setClientsCount] = useState(null);
  const [nombreCommande, setNombreCommande] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);
  const [clientsChartData, setClientsChartData] = useState([]);
  const [recetteParAnnee, setRecetteParAnnee] = useState([]);
  const [recetteParmois, setRecetteParmois] = useState([]);
  const chartRef = useRef(null);

  const fetchData = async (url, setData) => {
    try {
      const response = await axios.get(url, { headers: authHeader(), withCredentials: true });
      console.log(response)
      setData(response.data["hydra:member"]?.recette || response.data.value || response.data.count || response.data || null);
    } catch (error) {
      console.error(`An error occurred while fetching data from ${url}:`, error);
    }
  };

  const fetchChartclient = async (url, setData) => {
    try {
      const response = await axios.get(url, { headers: authHeader(), withCredentials: true });
      const data = {
        labels: response.data["hydra:member"].map((item) => (item.userId)),
        datasets: [
          {
            label: "Article acheté",
            data: response.data["hydra:member"].map((item) => (item.quantiteTotale)),
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              // Ajoutez autant de couleurs que nécessaire
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              // Ajoutez autant de couleurs que nécessaire
            ],
            borderWidth: 1,
          },
        ],
      };
      setData(data);
    } catch (error) {
      console.error(`An error occurred while fetching data from ${url}:`, error);
    }
  };

  const fetchChartrecette = async (url, setData) => {
    try {
      const response = await axios.get(url, { headers: authHeader(), withCredentials: true });
      console.log(response.data["hydra:member"]);
  
      const monthLabels = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ];
  
      const data = {
        labels: monthLabels, // Utilisez les noms des mois comme labels
        datasets: [
          {
            label: "recette",
            data: Array.from({ length: 12 }, (_, index) => {
              // Remplacez les recettes correspondantes s'il y a des données pour ce mois
              const monthData = response.data["hydra:member"].find(item => item.mois === (index + 1));
              return monthData ? monthData.recette : 0;
            }),
            backgroundColor: [
              'rgba(255, 99, 132, 0.5)',
              'rgba(54, 162, 235, 0.5)',
              'rgba(255, 206, 86, 0.5)',
              'rgba(75, 192, 192, 0.5)',
              // Ajoutez autant de couleurs que nécessaire
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              // Ajoutez autant de couleurs que nécessaire
            ],
            borderWidth: 1,
            fill: true,
          },
        ],
      };
  
      setData(data);
    } catch (error) {
      console.error(`An error occurred while fetching data from ${url}:`, error);
    }
  };
  
  useEffect(() => {
    const fetchDataForTotalProfits = async () => {
      try {
        if (id.id) {
          const response = await axios.get(`https://127.0.0.1:9000/api/commandes/${id && id.id}/totalProfits`, {
            headers: authHeader(),
            withCredentials: true
          });
          const data = response.data["hydra:member"].map(item => {
            return item.recette;
          });
          setTotalProfit(data || null);
        }

      } catch (error) {
        console.error("An error occurred while fetching totalProfits:", error);
      }
    };

    const fetchDataForOtherData = async () => {
      try {
        if (id.id) {
          fetchData(`https://127.0.0.1:9000/api/commandes/${id && id.id}/articleVendu`, setArticleVendu);
          fetchData(`https://127.0.0.1:9000/api/commandes/${id && id.id}/clients`, setClientsCount);
          fetchData(`https://127.0.0.1:9000/api/commandes/${id && id.id}/countcommande`, setNombreCommande);

          fetchDataForTotalProfits();
        }

      } catch (error) {
        console.error("An error occurred while fetching other data:", error);
      }
    };
    fetchDataForOtherData();

  }, [id]);

  useEffect(() => {
    const fetchDataForCharts = async () => {
      try {
        if (id.id) {
          await fetchChartclient(`https://127.0.0.1:9000/api/commandes/${id && id.id}/clientschart`, setClientsChartData);
          await fetchChartrecette(`https://127.0.0.1:9000/api/commandes/${id && id.id}/recetteParmois`, setRecetteParmois);

        }

        // Add more fetch calls if needed
      } catch (error) {
        console.error("An error occurred while fetching chart data:", error);
      }
    };
    fetchDataForCharts();
  }, [id]);

  return (
    <>
      <div className="content-wrap">
        <div className="main">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-8 p-r-0 title-margin-right">
                <div className="page-header">
                  <div className="page-title">
                    <h1>Hello, <span>Welcome Here</span></h1>
                  </div>
                </div>
              </div>

              <div className="col-lg-4 p-l-0 title-margin-left">
                <div className="page-header">
                  <div className="page-title">
                    <ol className="breadcrumb">
                      <li className="breadcrumb-item"><a href="#">Dashboard</a></li>
                      <li className="breadcrumb-item active">Home</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <section id="main-content">
              <div className="row">
                <div className="col-lg-3">
                  <div className="card">
                    <div className="stat-widget-one">
                      <div className="stat-icon dib">
                        <FontAwesomeIcon icon={faBox} className="color-success border-success" size="3x" />
                      </div>
                      <div className="stat-content dib">
                        <div className="stat-text">Article Vendu</div>
                        <div className="stat-digit">
                          {articleVendu ? articleVendu : 'Loading...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="card">
                    <div className="stat-widget-one">
                      <div className="stat-icon dib">
                        <FontAwesomeIcon icon={faUser} className="color-primary border-primary" size="3x"/>
                      </div>
                      <div className="stat-content dib">
                        <div className="stat-text">Clients</div>
                        <div className="stat-digit">
                          {clientsCount ? clientsCount : 'Loading...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="card">
                    <div className="stat-widget-one">
                      <div className="stat-icon dib">
                        <FontAwesomeIcon icon={faShoppingCart} className="color-pink border-pink" size="3x"/>
                      </div>
                      <div className="stat-content dib">
                        <div className="stat-text">Nombre de commande</div>
                        <div className="stat-digit">
                          {nombreCommande ? nombreCommande : 'Loading...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="card">
                    <div className="stat-widget-one">
                      <div className="stat-icon dib">
                        <FontAwesomeIcon icon={faLink} className="color-danger border-danger" size="3x"/>
                      </div>
                      <div className="stat-content dib">
                        <div className="stat-text">Total profit</div>
                        <div className="stat-digit">
                          {totalProfit ? totalProfit + ' Ar':'Loading...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  {clientsChartData && clientsChartData.datasets && clientsChartData.datasets.length > 0 && (
                    <div className="card">
                      <div className="card-body">
                        <Barchart chartData={clientsChartData} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-lg-6">
                  {recetteParmois && recetteParmois.datasets && recetteParmois.datasets.length > 0 && (
                    <div className="card">
                      <div className="card-body">
                        <Linechart chartData={recetteParmois} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDsh;
