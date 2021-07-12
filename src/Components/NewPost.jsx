import React, { useState, useRef } from "react";
import { projectFirestore, timestamp } from "../firebase/config";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

export default function NewPost() {
  const postRef = useRef();
  const [error, setError] = useState("");
  //   const [loading, setLoading] = useState(false);

  async function handleSubmitPost(e) {
    setError("");
    e.preventDefault();

    // references
    const collectionRef = projectFirestore.collection("posts");

    const post = postRef.current.value;
    const createdAt = timestamp();
    collectionRef.add({ post, createdAt });

    postRef.current.value = "";

    // try {
    //   setError("");

    //   await submit(emailRef.current.value, passwordRef.current.value);
    // } catch (err) {
    //   setError(err.message);
    // }

    // setLoading(false);
  }

  return (
    <Form onSubmit={handleSubmitPost}>
      <Form.Group controlId="exampleForm.ControlTextarea1">
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
        <Form.Control
          as="textarea"
          rows={2}
          placeholder="Enter in content you want to share."
          ref={postRef}
          className="shadow-none"
          style={{ minHeight: "60px" }}
        />
      </Form.Group>
      <Button
        disabled={false}
        variant="primary"
        type="submit"
        block={true.toString()}
        className="inline-block"
      >
        {false ? (
          <div className="box">
            <div className="card1"></div>
            <div className="card2"></div>
            <div className="card3"></div>
          </div>
        ) : (
          "Submit"
        )}
      </Button>
    </Form>
  );
}
