import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";

import img1 from "../assets/img1.jpeg";

import "./NavBar.css";

import { globalVars } from "../../src/global_vars";

function NavBar() {
  const [error, setError] = useState("");
  const { user, signout } = useAuth();
  const history = useHistory();

  async function handleSignout() {
    setError("");

    try {
      await signout();
      history.push("./signin");
    } catch {
      setError("failed to log out");
    }
  }

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="light"
        variant="light"
        className="fixed-position w-100 z-300 px-4 pr-5"
      >
        <Navbar.Brand
          className="pointer-on-hover brand"
          onClick={() => history.push("/feed")}
        >
          {globalVars.name}
        </Navbar.Brand>

        <Form>
          <FormControl
            type="text"
            placeholder="Search or jump to..."
            className="mr-sm-2 ml-2"
            style={{ width: 280, height: 30, fontSize: "0.92em" }}
          />
          {/* <Button variant="outline-success">Search</Button> */}
        </Form>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        {user && (
          <Navbar.Collapse id="responsive-navbar-nav float-right">
            <Nav className="mr-auto float-right"></Nav>
            <Nav className="float-right">
              <NavDropdown
                title={<img src={img1} alt="Avatar" className="avatar" />}
                id="collasible-nav-dropdown"
              >
                <NavDropdown.Item onClick={() => history.push("/profile")}>
                  <p className="color-text-secondary mb-0">
                    <relative-time
                      datetime="2021-07-07T18:25:09Z"
                      className="no-wrap"
                    >
                      Signed in as
                    </relative-time>{" "}
                    <br />
                    <strong>Chizaram-Igolo</strong>
                    {/* <span class="d-block ">Never used</span> */}
                  </p>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => history.push("/profile")}>
                  Your profile
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push("/feed")}>
                  Your feed
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push("/profile")}>
                  Your subscriptions
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push("/profile")}>
                  Your posts
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push("/profile")}>
                  Your comments
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => history.push("/settings")}>
                  Help
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => history.push("/settings")}>
                  Settings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleSignout}>
                  Sign out
                </NavDropdown.Item>
              </NavDropdown>
              {/* <Nav.Link onClick={() => history.push("/signin")}>Sign In</Nav.Link> */}
            </Nav>
          </Navbar.Collapse>
        )}
      </Navbar>

      {error && (
        <Alert
          variant="light"
          className="form-alert text-danger border border-danger auto-height"
        >
          <small className="text-danger">{error}</small>
        </Alert>
      )}
    </>
  );
}

export default NavBar;
