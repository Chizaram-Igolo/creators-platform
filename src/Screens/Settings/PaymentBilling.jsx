import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";
import { useAuth } from "../../contexts/AuthContext";

import "../styles/Signin.css";

function PaymentBilling() {
  const usernameRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const reAuthPasswordRef = useRef();

  const { user, updatePassword, updateProfile, reauthenticateUser } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [reAuthError, setReAuthError] = useState("");
  const [loading, setLoading] = useState(false);

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
              <h5 className="mb-3">Payment Information</h5>
              <Link
                to={`/${user.displayName}`}
                className="text-decoration-none"
              >
                Back to wall
              </Link>
            </div>

            <Form.Group>
              {/* <Form.Label>Username</Form.Label> */}

              <Form.Label className="semi-bold-text">Username</Form.Label>
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
              <Form.Label className="semi-bold-text">Password</Form.Label>
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
                className="btn-sm inline-block semi-bold-text rounded-lg"
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
                Please enter your current password to confirm this operation.
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

export default PaymentBilling;
