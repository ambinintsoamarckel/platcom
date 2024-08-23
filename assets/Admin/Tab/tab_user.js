import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  Popconfirm,
  Button,
  Space,
  Form,
  Input,
  Checkbox,
} from "antd";
import useAxios from "../../api/useAxios";
import Sup from "./Modal/Sup";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
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
import "./css/lib/sweetalert/sweetalert.css";
import authHeader from "../../api/auth-header";







function AdminUser({setUserDrop}) {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [current,setCurrent]=useState(1);
  const [size,setSize]=useState(1);
  const [total,setTotal]=useState(1);
  const axios = useAxios();


 

  
  const loadData = async (page=1) => {
    setLoading(true);

    try {
      const response = await axios.get(`https://127.0.0.1:9000/api/users?page=${page}&order[createdat]`,{ headers:authHeader(), withCredentials: true});
      const data = response.data["hydra:member"];
      console.log('Aizaa',response)
      let abx=(response.data["hydra:member"].length);
      setSize(parseInt(abx));
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

      if (data.length > 0) {
  /*       setSelectIndex(0); */
        setGridData(data);
        
        
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []); 
  const handleDelete = async (record) => {
    

    const dataSource = [...gridData];
    const filteredData = dataSource.filter((item) => item.id !== record?.key);
    console.log(!record.status);
    try {
      const response = await axios.patch(`https://127.0.0.1:9000/api/users/${record?.id}`, {isactive: !(record?.status)}, 
      {
        headers: {
          'Content-Type': "application/merge-patch+json",
          ...authHeader(), withCredentials: true,
        }
      });
      setUserDrop((prevState) => !prevState); 
    
   
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    loadData();
  };
  const Searching = async (searchValue) => {
    setLoading(true);
  
    try {
      // Check if the length of searchValue is greater than or equal to 3
      if (searchValue.length >= 3) {
        const response = await axios.get(
          `https://127.0.0.1:9000/api/users?page=1&uuid=${searchValue}`,
          { headers: authHeader(), withCredentials: true }
        );
  
        const data = response.data["hydra:member"];
  
        if (data.length > 0) {
          setGridData(data);
        } else {
          setGridData([]); // Set grid data to an empty array if no results are found
        }
      } else if (searchValue.length === 0){
    loadData();
     
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle the error, e.g., show an error message to the user
    } finally {
      setLoading(false);
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

  const handleCheckboxChange = (record) => {
    // Fonction pour gérer la sélection individuelle
    const index = selectedRows.findIndex((item) => item.key === record?.key);

    if (index > -1) {
      const newSelectedRows = [...selectedRows];
      newSelectedRows.splice(index, 1);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows([...selectedRows, record]);
    }
  };
  const modifiedData = gridData.map((item,i) => {
    const idMatch = item["@id"] ? item["@id"].match(/\d+$/) : null;
    const id = idMatch ? parseInt(idMatch[0]) : null;
  
    return {
      key: item["@id"] ,
      id: id,
      identite: {nom:item.nom, prenom:item.prenom, sexe:item.sexe},
      coordonne: {telephone:item.telephone,email:item.email},
      username: item.uuid,
      adresse: {ville:item.adresse.ville,code:item.adresse.code},
      roles: item.roles,
      status: item.isactive,
      nbauth:item.nbAuth,

    };
  });
  
  

  const EditableCell = ({
    editing,
    dataIndex,
    title,
    record,
    children,
    ...restProps
  }) => {
    const input =
   
    
        <Input />
      ;

    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{ margin: 0 }}
            rules={[
              {
                required: true,
                message: `Please input ${title}`,
              },
            ]}
          >
            {input}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const columns = [
    
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "Identité",
      dataIndex: "identite",
      align: "center",
      editable: true,
      render: (_, record) => (
        <div>

       <span>{record?.identite.nom+' '+record?.identite.prenom}</span><br/>
       {record?.identite.sexe ? (<span>Homme</span>):(<span>Femme</span>)}
      

        </div>
      ),
    },
    {
      title: "Coordonné",
      dataIndex: "coordonne",
      align: "center",
      editable: true,
      render: (_, record) => (
        <div>

       
       <span>{record?.coordonne.email}</span><br/>
       <span>{record?.coordonne.telephone}</span><br/>
      
      

        </div>
      ),
    },
    {
      title: "Adresse",
      dataIndex: "adresse",
      align: "center",
      editable: true,
      render: (_, record) => (
        <div>

       <span>{record?.adresse.code+' '+record?.adresse.ville}</span><br/>
      
      

        </div>
      ),
      
    },
    {
      title: "Nombre d'Authentification",
      dataIndex: "nbauth",
      align: "center",
      editable: true,
    },
    
    {
      title: "Statut",
      dataIndex: "status",
      align: "center",
      editable: true,
      render: (_, record) => (
        <div>

{record?.status ? (<span>Activé</span>):(<span>Desactivé</span>)}
      
      

        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "description",
      align: "center",
      editable: true,
      render: (_, record) => {
        let statusLabel;
      
        if (record.roles&&record?.roles[0] === "ROLE_ADMIN") {
          statusLabel = <span> Administrateur</span>;
        } else if (record.roles&&record?.roles[0] === "ROLE_SELLER") {
          statusLabel = <span>Vendeur</span>;
        } else if (record.roles&&record?.roles[0] === "ROLE_BUYER") {
            statusLabel = <span>Acheteur</span>;
          } else {
          statusLabel = <span></span>;
        }
      
        return statusLabel;
      }
      
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return modifiedData.length >= 1 ? (
          <Space>
            {editable ? (
              <span>
                <Button
                  onClick={() => save(record?.key)}
                  type="primary"
                  style={{ marginRight: 8 }}
                >
                  Save
                </Button>
                <Popconfirm title="Sure to cancel" onConfirm={cancel}>
                  <Button>Cancel</Button>
                </Popconfirm>
              </span>
            ) : (
              <>
              <Link to={`/react/Admin/EditUser/${record?.id}`}>
                <Button
                  type="warning"
                  className="btn btn-outline-warning btn-user"
                >
                  Edit
                </Button>
                </Link>
                <Popconfirm
                  title="Are you sure to delete?"
                  text="You will not be able to recover this imaginary file!!"
                  type="warning"
                  onConfirm={() => handleDelete(record)}
                >
                  <Button
                    type="primary"
                    danger
                    className="btn btn-outline-danger btn-user btn sweet-confirm"
                  >
                   {!record?.status ? (<span>Activer</span>):(<span>Desactiver</span>)}
                  </Button>
                </Popconfirm>
                
              </>
            )}
          </Space>
        ) : null;
      },
    },
  ];


  const isEditing = (record) => {
    return record?.key === editingKey;
  };

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

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...modifiedData];
      const index = newData.findIndex((item) => key === item.key);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setGridData(newData);
        setEditingKey("");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const edit = (record) => {
    form.setFieldsValue({
      nom: record?.nom,
      categorie: record?.categorie,
      prixUnitaire: record?.prixUnitaire,
      unite: record?.unites,
      proprietaire: record?.proprietaire,
      description: record?.description,
      quantite: record?.quantite,
      limite: record?.limite,
    });
    setEditingKey(record?.key);
  };

  return (
    <div className="content-wrap">
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-md-6 mt-3 order-md-1">
            <Link className="btn btn-outline-secondary btn-user" to="/react/Admin/AddUser">
              Add
            </Link>
          </div>
  
          <div className="col-md-6 mt-3 order-md-2 text-right">
            <form className="form-inline mw-100 navbar-search">
              <div className="input-group ml-auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for..."
                  aria-label="Search"
                  aria-describedby="basic-addon2"
                  onChange={(e) => Searching(e.target.value)}
                />
            
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
            <Form form={form} component={false}>
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
                    onChange: (page) => loadData(page), 
                  }}
                  
                />
              </div>
           
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUser;
