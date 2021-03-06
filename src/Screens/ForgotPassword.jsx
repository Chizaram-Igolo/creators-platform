import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";

import { AlertMessage } from "../Components";

import { useAuth } from "../contexts/AuthContext";

import "./styles/Signin.css";

function ForgotPassword(props) {
  const emailRef = useRef();
  const { resetPassword } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function clearMessages() {}

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await resetPassword(emailRef.current.value);
      setMessage("Check your inbox for further instructions.");
    } catch (err) {
      setError(err.message.replace("identifier", "email address"));
    }

    setLoading(false);
  }

  return (
    <>
      <Container>
        <Row>
          <Col></Col>
          <Col xs={10} md={8} lg={6} xl={5}>
            <Form className="vertical-center" onSubmit={handleSubmit}>
              <h3 className="mb-5 text-center">Reset Password</h3>

              {error && (
                <AlertMessage
                  message={error}
                  severity="error"
                  isOpen={error.length > 0}
                  clearMessages={clearMessages}
                  keepOpen={true}
                />
              )}

              {message && (
                <AlertMessage
                  message={message}
                  severity="success"
                  isOpen={message.length > 0}
                  clearMessages={clearMessages}
                  keepOpen={true}
                />
              )}

              <p>Enter your account email.</p>

              <Form.Group controlId="formBasicEmail">
                {/* <Form.Label>Email address</Form.Label> */}

                <InputGroup hasValidation>
                  <Form.Control
                    type="email"
                    required
                    // isInvalid={error.length > 0}
                    ref={emailRef}
                    placeholder="Email Address"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a username.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Button
                disabled={loading}
                variant="primary"
                type="submit"
                block={true.toString()}
                className="inline-block"
              >
                {loading ? (
                  <div className="box">
                    <div className="card1"></div>
                    <div className="card2"></div>
                    <div className="card3"></div>
                  </div>
                ) : (
                  "Reset password"
                )}
              </Button>

              <div className="mt-4 pt-2">
                <p className="mt-0 text-center">
                  <Link to="/signin">Sign In</Link>
                  &nbsp;&nbsp;&nbsp;
                  <span
                    style={{
                      fontSize: "1.2em",
                      position: "relative",
                      top: "2px",
                    }}
                  >
                    ???
                  </span>
                  &nbsp;&nbsp;&nbsp;
                  <Link to="/signup">Sign Up</Link>
                </p>
              </div>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}

export default ForgotPassword;
