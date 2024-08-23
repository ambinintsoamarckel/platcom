import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Rnt from "./photoproduits";

function Nonoa({  photos }) {
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);

          }
  const [show, setShow] = useState(false);
    return (
      <>
            <Button variant="primary" onClick={handleShow}>
        Voir Photo
      </Button>
          <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>Photo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Rnt photos={photos&& photos} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Quitter
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }

export default Nonoa;
