import React from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button';
import ModalHeader from "react-bootstrap/esm/ModalHeader";
import ModalTitle from "react-bootstrap/esm/ModalTitle";
import ModalBody from "react-bootstrap/esm/ModalBody";
import ModalFooter from "react-bootstrap/esm/ModalFooter";

function Sup(){
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return(
        <>
            <button onClick={handleShow} className="btn btn-outline-danger btn-user btn sweet-confirm">
                <i className=" fa fa-trash-o"></i> Delete</button>
            <Modal
                title= "Are you sure to delete ?"
                text= "You will not be able to recover this imaginary file !!"
                type= "warning"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
               
            >
                <Modal.Header closeButton>
                    <Modal.Title>Are you sure to delete ?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You will not be able to recover this file !!
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Close </Button>
                    <Button variant="danger" >Delete it!! </Button>
                        
                </Modal.Footer>
            </Modal>
        </>

    )
}
export default Sup;