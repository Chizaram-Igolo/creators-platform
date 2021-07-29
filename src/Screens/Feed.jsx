import React, { Component } from "react";

import { projectFirestore } from "../firebase/config";

// import useFirestore from "../hooks/useFireStore";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

import { SideBar, PostArea, Toast, LeftSideBar } from "../Components";
import "./styles/Feed.css";

class Feed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      docs: [],
      latestDoc: null,
      hasMore: true,
      loading: true,
      error: null,
    };

    this.loadMorePosts = this.loadMorePosts.bind(this);
    this.handleChangeError = this.handleChangeError.bind(this);
  }

  // const { user } = useAuth();
  // const { docs, loading, latestDoc, error } = useFirestore("posts");

  handleChangeError(error) {
    this.setState({ error });
  }

  getPosts() {
    let set = this;

    this.unsubscribe = projectFirestore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(5)
      .onSnapshot(
        function (snap) {
          var latestDoc = snap.docs[snap.docs.length - 1];
          const docs = [];

          snap.forEach(function (doc) {
            docs.push({ ...doc.data(), id: doc.id });
          });

          set.setState({ docs, latestDoc, loading: false });

          if (docs.length === 0) {
            set.setState({ hasMore: false });
          }
        },
        (err) => {
          this.props.addToast(
            <Toast heading="We're sorry" body={err.message} />,
            {
              appearance: "error",
              autoDismiss: false,
            }
          );
        }
      );
  }

  componentDidMount() {
    this.getPosts();
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  loadMorePosts() {
    let set = this;
    let latestDoc = this.state.latestDoc;

    this.unsubscribe = projectFirestore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .startAfter(latestDoc)
      .limit(3)
      .onSnapshot(
        (snap) => {
          var latestDoc = snap.docs[snap.docs.length - 1];
          const docs = [];

          snap.forEach((doc) => {
            docs.push({ ...doc.data(), id: doc.id });
          });

          let updatedDocs = set.state.docs.concat(docs);

          set.setState({
            docs: updatedDocs,
            latestDoc,
            loading: false,
            hasMore: snap.docs.length === 0 ? false : true,
          });
        },
        (err) => {
          this.props.addToast(
            <Toast heading="We're sorry" body={err.message} />,
            {
              appearance: "error",
              autoDismiss: false,
            }
          );
        }
      );

    // console.log("here");
  }

  render() {
    const { loading, docs, hasMore, error } = this.state;
    const { loadMorePosts, handleChangeError } = this;

    return (
      <Container>
        <Row>
          <Col md={{ span: 3 }}>
            <LeftSideBar />
          </Col>

          <PostArea
            loading={loading}
            docs={docs}
            hasMore={hasMore}
            error={error}
            loadMorePosts={loadMorePosts}
            handleChangeError={handleChangeError}
          />

          <Col>
            <SideBar>
              <Nav
                defaultActiveKey="/"
                className="flex-column fixed-position d-none d-md-block"
              ></Nav>
            </SideBar>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Feed;
