import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Alert from "react-bootstrap/Alert";
import InputGroup from "react-bootstrap/InputGroup";
import { useAuth } from "../../contexts/AuthContext";

import "../styles/Signin.css";

export default function Security() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const reAuthPasswordRef = useRef();

  const { user, updatePassword, updateProfile, reauthenticateUser } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");
  const [reAuthError, setReAuthError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReauthenticateUser() {
    console.log(oldPassword);

    try {
      const reauthPromise = await reauthenticateUser(user.email, oldPassword);

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
    if (password !== confirmPassword) {
      return setConfirmPassError("Passwords do not match.");
    }

    const promises = [];
    setLoading(true);
    setError("");

    if (password) {
      promises.push(updatePassword(password));
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
    handleReauthenticateUser();
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
              <h5 className="mb-3">Change Password</h5>
              <Link to="/profile">Go back to your profile</Link>
            </div>

            <Form.Group controlId="formBasicOldPassword">
              <Form.Label className="bold-text">Old password</Form.Label>
              {/* <InputGroup hasValidation> */}
              <Form.Control
                type="password"
                isInvalid={confirmPassError.length > 0}
                value={oldPassword}
                placeholder=""
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please enter a password.
              </Form.Control.Feedback>
              {/* </InputGroup> */}
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label className="bold-text">New password</Form.Label>
              {/* <InputGroup hasValidation> */}
              <Form.Control
                type="password"
                isInvalid={confirmPassError.length > 0}
                value={password}
                placeholder=""
                onChange={(e) => setPassword(e.target.value)}
              />
              <Form.Text id="passwordHelpBlock" className="text-muted">
                Must be at least 8 characters including letters, numbers, and 1
                special character (e.g *$&#@)
              </Form.Text>
              <Form.Control.Feedback type="invalid">
                Please enter a password.
              </Form.Control.Feedback>
              {/* </InputGroup> */}
            </Form.Group>

            <Form.Group controlId="formBasicConfirmPassword">
              {/* <Form.Label>Confirm Password</Form.Label> */}
              <Form.Label className="bold-text">
                Confirm new password
              </Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="password"
                  isInvalid={confirmPassError.length > 0}
                  value={confirmPassword}
                  placeholder=""
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Passwords do not match.
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <div className="d-flex flex-row justify-content-end mt-3">
              <Button
                disabled={
                  loading ||
                  oldPassword === "" ||
                  password === "" ||
                  confirmPassword === ""
                }
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
                  "Update password"
                )}
              </Button>
            </div>
          </div>
        </Form>
        <div className="d-flex flex-row justify-content-between pb-1 mb-4 border-bottom">
          <h5 className="mb-3">Two-factor Authentication</h5>
        </div>
        <h6 className="text-center">
          Two factor authentication is not enabled yet.
        </h6>

        <p className="text-center mt-4">
          Two-factor authentication adds an additional layer of security to your
          account by requiring more than just a password to sign in.
        </p>

        <p className="text-center mt-4">
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
              "Enable two-factor authenticaton"
            )}
          </Button>
        </p>

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
        </Form>
      </div>
    </>
  );
}
