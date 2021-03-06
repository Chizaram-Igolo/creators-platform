import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { Formik } from "formik";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";

import { AlertMessage } from "../Components";
import { useAuth } from "../contexts/AuthContext";

import "./styles/Signin.css";

function Signin(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { signin } = useAuth();
  const [error, setError] = useState("");
  const history = useHistory();

  function clearMessages() {}

  async function handleSubmit(values) {
    try {
      setError(null);
      await signin(values.email, values.password);
      history.push("/feed");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <Container>
        <Row>
          <Col></Col>
          <Col xs={10} md={8} lg={6} xl={5} className="px-md-3">
            <Formik
              initialValues={{ email: "", password: "" }}
              validate={(values) => {
                const errors = {};
                if (!values.email) {
                  errors.email = "Please enter your username";
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = "Invalid email address";
                }

                if (!values.password) {
                  errors.password = "Please enter your password";
                }

                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                handleSubmit(values).then(() => setSubmitting(false));
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <Form className="vertical-center" onSubmit={handleSubmit}>
                  <h3 className="mb-5 text-center">Welcome back</h3>

                  {error && (
                    <AlertMessage
                      message={error}
                      severity="error"
                      isOpen={error.length > 0}
                      clearMessages={clearMessages}
                      keepOpen={true}
                    />
                  )}

                  <p>Start earning with other creators today!</p>

                  <Form.Group controlId="formBasicEmail">
                    <InputGroup hasValidation>
                      <Form.Control
                        type="email"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        isInvalid={errors.email && touched.email}
                        ref={emailRef}
                        placeholder="Email Address"
                        value={values.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <InputGroup hasValidation>
                      <Form.Control
                        type="password"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                        isInvalid={errors.password && touched.password}
                        ref={passwordRef}
                        placeholder="Password"
                        value={values.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check
                      className="clickable"
                      type="checkbox"
                      label="Remember me"
                      custom
                    />
                  </Form.Group>

                  <Button
                    disabled={isSubmitting}
                    variant="primary"
                    type="submit"
                    block={true.toString()}
                    className="inline-block"
                  >
                    {isSubmitting ? (
                      <div className="box">
                        <div className="card1"></div>
                        <div className="card2"></div>
                        <div className="card3"></div>
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  <div className="mt-4 pt-2">
                    <p className="mt-0 text-center">
                      <Link to="/forgot-password">Forgot password?</Link>
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
              )}
            </Formik>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}

export default Signin;
