import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

export default function ModalDialog({
  showModalDialog,
  handleCloseModalDialog,
}) {
  return (
    <Modal show={showModalDialog} onHide={handleCloseModalDialog}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModalDialog}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCloseModalDialog}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
