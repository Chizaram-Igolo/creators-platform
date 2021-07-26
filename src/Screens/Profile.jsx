import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";

import { SideBar, Tab, AlertBox } from "../Components";

import "./styles/Profile.css";

function Profile() {
  // const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  const types = ["image/png", "image/jpeg"];

  const handleChange = (e) => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      // setFile(selected);
      setError("");
    } else {
      // setFile(null);
      setError("Please select an image file (png or jpg)");
    }
  };

  return (
    <>
      <Container>
        <Row>
          <Col md={{ span: 3 }}>
            <SideBar>
              <Form className="img-form pb-0">
                <div className="img-grid">
                  <div className="img-wrap border-50">
                    <img src={user.photoURL} alt="" className="profile-img" />
                  </div>
                  <label>
                    <input type="file" onChange={handleChange} />
                    <span style={{ fontSize: "16px" }}>
                      <FontAwesomeIcon icon={faUpload} color="white" />
                    </span>
                  </label>
                </div>
              </Form>
              <div className="pt-4">
                <p>{user.email}</p>

                <Link to="/settings">Settings</Link>
              </div>
            </SideBar>
          </Col>

          <Col md={{ span: 7 }} className="px-0 pt-5">
            <div className="container pt-4 mb-5">
              <div className="d-flex justify-content-center row">
                <div className="col-md-12 px-2">
                  <div className="feed">
                    <AlertBox error={error} />
                    <div className="bg-white p-2 pt-0 pl-0 pr-1 pb-3  mb-3 no-hor-padding">
                      <Tab />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}

export default Profile;
