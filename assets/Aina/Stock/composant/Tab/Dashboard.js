import React, { useState, useEffect, useRef  } from "react";
import authHeader from "../../../../api/auth-header";
import useAxios from "../../../../api/useAxios";
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

function Dsh() {
  const axios = useAxios();
  const [articleVendu, setArticleVendu] = useState(null);
  const [clientsCount, setClientsCount] = useState(null);
  const [nombreCommande, setNombreCommande] = useState(null);
  const [totalProfit, setTotalProfit] = useState(null);
  const [clientsChartData, setClientsChartData] = useState([]);
  const [recetteParAnnee, setRecetteParAnnee] = useState([]);
  const [recetteParmois, setRecetteParmois]= useState([]);
  const chartRef = useRef(null);


  const fetchData = async (url, setData) => {
    try {
      const response = await axios.get(url, { headers: authHeader(), withCredentials: true });
      console.log(response);
      setData(response.data["hydra:member"]?.recette ||response.data.value || response.data.count || response.data || null);
    } catch (error) {
      console.error(`An error occurred while fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    const fetchDataForTotalProfits = async () => {
      try {
        const response = await axios.get('https://127.0.0.1:9000/api/commandes/2/totalProfits', {
          headers: authHeader(),
          withCredentials: true
        });
        const data = response.data["hydra:member"].map(item => {
       
          return item.recette;
        });
        setTotalProfit(data || null);
   

      } catch (error) {
        console.error("An error occurred while fetching totalProfits:", error);
      }
    };
  
    const fetchDataForOtherData = async () => {
      try {
        fetchData('https://127.0.0.1:9000/api/commandes/2/articleVendu', setArticleVendu);
        fetchData('https://127.0.0.1:9000/api/commandes/4/clients', setClientsCount);
        fetchData('https://127.0.0.1:9000/api/commandes/2/countcommande', setNombreCommande);
          
    fetchDataForTotalProfits();

      } catch (error) {
        console.error("An error occurred while fetching other data:", error);
      }
    };
    fetchDataForOtherData();

  }, []);
  
  useEffect(() => {
    const fetchDataForCharts = async () => {
      try {
        await fetchData('https://127.0.0.1:9000/api/commandes/2/articleVendu', setRecetteParAnnee);
        await fetchData('https://127.0.0.1:9000/api/commandes/4/clients', setClientsChartData);
        await fetchData('https://127.0.0.1:9000/api/commandes/2/countcommande', setRecetteParmois);
        // Add more fetch calls if needed
      } catch (error) {
        console.error("An error occurred while fetching chart data:", error);
      }
    };
    fetchDataForCharts();
  }, []);

  const renderChart = () => {
    // Assuming you have fetched data and set it using the state functions
    const recetteParAnneeData = recetteParAnnee || [];
    const clientsChartData = clientsChartData || [];
    const recetteParmoisData = recetteParmois || [];
  
    // Chart.js logic
    const ctx = document.getElementById('myChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar', // Change to the desired chart type (bar, line, pie, etc.)
      data: {
        labels: ['Label1', 'Label2', 'Label3'], // Replace with your labels
        datasets: [
          {
            label: 'Recette Par Annee',
            data: recetteParAnneeData,
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Adjust colors as needed
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Clients Chart Data',
            data: clientsChartData,
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Adjust colors as needed
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
          {
            label: 'Recette Par Mois',
            data: recetteParmoisData,
            backgroundColor: 'rgba(255, 205, 86, 0.2)', // Adjust colors as needed
            borderColor: 'rgba(255, 205, 86, 1)',
            borderWidth: 1,
          },
        ],
      },
    });
  };
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
                        <i className="ti-money color-success border-success"></i>
                      </div>
                      <div className="stat-content dib">
                        <div className="stat-text">Article Vendu</div>
                        <div className="stat-digit">
                          {articleVendu  ? articleVendu : 'Loading...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="card">
                    <div className="stat-widget-one">
                      <div className="stat-icon dib">
                        <i className="ti-user color-primary border-primary"></i>
                      </div>
                      <div className="stat-content dib">
                        <div className="stat-text">Clients</div>
                        <div className="stat-digit">
                          {clientsCount  ? clientsCount : 'Loading...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="card">
                    <div className="stat-widget-one">
                      <div className="stat-icon dib">
                        <i className="ti-layout-grid2 color-pink border-pink"></i>
                      </div>
                      <div className="stat-content dib">
                        <div className="stat-text">Nombre de commande</div>
                        <div className="stat-digit">
                          {nombreCommande  ? nombreCommande : 'Loading...'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="card">
                    <div className="stat-widget-one">
                      <div className="stat-icon dib">
                        <i className="ti-link color-danger border-danger"></i>
                      </div>
                      <div className="stat-content dib">
                        <div className="stat-text">Total profit</div>
                        <div className="stat-digit">
                          {totalProfit  && totalProfit }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                <canvas id="myChart" width="400" height="400" />;
                </div>
              </div>
                            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dsh;