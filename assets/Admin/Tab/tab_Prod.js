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
import Select from 'react-select';
import useAxios from "../../api/useAxios";
import Sup from "./Modal/Sup";
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
import Nonoa from "../../Aina/modal";


function SelectLino({ Lino, handleSelectChange, index, selectedValue }) {
  const options = Lino.map((lib, i) => ({
    value: i,
    label: i + 1,
  }));

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: '80px', // Ajustez la largeur selon vos besoins
      minHeight: '30px', // Ajustez la hauteur selon vos besoins
      borderRadius: '4px', // Coins arrondis
      border: '1px solid #ccc', // Bordure
    }),
    indicatorSeparator: () => ({
      display: 'none', // Masquer le séparateur d'indicateur
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '1px', // Ajouter un peu de marge autour de l'indicateur de menu déroulant
    }),
    menu: (provided) => ({
      ...provided,
      maxHeight: '80px',
      overflow: 'auto', // Ajustez la hauteur maximale du menu déroulant
    }),
  };

  return (
    <Select
      options={options}
      value={options[selectedValue]}
      onChange={(selectedOption) => handleSelectChange(selectedOption.value, index)}
      styles={customStyles}
    />
  );
}





function AdminPro({userId}) {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [form] = Form.useForm();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectindex,setSelectIndex] = useState([0,0,0,0,0,0,0,0,0,0]); 
  const [selectAll, setSelectAll] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [current,setCurrent]=useState(1);
  const [size,setSize]=useState(1);
  const [total,setTotal]=useState(1);
  const axios = useAxios();



 

  
  const loadData = async (page=1) => {
    setLoading(true);

    try {
      const response = await axios.get(`https://127.0.0.1:9000/api/produits?page=${page}&order[createdAt]&user=${userId}`,{ headers:authHeader(), withCredentials: true});
      const data = response.data["hydra:member"];
      let abx=(response.data["hydra:member"].length);
      setSize(parseInt(abx));
      if (response.data["hydra:view"]) {
        const idMatch = response.data["hydra:view"]["@id"] ? response.data["hydra:view"]["@id"].match(/\d+$/) : null;
      const current_id = idMatch ? parseInt(idMatch[0]) : null;
      console.log('Page',current_id)
      setCurrent(parseInt(current_id));
      }
      else
      {
        setCurrent(1);
      }  const handlechangeUser = (e) =>
      {
        setUserId(e.value&&e.value)
      }
     
      setTotal(parseInt(response.data["hydra:totalItems"]));
      setGridData(data);
        
    } catch (error) {
      console.error("Error fetching data:", error);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [userId]); 
  useEffect(() => {
    if (selectedRecord === null) {
      // Si showModal est vrai et selectedRecord est toujours null,
      // définissez selectedRecord sur le premier enregistrement dans gridData
      if (gridData.length > 0) {
        setSelectedRecord(gridData[0]);
      }
    }
  }, [ selectedRecord, gridData]);
  const handleDelete = async (record) => {
    

    const dataSource = [...gridData];
    const filteredData = dataSource.filter((item) => item.id !== record.key);
    try {
      const response = await axios.patch(`https://127.0.0.1:9000/api/produits_post/${record.id}`, {isactive: false}, 
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
    const index = selectedRows.findIndex((item) => item.key === record.key);

    if (index > -1) {
      const newSelectedRows = [...selectedRows];
      newSelectedRows.splice(index, 1);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows([...selectedRows, record]);
    }
  };
  const handleSelectChange = (value, Index) => {
    
    const updatedSelectIndex = [...selectindex];
    updatedSelectIndex[Index] = value;
    setSelectIndex(updatedSelectIndex);
  };
  const modifiedData = gridData.map((item,i) => {
    const idMatch = item["@id"] ? item["@id"].match(/\d+$/) : null;
    const id = idMatch ? parseInt(idMatch[0]) : null;
  
    return {
      key: item["@id"] ,
      id: id,
      nom: item.nomprod,
      categorie: item.categorie.nomcat,
      unite: item.unites,
      description: item.description,
      quantite: item.unites[selectindex[i]]&&item.unites[selectindex[i]].quantitestock ,
      limite:  item.unites[selectindex[i]]&&item.unites[selectindex[i]].limite, 
      prixUnitaire:  item.unites[selectindex[i]]&&item.unites[selectindex[i]].prix,
      voirphoto: item.photos.map((item)=>(item.contentUrl)),
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
      dataIndex === "quantite" || dataIndex === "limite" ? (
        <Input type="number" />
      ) : (
        <Input />
      );

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
      title: "Nom",
      dataIndex: "nom",
      align: "center",
      editable: true,
    },
    {
      title: "Catégorie",
      dataIndex: "categorie",
      align: "center",
      editable: true,
    },
    {
      title: "Prix Unitaire",
      dataIndex: "prixUnitaire",
      align: "center",
      editable: true,
    },
    {
      title: "Unité",
      dataIndex: "unite",
      align: "center",
      editable: true,
      render: (text, record, index) => (
        <SelectLino
        index={index}
        Lino={record.unite}
        handleSelectChange={handleSelectChange}
        selectedValue={selectindex[index]} // Passez la valeur sélectionnée
      />
      
      ),
    },
    
    {
      title: "Déscription",
      dataIndex: "description",
      align: "center",
      editable: true,
    },
    {
      title: "Quantité",
      dataIndex: "quantite",
      align: "center",
      editable: true,
      render: (_, record) => (
        <div>

      
       {record?.quantite<=record?.limite ? (<span className="bg-danger btn btn-outline-danger btn-user  sweet-confirm">{record?.quantite}</span>):(<span>{record?.quantite}</span>)}
      

        </div>
      ),
    },
    {
      title: "Limite",
      dataIndex: "limite",
      align: "center",
      editable: true,
    },
    {
      title: "",
      dataIndex: "voirphoto",
      align: "center",
      render: (_, record) => (
        <div>

        <Nonoa    photos={record ? record.voirphoto : []}/>

        </div>
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return modifiedData.length >= 1 ? (
          <Space>
           
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
                    Delete
                  </Button>
                </Popconfirm>
          
          
          </Space>
        ) : null;
      },
    },
  ];


  const isEditing = (record) => {
    return record.key === editingKey;
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
      nom: record.nom,
      categorie: record.categorie,
      prixUnitaire: record.prixUnitaire,
      unite: record.unites,
      proprietaire: record.proprietaire,
      description: record.description,
      quantite: record.quantite,
      limite: record.limite,
    });
    setEditingKey(record.key);
  };

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

export default AdminPro;
