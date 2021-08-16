import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";
import { useAuth } from "../../contexts/AuthContext";

import "../styles/Signin.css";

function Account() {
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
              <h5 className="mb-3">Account</h5>
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

            <Form.Group>
              {/* <Form.Label>Username</Form.Label> */}

              <Form.Label className="bold-text">Username</Form.Label>
              <InputGroup hasValidation>
                <InputGroup.Text id="btnGroupAddon">@</InputGroup.Text>

                <Form.Control
                  type="text"
                  placeholder="Username"
                  ref={usernameRef}
                  defaultValue={user?.displayName}
                  // isInvalid={confirmPassError.length > 0}
                />
                <Form.Control.Feedback type="invalid">
                  Please choose a username.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className="bold-text">Password</Form.Label>
              {/* <InputGroup hasValidation> */}
              <Form.Control
                type="password"
                isInvalid={confirmPassError.length > 0}
                ref={passwordRef}
                placeholder="Leave blank to keep the same"
              />
              <Form.Text id="passwordHelpBlock" muted>
                Must be at least 8 characters including letters, numbers, and 1
                special character (e.g *$&#@)
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                Please enter a password.
              </Form.Control.Feedback>
              {/* </InputGroup> */}
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

            <div className="d-flex flex-row justify-content-end">
              <Button
                disabled={loading}
                variant="primary"
                type="submit"
                className="btn-sm inline-block bold-text"
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
          <h6 className="mb-3">Danger</h6>
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
                ref={usernameRef}
                value={user?.displayName}
                // isInvalid={confirmPassError.length > 0}
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
            // block={true.toString()}
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

          <Button
            variant="danger"
            type="button"
            onClick={() => handleDeleteAccount()}
          >
            Delete your Account
          </Button>
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

export default Account;
