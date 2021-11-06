import React, { useState, useRef } from "react";
import { Link, useHistory } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";

import { AlertMessage } from "../Components";

import { useAuth } from "../contexts/AuthContext";

import "./styles/Signin.css";
import {
  dbTimestamp,
  projectDatabase,
  projectFirestore,
} from "../firebase/config";

function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const [username, setUsername] = useState("");
  const { signup } = useAuth();
  const [error, setError] = useState(null);
  const [confirmPassError, setConfirmPassError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // useEffect(() => {
  //   user.reauthenticateWithCredential()
  // }, []);

  function clearMessages() {
    // setError("");
  }

  // useEffect(() => {
  //   async function checkIfUsernameAvailable() {
  //     const snapshot = await projectFirestore
  //       .collection("users")
  //       .where("username", "==", username)
  //       .get();

  //     if (snapshot.empty) {
  //       console.log(username, "is available");
  //     } else {
  //       console.log(username, "is not available");
  //     }
  //   }

  //   if (username.length > 3) {
  //     const timeout = setTimeout(() => {
  //       checkIfUsernameAvailable();
  //     }, 2000);
  //     return () => {
  //       clearTimeout(timeout);
  //     };
  //   }
  // }, [username]);

  // function genRanHex(size) {
  //   return [...Array(size)]
  //     .map(() => Math.floor(Math.random() * 16).toString(16))
  //     .join("");
  // }

  const avatarColours = [
    "#FF0000",
    "#FF2400",
    "#FF4500",
    "#F62217",
    "#F70D1A",
    "#F62817",
    "#E42217",
    "#E41B17",
    "#DC381F",
    "#C24641",
    "#C11B17",
    "#B22222",
    "#A52A2A",
    "#A70D2A",
    "#9F000F",
    "#990012",
    "#8B0000",
    "#800000",
    "#8C001A",
    "#800517",
    "#614051",
    "#583759",
    "#5E5A80",
    "#4E5180",
    "#6A5ACD",
    "#6960EC",
    "#736AFF",
    "#7B68EE",
    "#6C2DC7",
    "#483D8B",
    "#4E387E",
    "#571B7E",
    "orange",
  ];

  function chooseAvatarColour() {
    var index = Math.floor(Math.random() * avatarColours.length);
    return avatarColours[index];
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Validation
    if (passwordRef.current.value !== confirmPasswordRef.current.value) {
      return setConfirmPassError("Passwords do not match.");
    }

    try {
      setError(null);
      setLoading(true);

      const snapshot = await projectFirestore
        .collection("users")
        .where("username", "==", username)
        .get();

      if (snapshot.empty) {
        const userCredential = await signup(
          emailRef.current.value,
          passwordRef.current.value
        );

        const { user } = userCredential;

        // await userCredential.user.sendEmailVerification();
        await userCredential.user.updateProfile({
          displayName: username,
          photoURL: "/profile/user.jpg",
          // photoURL:
          //   `https://ui-avatars.com/api/?background=${genRanHex(6)}&name=` +
          //   emailRef.current.value[0],
        });

        await projectDatabase.ref("users/" + user.uid).set({
          email: user.email,
          username: user.displayName,
          photoURL: user.photoURL,
          showOnlineStatus: true,
          showSubscriberCount: true,
          makeAccountDiscoverable: true,
          showMediaCount: true,
          showLastSeenDate: true,
          creationDate: dbTimestamp,
          avatarColour: chooseAvatarColour(),
          channelName: "",
          bio: "",
        });

        history.push("/profile");
      } else {
        setError(`Username '${username}' is already taken.`);
      }
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
              <h3 className="mb-5 text-center">Sign Up</h3>

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
                {/* <Form.Label>Email address</Form.Label> */}
                <Form.Control
                  type="email"
                  placeholder="Email Address"
                  ref={emailRef}
                  required
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
                    // ref={usernameRef}
                    isInvalid={confirmPassError.length > 0}
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value.toLocaleLowerCase())
                    }
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
                    required
                    isInvalid={confirmPassError.length > 0}
                    ref={passwordRef}
                    placeholder="Password"
                  />
                  <Form.Text id="passwordHelpBlock" muted>
                    Must be at least 8 characters including letters, numbers,
                    and 1 special character (e.g *$&#@)
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
                    required
                    isInvalid={confirmPassError.length > 0}
                    ref={confirmPasswordRef}
                    placeholder="Confirm Password"
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
                  "Sign up"
                )}
              </Button>

              <p className="mt-3 text-center">
                Already have an account?{" "}
                <Link to="/signin" className="text-decoration-none">
                  Sign In
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

export default Signup;
