import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";
import { useAuth } from "../../contexts/AuthContext";

import "../styles/Signin.css";

function Profile() {
  const emailRef = useRef();
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const reAuthPasswordRef = useRef();

  const {
    user,
    updateEmail,
    updatePassword,
    updateProfile,
    deleteAccount,
    reauthenticateUser,
  } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [reAuthError, setReAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
    setReAuthError("");
  };
  const handleShow = () => setShow(true);

  async function handleReauthenticateUser(e) {
    e.preventDefault();

    console.log(reAuthPasswordRef.current.value);

    try {
      const reauthPromise = await reauthenticateUser(
        user.email,
        reAuthPasswordRef.current.value
      );

      handleUpdateProfile();

      console.log(reauthPromise);
      console.log("reauthenticated!");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setReAuthError(
          "This password is invalid, please enter the correct password."
        );
        return;
      }
    }
  }

  function handleUpdateProfile() {
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

    if (
      usernameRef.current.value &&
      usernameRef.current.value !== user.displayName
    ) {
      promises.push(updateProfile({ displayName: usernameRef.current.value }));
    }

    Promise.all(promises)
      .then(() => {
        setMessage("Your profile was updated successfully.");
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  function handleSubmit(e) {
    e.preventDefault();

    handleShow(true);
  }

  async function handleDeleteAccount() {
    await deleteAccount();
    history.push("/");
  }

  return (
    <>
      {/* <Container className="px-0">
        <Row>
          <Col md={{ span: 3 }} className="d-none d-md-block">
            <SideBar>
              <div className="pt-2 pt-md-3">
                <Nav defaultActiveKey="/" className="clearfix flex flex-column">
                  <p className="mt-0">Profile</p>

                  <ul>
                    {subroutes.map((item) => (
                      <li key={item.route}>
                        <Link
                          to={item.route}
                          className="nav-link text-decoration-none"
                          role="button"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Nav>
              </div>
            </SideBar>
          </Col> */}

      <div className="pt-4 px-2 mb-5">
        <Form className="vertical-center" onSubmit={handleSubmit}>
          {/* <h3 className="mb-5 text-center">Profile</h3> */}

          {false && (
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
                <Form.Text className="text-success">{message}</Form.Text>
              </Alert>
            </>
          )}

          <div className="pt-2 mb-5">
            <div className="d-flex flex-row justify-content-between pb-1 mb-4 border-bottom">
              <h5 className="mb-3">Basic Information</h5>
              <Link to="/profile">Go back to your profile</Link>
            </div>
            <Form.Group controlId="formBasicEmail">
              <Form.Label className="bold-text">Channel Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Public Facing Name"
                // ref={emailRef}
                // required
                // defaultValue={user?.email}
              />
              <Form.Text className="text-muted">
                Your name may appear around GitHub where you contribute or are
                mentioned. You can remove it at any time.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label className="bold-text">Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email Address"
                ref={emailRef}
                required
                defaultValue={user?.email}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label className="bold-text">Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Leave a short description about yourself or your channel"
              />
            </Form.Group>

            <Form.Group>
              {/* <Form.Label>Username</Form.Label> */}

              <Form.Label className="bold-text">Social Media Links</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text id="btnGroupAddon">https://</InputGroup.Text>

                <Form.Control
                  type="text"
                  placeholder="Username"
                  ref={usernameRef}
                  // isInvalid={confirmPassError.length > 0}
                />
                <Form.Control.Feedback type="invalid">
                  Please choose a username.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group>
              <InputGroup hasValidation>
                <InputGroup.Text id="btnGroupAddon">https://</InputGroup.Text>

                <Form.Control
                  type="text"
                  placeholder="Username"
                  ref={usernameRef}
                  // isInvalid={confirmPassError.length > 0}
                />
                <Form.Control.Feedback type="invalid">
                  Please choose a username.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div className="d-flex flex-row justify-content-end">
              <Button
                disabled={loading}
                variant="primary"
                type="submit"
                className="btn-sm inline-block bold-text rounded-lg"
                style={{ letterSpacing: "0.82px" }}
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
            </div>
          </div>

          {/* <Button
                  variant="danger"
                  type="button"
                  block={true.toString()}
                  onClick={() => handleDeleteAccount()}
                >
                  Delete your Account
                </Button> */}
        </Form>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Enter your current password</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleReauthenticateUser}>
            <Modal.Body>
              <p>
                Please enter your current password to complete the operation.
              </p>
              <Form.Group controlId="formBasicReAuthPassword">
                {/* <Form.Label>Password</Form.Label> */}
                <InputGroup hasValidation>
                  <Form.Control
                    type="password"
                    isInvalid={reAuthError.length > 0}
                    ref={reAuthPasswordRef}
                    placeholder="Your current password"
                  />
                  <Form.Text id="passwordHelpBlock" muted></Form.Text>
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ fontSize: "0.86em" }}
                  >
                    {reAuthError}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Confirm
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </>
  );
}

export default Profile;
