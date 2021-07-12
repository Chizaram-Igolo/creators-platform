import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

// import FirebaseAuth from "../firebaseAuth";
import { useAuth } from "../contexts/AuthContext";

import "./Signin.css";

function Signin(props) {
  const { user, loading, logout } = useAuth();
  const [signedIn, setSignedIn] = useState(false);

  const handleClick = () => setSignedIn(true);

  if (signedIn) {
    return (
      <Redirect
        to={{
          pathname: "/feed",
          state: { from: props.location },
        }}
      />
    );
  } else {
    return (
      // <FirebaseAuth />
      <>
        <Container>
          <Row>
            <Col></Col>
            <Col md={6} lg={5}>
              <Form className="vertical-center">
                <Form.Group controlId="formBasicEmail">
                  {/* <Alert variant="info" className="mb-4">
                    You need to sign in to continue.
                  </Alert> */}
                  <Form.Label>Email address</Form.Label>
                  <Form.Control type="email" placeholder="Enter email" />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" placeholder="Password" />
                </Form.Group>
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" label="Remember me" />
                </Form.Group>
                <Button
                  variant="primary"
                  type="submit"
                  block={true.toString()}
                  onClick={handleClick}
                >
                  Sign in
                </Button>

                <p className="mt-3 text-center">
                  Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
              </Form>
            </Col>
            <Col></Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Signin;
