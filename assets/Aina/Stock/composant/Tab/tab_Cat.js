import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Table, Popconfirm, Button, Space, Form, Input, Checkbox } from 'antd';  // Ajout de Input et Checkbox
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import authHeader from "../../../../api/auth-header";
import { useData } from "../../../DataContext";


function CAT() {
  const { state, dispatch } = useData();
  const { categories } = state;
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState("");
  const [editRow, setEditRow] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [current,setCurrent]=useState();
  const [size,setSize]=useState();
  const [total,setTotal]=useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async (page=1) => {
    setLoading(true);
    try {
      const response = await axios.get(`https://127.0.0.1:9000/api/categories?page=${page}`);
      const data = response.data["hydra:member"];
    console.log(response.data);
    setGridData(data); 
    console.log("foryyyyyeeeeee");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (record) => {
    

    const dataSource = [...gridData];
    const filteredData = dataSource.filter((item) => item.id !== record.id);
    try {
      const response = await axios.patch(`https://127.0.0.1:9000/api/categories/${record.id}`, {isactive: false}, {headers: {
        'Content-Type': "application/merge-patch+json"}});
    console.log(response.data);
   
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    console.log("kindyyyy",filteredData)
    setGridData(filteredData);
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
    const index = selectedRows.findIndex((item) => item.key === record.key);

    if (index > -1) {
      const newSelectedRows = [...selectedRows];
      newSelectedRows.splice(index, 1);
      setSelectedRows(newSelectedRows);
    } else {
      setSelectedRows([...selectedRows, record]);
    }
  };

  const modifiedData = gridData.map((item) => {
    const id = parseInt(item['@id'].match(/\d+$/)[0]);
    console.log("forummmm",item.categorieParent);
    return {
      key: id,
      id: id,
      nom: item.nomcat,
      parente: item.categorieParent && item.categorieParent.nomcat,
    };
  });

  const columns = [
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
      title: "Nom",
      dataIndex: "nom",
      align: "center",
      editable: true,
      render: (text, record) => {
        if (isEditing(record)) {
          return (
            <Form.Item
              name="nom"
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: 'Please input nom!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: "Catégorie parente",
      dataIndex: "parente",
      align: "center",
      editable: true,
      render: (text, record) => {
        if (isEditing(record)) {
          return (
            <Form.Item
              name="parente"
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: 'Please input catégorie parente!',
                },
              ]}
            >
              <Input />
            </Form.Item>
          );
        }
        return text;
      },
    },
    {
      title: "",
      dataIndex: "action",
      align: "center",
      render: (_, record) => {
        const editable = isEditing(record);
        return modifiedData.length >= 1 ? (
          <Space>
            <Link
              className="btn btn-outline-warning btn-user"
              to={{
                pathname: `/react/Zafy/Catégorie/Edit/${record.id}`,
                state: { recordData: record },
              }}
              disabled={editingKey !== ""}
            >
              Edit
            </Link>
            <Popconfirm
              title="Are you sure to delete?"
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

  const isEditing = (record) => record.key === editingKey;

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
        <Link className="btn btn-outline-secondary btn-user" to="/react/Zafy/Catégorie/Ajout" >
          Add
        </Link>
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

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
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

export default CAT;
