import React, { useState, useEffect } from "react";
import { Link, useHistory } from 'react-router-dom';
import { Table, Popconfirm, Button, Space, Checkbox, Form } from 'antd';
import { isEmpty } from "lodash";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/lib/calendar2/pignose.calendar.min.css";
import "./css/lib/chartist/chartist.min.css";
import "./css/lib/font-awesome.min.css";
import "./css/lib/themify-icons.css";
import "./css/lib/owl.carousel.min.css";
import "./css/lib/owl.theme.default.min.css" ;
import "./css/lib/weather-icons.css";
import "./css/lib/menubar/sidebar.css";
import "./css/lib/bootstrap.min.css";
import "./css/lib/helper.css";
import "./css/style.css";
import "./css/lib/sweetalert/sweetalert.css";
import authHeader from "../../../../api/auth-header";
import Nonoa from "./modalLigneApp";
import useAxios from "../../../../api/useAxios";

function Stk (){
    const [gridData, setGridData]= useState([]);
  const [loading, setLoading]= useState([]);
  const [editingKey, setEditingKey]= useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [current,setCurrent]=useState(1);
  const [size,setSize]=useState(1);
  const [total,setTotal]=useState(1);
  const [editRow, setEditRow]= useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const axios = useAxios();
  useEffect(() =>{
  loadData();
}, []);
const loadData = async(page=1)=> {
  setLoading(true);
  try{
  const response = await axios.get(`https://127.0.0.1:9000/api/appros?page=${page}&order[dateappro]`,{ headers:authHeader(), withCredentials: true})
    const data = response.data["hydra:member"];
    setGridData(data);
      let abx=(response.data["hydra:member"].length);
      setSize(parseInt(abx));
      if (parseInt(response.data["hydra:totalItems"])> 10) {
        const idMatch = response.data["hydra:view"]["@id"] ? response.data["hydra:view"]["@id"].match(/\d+$/) : null;
      const current_id = idMatch ? parseInt(idMatch[0]) : null;
      setCurrent(parseInt(current_id));
      }
      else
      {
        setCurrent(1);
      }
     
      setTotal(parseInt(response.data["hydra:totalItems"]));
      
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
};
const handleCheckboxChange = (record) => {
    const index = selectedRows.findIndex((item) => item.key === record.key);

    if (index > -1) {
      const newSelectedRows = [...selectedRows];
      newSelectedRows.splice(index, 1);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows([...selectedRows, record]);
    }
  };
  const handleSelectAll = () => {
    // Fonction pour gérer la sélection globale
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...gridData]);
    }
    setSelectAll(!selectAll);
  };
  const handleVoir = (record) => {
    console.log("Voir Photo clicked for record:", record);
  };
  
const modifiedData = gridData.map((item) => {
  // Vérifiez si '@id' est défini avant d'essayer de l'extraire
  const id = item['@id'] ? parseInt(item['@id'].match(/\d+$/)[0]) : null;
  return {
    key: id,
    id: id,
    date: item.dateappro,
    etat: item.etat,
    motif:item.motif,
    ligneappro: item.ligneappros,
    // ...
  };
});

  const columns= [
    {
        title: "",
        dataIndex: "checkbox",
        align: "center",
        render: (_, record) => (
          <Checkbox
            onChange={() => handleCheckboxChange(record)}
            checked={selectedRows.some((row) => row.key === record.key)}
          />
        ),
      },
      {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Motif",
    dataIndex: "motif",
    align: "center",
    editable: true,
  },
  {
    title: "Date d'Opération",
    dataIndex: "date",
    align: "center",
    editable: true,
  },
  {
    title: "Etat",
    dataIndex: "etat",
    align: "center",
    editable: true,
    render: (_, record) => {
      if (record.etat) {
    
        return(
          <span>Entré</span>
        );
      }
      else{
        return(
          <span>Sortie</span>
        );
      }
    }
     
      
    
  },
  
  {
    title: "",
    dataIndex: "ligneappro",
    align: "center",
    render: (_, record) => (
      <Nonoa data={record.ligneappro}/>
    ),
  },
  
]
    const isEditing = (record)=> {
        return record.key === editingKey;
    }
  
    const mergedColumns = columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record) => ({
          record,
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record),
        }),
      };
    });
    return (
      <div className="content-wrap">
        <div className="container-fluid">
          <div className="row align-items-center">
            <div className="col-md-6 mt-3 order-md-1">
            <Link  className="btn btn-outline-secondary btn-user" to="/react/Zafy/Opération/Ajout"   >Add</Link>
            </div>
    
            <div className="col-lg-8">
              <div className="page-header">
                <div className="page-title">
                  <h1>
                    Hello,
                    <span>Welcome Here</span>
                  </h1>
                </div>
              </div>
            </div>
    
            <div className="col-lg-4">
              <div className="page-header">
                <div className="page-title">
                  <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                      <a href="#">Dashboard</a>
                    </li>
                    <li className="breadcrumb-item active">Produits</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
    
          <div className="row mt-3">
            <div className="col-md-12">
                <div className="table-responsive">
                <Table
                                columns= {columns}
                                dataSource= {modifiedData}
                                bordered
                                loading= {loading} 
                                pagination={{
                                    current: current, // Numéro de la page actuelle
                                    pageSize: 10, // Nombre d'éléments par page
                                    total: total, // Nombre total d'éléments (à remplacer par la valeur réelle)
                                    showSizeChanger: true, // Option pour changer la taille de la page
                                    showQuickJumper: true, // Option pour sauter rapidement à une page
                                    onChange: (page) => loadData(page), // Fonction appelée lorsqu'une nouvelle page est sélectionnée
                                  }}
                            
                    footer={() => (
                      <div className="text-left">
                      <Checkbox onChange={handleSelectAll} checked={selectAll}>
                        Select All
                      </Checkbox>
                    </div>
                    )}
                  />
                </div>
            </div>
          </div>
        </div>
      </div>
    );
}
export default Stk;