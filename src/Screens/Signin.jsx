import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";

import { ErrorDisplay } from "../Components";

import { useAuth } from "../contexts/AuthContext";

import "./Signin.css";

function Signin(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signin } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError(null);
      setLoading(true);
      await signin(emailRef.current.value, passwordRef.current.value);
      history.push("/feed");
    } catch (err) {
      setError(err.message);
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
              <h3 className="mb-5 text-center">Welcome back</h3>

              <ErrorDisplay error={error} />

              <p>Start earning with other creators today!</p>
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

              <Form.Group controlId="formBasicPassword">
                {/* <Form.Label>Password</Form.Label> */}
                <InputGroup hasValidation>
                  <Form.Control
                    type="password"
                    required
                    // isInvalid={error.length > 0}
                    ref={passwordRef}
                    placeholder="Password"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a password.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  className="pointer-on-hover"
                  type="checkbox"
                  label="Remember me"
                  custom
                />
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
                  "Sign in"
                )}
              </Button>

              <p className="mt-3 text-center">
                <Link to="/forgot-password" className="text-decoration-none">
                  Forgot password?
                </Link>
              </p>

              <p className="mt-3 text-center">
                Don't have an account?{" "}
                <Link to="/signup" className="text-decoration-none">
                  Sign Up
                </Link>
              </p>
            </Form>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}

export default Signin;
