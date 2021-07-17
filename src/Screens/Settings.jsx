import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";
import { useAuth } from "../contexts/AuthContext";

import { SideBar } from "../Components";

import "./styles/Signin.css";

function Settings() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const { user, updateEmail, updatePassword } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();

    // Validation
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setConfirmPassError("Passwords do not match.");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (emailRef.current.value !== user.email) {
      promises.push(updateEmail(emailRef.current.value));
    }

    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        setMessage("Your profile was updated successfully.");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  return (
    <>
      <Container>
        <Row>
          <Col md={{ span: 3 }}>
            <SideBar>
              <Form className="img-form pb-0">
                <div className="img-grid">
                  <div className="img-wrap border-50">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS52y5aInsxSm31CvHOFHWujqUx_wWTS9iM6s7BAm21oEN_RiGoog"
                      alt=""
                      className="profile-img"
                    />
                  </div>
                  <label>
                    {/* <input type="file" onChange={handleChange} /> */}
                    <span>
                      {/* <Upload size={18} strokeWidth={2} color={"white"} /> */}
                    </span>
                  </label>
                </div>
              </Form>
              <div className="pt-4">
                <p>mister@yahoo.com</p>
              </div>
            </SideBar>
          </Col>

          <Col md={{ span: 7 }} className="px-0 pt-5">
            <div className="container pt-4 mb-5">
              <div className="d-flex justify-content-center row">
                <div className="col-md-12 px-2">
                  <div className="feed">
                    <div className="bg-white p-2 pt-0 pl-0 pr-1 pb-3  mb-3 no-hor-padding"></div>

                    {/* <Post images={true} />
                    <RestrictedPost />
                    <Post comments={true} /> */}

                    <Form className="vertical-center" onSubmit={handleSubmit}>
                      <h3 className="mb-5 text-center">Profile</h3>

                      {error && (
                        <Alert
                          variant="light"
                          className="form-alert text-danger border border-danger"
                        >
                          <Form.Text className="text-danger">{error}</Form.Text>
                        </Alert>
                      )}

                      {message && (
                        <>
                          <Alert
                            variant="light"
                            className="form-alert text-success border border-success"
                          >
                            <Form.Text className="text-success">
                              {message}
                            </Form.Text>
                          </Alert>
                        </>
                      )}
                      <p>Start earning with other creators today!</p>
                      <Form.Group controlId="formBasicEmail">
                        {/* <Form.Label>Email address</Form.Label> */}
                        <Form.Control
                          type="email"
                          placeholder="Email Address"
                          ref={emailRef}
                          required
                          defaultValue={user.email}
                        />
                        <Form.Text className="text-muted">
                          We'll never share your email with anyone else.
                        </Form.Text>
                      </Form.Group>

                      <Form.Group>
                        {/* <Form.Label>Username</Form.Label> */}
                        <InputGroup hasValidation>
                          <Form.Control
                            type="text"
                            placeholder="Username"
                            required
                            isInvalid={confirmPassError.length > 0}
                          />
                          <Form.Control.Feedback type="invalid">
                            Please choose a username.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      <Form.Group controlId="formBasicPassword">
                        {/* <Form.Label>Password</Form.Label> */}
                        <InputGroup hasValidation>
                          <Form.Control
                            type="password"
                            isInvalid={confirmPassError.length > 0}
                            ref={passwordRef}
                            placeholder="Leave blank to keep the same"
                          />
                          <Form.Text id="passwordHelpBlock" muted>
                            Your password must be 8-20 characters long, contain
                            letters and numbers, and must not contain spaces,
                            special characters, or emoji.
                          </Form.Text>
                          <Form.Control.Feedback type="invalid">
                            Please enter a password.
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>

                      <Form.Group controlId="formConfirmBasicPassword">
                        {/* <Form.Label>Confirm Password</Form.Label> */}
                        <InputGroup hasValidation>
                          <Form.Control
                            type="password"
                            isInvalid={confirmPassError.length > 0}
                            ref={confirmPasswordRef}
                            placeholder="Leave blank to keep the same"
                          />
                          <Form.Control.Feedback type="invalid">
                            Passwords do not match.
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
                          "Update profile"
                        )}
                      </Button>

                      <p className="mt-3 text-center">
                        <Link to="/profile">Go back to your profile</Link>
                      </p>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col></Col>
          <Col xs={10} md={8} lg={6} xl={5}>
            {/* {error && (
              <Alert variant="danger" className="form-alert">
                {error}
              </Alert>
            )} */}
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}

export default Settings;
