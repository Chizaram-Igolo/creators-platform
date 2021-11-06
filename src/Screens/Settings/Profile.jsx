import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import InputGroup from "react-bootstrap/InputGroup";
import { useAuth } from "../../contexts/AuthContext";

import "../styles/Signin.css";
import { AlertMessage } from "../../Components";
import { projectDatabase } from "../../firebase/config";

export default function Profile() {
  const { user, userProfile, updateEmail } = useAuth();

  const [channelName, setChannelName] = useState(userProfile?.channelName);
  const [bio, setBio] = useState(userProfile?.bio);

  const emailRef = useRef();
  const usernameRef = useRef();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function clearMessages() {
    setMessage("");
    setError("");
  }

  function handleUpdateProfile(e) {
    e.preventDefault();

    const promises = [];
    setLoading(true);
    setError("");

    const profObj = {};

    if (emailRef.current.value !== user.email) {
      promises.push(updateEmail(emailRef.current.value));
    }

    if (channelName !== userProfile.channelName) {
      profObj["channelName"] = channelName;
    }

    if (bio !== userProfile.bio) {
      profObj["bio"] = bio;
    }

    if (channelName !== userProfile.channelName || bio !== userProfile.bio) {
      promises.push(projectDatabase.ref(`users/${user.uid}`).update(profObj));
    }

    Promise.all(promises)
      .then(() => {
        setMessage("Your profile was updated successfully.");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }

  return (
    <>
      <div className="pt-4 px-2 mb-5">
        <Form className="vertical-center" onSubmit={handleUpdateProfile}>
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
              <h5 className="mb-3">Basic Information</h5>
              <Link
                to={`/${user.displayName}`}
                className="text-decoration-none"
              >
                Back to wall
              </Link>
            </div>
            <Form.Group controlId="formChannelName">
              <Form.Label className="semi-bold-text">Channel Name</Form.Label>
              <Form.Control
                type="name"
                placeholder="Public Facing Name"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
              <Form.Text className="text-muted">
                Your name will appear as a watermark on media content you post.
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label className="semi-bold-text">Email address</Form.Label>
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
                maxLength={280}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Form.Group>

            <Form.Group>
              {/* <Form.Label>Username</Form.Label> */}

              <Form.Label className="semi-bold-text">
                Social Media Links
              </Form.Label>
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
                disabled={
                  loading ||
                  (channelName === userProfile?.channelName &&
                    bio === userProfile?.bio)
                }
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
      </div>
    </>
  );
}
