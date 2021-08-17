import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import InputGroup from "react-bootstrap/InputGroup";
import { useAuth } from "../../contexts/AuthContext";

import "../styles/Signin.css";
import { AlertMessage } from "../../Components";

export default function Account() {
  const { user, updateProfile, deleteAccount, reauthenticateUser } = useAuth();

  const [username, setUsername] = useState(user?.displayName);
  const [reAuthPassword, setReAuthPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reAuthError, setReAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [showUsernameField, setShowUsernameField] = useState(false);

  const history = useHistory();

  const [show, setShow] = useState(false);

  function clearMessages() {
    setMessage("");
    setError("");
  }

  const handleClose = () => {
    setShow(false);
    setReAuthPassword("");
    setReAuthError("");
    setModalLoading(false);
    setLoading(false);
  };

  const handleShow = () => setShow(true);

  async function handleReauthenticateUser(e) {
    e.preventDefault();

    console.log(reAuthPassword);
    setReAuthError("");

    try {
      setModalLoading(true);
      const reauthPromise = await reauthenticateUser(
        user.email,
        reAuthPassword
      );

      handleUpdateProfile();

      console.log(reauthPromise);
      console.log("reauthenticated!");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setReAuthError(
          "This password is invalid, please enter the correct password."
        );
        setModalLoading(false);
        return;
      }
    }
  }

  function handleUpdateProfile() {
    // Validation

    const promises = [];
    setLoading(true);
    setError("");

    if (username && username !== user.displayName) {
      promises.push(updateProfile({ displayName: username }));
    }

    Promise.all(promises)
      .then(() => {
        setMessage("Your profile was updated successfully.");
        handleClose();
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  function handleSubmit(e) {
    e.preventDefault();
    handleShow(true);
  }

  async function handleDeleteAccount() {
    handleShow(true);
    await deleteAccount();
    history.push("/");
  }

  return (
    <>
      <div className="pt-4 px-2 mb-5">
        <Form className="vertical-center" onSubmit={handleSubmit}>
          {error && (
            <AlertMessage
              message={error}
              severity="error"
              isOpen={error.length > 0}
              clearMessages={clearMessages}
            />
          )}

          {message && (
            <AlertMessage
              message={message}
              severity="success"
              isOpen={message.length > 0}
              clearMessages={clearMessages}
            />
          )}

          <div className="pt-2 mb-5">
            <div className="d-flex flex-row justify-content-between pb-1 mb-4 border-bottom">
              <h5 className="mb-3">Change your account information</h5>
              <Link to="/profile" className="text-decoration-none">
                Back to profile
              </Link>
            </div>
            <Form.Group controlId="formChannelName">
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

            <Form.Group className="mt-4">
              <p>
                For security reasons, you may only change your username once
                every 6 months. Last change was 2 weeks ago.
              </p>
              <Button
                disabled={false}
                variant="primary"
                type="button"
                className="btn-sm inline-block bold-text rounded-lg"
                style={{ letterSpacing: "0.82px" }}
                onClick={() => setShowUsernameField(true)}
              >
                Change Username
              </Button>
            </Form.Group>

            {showUsernameField && (
              <Form.Group>
                <Form.Label className="bold-text">Username</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="btnGroupAddon">@</InputGroup.Text>

                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    defaultValue={user?.displayName}
                    onChange={(e) => setUsername(e.target.value)}
                    // isInvalid={confirmPassError.length > 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please choose a username.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            )}

            <div className="d-flex flex-row justify-content-end">
              <Button
                disabled={loading || username === user.displayName}
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
        </Form>

        <Form className="vertical-center" onSubmit={handleSubmit}>
          <div>
            <div className="d-flex flex-row justify-content-between pb-1 mb-4 border-bottom">
              <h5 className="mb-3 text-danger">Delete Your Account</h5>
            </div>
            <p>
              Deleting your account means all your profile and content will be
              erased permanently. Only proceed if you are sure.
            </p>

            <div className="d-flex flex-row justify-content-end">
              <Button
                variant="outline-danger"
                type="button"
                onClick={() => handleDeleteAccount()}
                className="rounded-lg"
              >
                Delete your Account
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
            <Modal.Title>Enter password to confirm</Modal.Title>
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
                    value={reAuthPassword}
                    placeholder="Your current password"
                    onChange={(e) => setReAuthPassword(e.target.value)}
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
              <Button
                disabled={modalLoading || reAuthPassword === ""}
                variant="primary"
                type="submit"
                className="btn-sm inline-block bold-text rounded-lg"
                style={{ letterSpacing: "0.82px" }}
              >
                {modalLoading ? (
                  <div className="box">
                    <div className="card1"></div>
                    <div className="card2"></div>
                    <div className="card3"></div>
                  </div>
                ) : (
                  "Confirm"
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </>
  );
}
