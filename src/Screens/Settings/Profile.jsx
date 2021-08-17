import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import InputGroup from "react-bootstrap/InputGroup";
import { useAuth } from "../../contexts/AuthContext";

import "../styles/Signin.css";
import { AlertMessage } from "../../Components";

export default function Profile() {
  const emailRef = useRef();
  const usernameRef = useRef();
  const [reAuthPassword, setReAuthPassword] = useState("");

  const { user, updateEmail, reauthenticateUser } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reAuthError, setReAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [show, setShow] = useState(false);

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
    const promises = [];
    setLoading(true);
    setError("");

    if (emailRef.current.value !== user.email) {
      promises.push(updateEmail(emailRef.current.value));
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

  return (
    <>
      <div className="pt-4 px-2 mb-5">
        <Form className="vertical-center" onSubmit={handleSubmit}>
          {error && (
            <AlertMessage message={error} severity="error" open={true} />
          )}

          {message && (
            <AlertMessage message={message} severity="success" open={true} />
          )}

          <div className="pt-2 mb-5">
            <div className="d-flex flex-row justify-content-between pb-1 mb-4 border-bottom">
              <h5 className="mb-3">Basic Information</h5>
              <Link to="/profile" className="text-decoration-none">
                Back to profile
              </Link>
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
                Your name will appear as a watermark on media content you post.
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
