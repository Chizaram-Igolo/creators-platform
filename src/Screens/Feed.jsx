import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import useFirestore from "../hooks/useFireStore";
// import { useAuth } from "../contexts/AuthContext";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

import {
  Skeleton,
  Post,
  SideBar,
  RestrictedPost,
  NewPost,
} from "../Components";

import "./Feed.css";

function Feed(props) {
  // const { user } = useAuth();
  const { docs } = useFirestore("posts");

  docs.map((doc) => console.log(doc.post));

  const [loading, setLoading] = useState(true);
  const history = useHistory();

  useEffect(() => {
    const loadInterval = setInterval(() => {
      setLoading(false);
    }, 1000);

    return () => clearInterval(loadInterval);
  }, []);

  return (
    <Container>
      <Row>
        <Col md={{ span: 3 }}>
          <SideBar>
            <Nav
              defaultActiveKey="/"
              className="flex-column fixed-position d-none d-md-block"
            >
              <p>Your Subscriptions</p>
              <Nav.Link onClick={() => history.push("/")}>Cardi B</Nav.Link>
              <Nav.Link onClick={() => history.push("/")}>
                blueturtle899
              </Nav.Link>
              <Nav.Link onClick={() => history.push("/")}>Drake</Nav.Link>
              <Nav.Link onClick={() => history.push("/")}>Dr. DRE</Nav.Link>
            </Nav>
          </SideBar>
        </Col>

        <Col md={{ span: 8 }} lg={{ span: 7 }} className="px-0 pt-0 pt-md-5">
          {loading && (
            <div className="container mt-4 mb-5 pt-3">
              <Skeleton />
            </div>
          )}

          {!loading && (
            <div className="container pt-4 mb-5">
              <div className="d-flex justify-content-center row">
                <div className="col-md-12 px-2">
                  <div className="feed">
                    <div className="flex-row justify-content-between align-items-center pb-2">
                      <div className="feed-text px-2">
                        <NewPost />
                      </div>
                      <div className="feed-icon px-2">
                        <i className="fa fa-long-arrow-up text-black-50"></i>
                      </div>
                    </div>

                    {docs &&
                      docs.map((doc) => {
                        return (
                          <Post
                            text={doc.post}
                            // hasImages={true}
                            key={doc.id}
                            hasComments={false}
                            comments
                          />
                        );
                      })}

                    <RestrictedPost />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Col>
        <Col></Col>
      </Row>
    </Container>
  );
}

export default Feed;
