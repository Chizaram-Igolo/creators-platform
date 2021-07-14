import React from "react";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";

export default function ErrorDisplay({ error }) {
  return (
    <>
      {error && (
        <>
          <Alert
            variant="light"
            className="form-alert text-danger border border-danger auto-height"
          >
            <Form.Text className="text-danger status-message">
              {error}
            </Form.Text>
          </Alert>
          <br />
        </>
      )}
    </>
  );
}
