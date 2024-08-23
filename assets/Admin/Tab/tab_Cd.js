import React, { useState, useEffect }from "react";
import {  Link } from 'react-router-dom';
import { Table, Popconfirm, Button, Space,Checkbox, Form } from 'antd';
import { Input, InputNumber } from 'antd';
import {isEmpty} from "lodash";
import useAxios from "../../api/useAxios";
import Sup from "./Modal/Sup";
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
import authHeader from "../../api/auth-header";
import Nonoa from "./modalLigneCom";




function AdminCd ({userId}){
    const [gridData, setGridData]= useState([]);
    const [loading, setLoading]= useState([]);
    const [editingKey, setEditingKey]= useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [current,setCurrent]=useState(1);
    const [total,setTotal]=useState(1);
    const [editRow, setEditRow]= useState(false);
    const [selectAll, setSelectAll] = useState(false);
    const axios = useAxios();
    useEffect(() =>{
    loadData();
  }, [userId]);
  const loadData = async(page=1)=> {
    setLoading(true);
    try {
    const response = await axios.get(`https://127.0.0.1:9000/api/commandes_recu?page=${page}&order[datecom]&vendeur=${userId}`,{ headers:authHeader(), withCredentials: true})
    const data = response.data["hydra:member"];
    setGridData(data);
      if (response.data["hydra:view"]) {
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

  const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };
   const handleDelete = async (record) => {

    try {
      const response = await axios.patch(`https://127.0.0.1:9000/api/commandes_recu/${record.id}`, {isactive: false}, 
      {
        headers: {
          'Content-Type': "application/merge-patch+json",
          ...authHeader(), withCredentials: true,
        }
      });
   
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    loadData();
  };
  const modifiedData = gridData.map((item) => {
    const id = parseInt(item['@id'].match(/\d+$/)[0]);
    return{
    key: id ,
    id: id,
    client:{nom:item.user.nom,prenom:item.user.prenom,telephone:item.user.telephone,email:item.user.email},
    date:item.datecom,
    lignecom:item.lignecoms,
    
    
  
    
     // Utilisez item.id comme clé
    
  }});
  

  const columns= [

      {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "Clients",
    dataIndex: "client",
    align: "center",
    editable: true,
    render: (_, record) => (
      <div>

<span>{record?.client.nom+' '+record?.client.prenom}</span><br/>
     <span>{record?.client.email}</span><br/>
     <span>{record?.client.telephone}</span><br/>
    
    

      </div>
    ),
  },
  {
    title: "Date de commandes",
    dataIndex: "date",
    align: "center",
    editable: true,
  },
  {
    title: "Type de payement",
    dataIndex: "payement",
    align: "center",
    editable: true,
  },
  {
    title: "",
    dataIndex: "lignecom",
    align: "center",
    render: (_, record) => (
      <Nonoa data={record.lignecom}/>
    ),
  },
  {
    title: "",
    dataIndex: "action",
    align: "center",
    render: (_, record)=> {
        return modifiedData.length >=1 ?(
            <Space>
        <Popconfirm
        title= "Are you sure to delete ?"
        text= "You will not be able to recover this imaginary file !!"
        type= "warning"
        onConfirm={()=> handleDelete(record)}
        >
            <Button type="primary" danger className="btn btn-outline-danger btn-user btn sweet-confirm">
                Delete
            </Button>
        </Popconfirm>
            </Space>
    ):null;
  },
},
]
    const isEditing = (record)=> {
        return record.key === editingKey;
    }
  const mergedColumns= columns.map((col)=>{
    if(!col.editable){
        return col;
    }
    return {
        ...col,
        onCell: (record)=> ({
            record,
            dataIndex: col.dataIndex,
            title: col.title,
            editing: isEditing(record),
        })
    }
  })

  return (
    <div className="content-wrap">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6 mt-3 order-md-1">
          </div>
  
          <div className="col-md-6 mt-3 order-md-2 text-right">
            <form className="form-inline mw-100 navbar-search">
              <div className="input-group ml-auto">
              </div>
            </form>
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
                        components={{
                          body: {
                            cell: EditableCell,
                          },
                        }}
                        columns={mergedColumns}
                        dataSource={modifiedData}
                        bordered
                        loading={loading}
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

export default AdminCd;