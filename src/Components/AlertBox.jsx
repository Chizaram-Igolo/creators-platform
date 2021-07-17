import React from "react";
import { useToasts } from "react-toast-notifications";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

import "./styles/AlertBox.css";

export default function AlertBox({ error, top }) {
  return (
    <>
      {error && (
        <>
          <Alert
            variant="warning"
            className="form-alert text-danger border border-warning auto-height alert-box"
            style={{ top: top ? top : 0 }}
          >
            <Form.Text className="status-message">{error}</Form.Text>
          </Alert>
          <br />
        </>
      )}
    </>
  );
}
