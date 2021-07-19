import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import InfiniteScroll from "react-infinite-scroll-component";

import useGetPosts from "../hooks/useGetPosts";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";

import {
  Skeleton,
  Post,
  SideBar,
  NewPost,
  AlertBox,
  Toast,
} from "../Components";

import "./styles/Feed.css";

function Feed() {
  const { addToast } = useToasts();
  const [latestFeedDoc, setLatestFeedDoc] = useState(null);
  const { docs, latestDoc, hasMore, loading, error, setError } = useGetPosts(
    "posts",
    latestFeedDoc
  );

  useEffect(() => {
    if (error) {
      addToast(<Toast heading="We're sorry" body={error.message} />, {
        appearance: "error",
        autoDismiss: false,
      });
    }

    setError(null);
  }, [error, addToast]);

  function loadMorePosts() {
    console.log(hasMore);
    console.log(latestDoc);
    setLatestFeedDoc(latestDoc);
  }

  getPosts() {
    let set = this;

    projectFirestore
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

  loadMorePosts() {
    let set = this;
    let latestDoc = this.state.latestDoc;

    projectFirestore
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

  console.log("here");
  }
  useEffect(() => {
    const unsub = loadPosts;

    return () => unsub();
  }, []);

  const history = useHistory();

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
              <Link to="/" className="nav-link" role="button">
                Cardi B
              </Link>
              <Link to="/" className="nav-link" role="button">
                blueturtle899
              </Link>
              <Link to="/" className="nav-link" role="button">
                Drake
              </Link>
              <Link to="/" className="nav-link" role="button">
                Dr. DRE
              </Link>
            </Nav>
          </SideBar>
        </Col>

        <Col md={{ span: 8 }} lg={{ span: 7 }} className="px-0 pt-0 pt-md-5">
          {loading && (
            <div className="container mt-4 mb-5 pt-3" id="container">
              <Skeleton />
            </div>
          )}

          {!loading && (
            <div className="container pt-4 mb-5">
              <div className="d-flex justify-content-center row">
                <div className="col-md-12 px-2">
                  <div className="feed">
                    {error && <AlertBox error={error} top={-50} />}
                    <div className="flex-row justify-content-between align-items-center pb-2">
                      <div
                        className="feed-text px-2"
                        style={{ position: "relative" }}
                      >
                        <NewPost
                          error={error}
                          handleChangeError={handleChangeError}
                        />
                      </div>
                      <div className="feed-icon px-2">
                        <i className="fa fa-long-arrow-up text-black-50"></i>
                      </div>
                    </div>

                    <InfiniteScroll
                      dataLength={docs.length} //This is important field to render the next data
                      next={() => loadMorePosts()}
                      hasMore={hasMore}
                      loader={
                        <div className="loading pt-4">
                          <div className="circle"></div>
                          <div className="circle"></div>
                          <div className="circle"></div>
                        </div>
                      }
                      endMessage={<p style={{ textAlign: "center" }}></p>}
                      // below props only if you need pull down functionality
                      // refreshFunction={this.refresh}
                      // pullDownToRefresh
                      // pullDownToRefreshThreshold={50}
                      // pullDownToRefreshContent={
                      //   <h3 style={{ textAlign: "center" }}>
                      //     &#8595; Pull down to refresh
                      //   </h3>
                      // }
                      // releaseToRefreshContent={
                      //   <h3 style={{ textAlign: "center" }}>
                      //     &#8593; Release to refresh
                      //   </h3>
                      // }
                    >
                      {docs &&
                        docs.map((doc) => {
                          return (
                            <Post
                              key={doc.id}
                              text={doc.post ? doc.post : null}
                              createdAt={doc.createdAt}
                              comments={doc.comments ? doc.comments : null}
                              images={doc.images ? doc.images : null}
                              thumbnails={
                                doc.thumbnails ? doc.thumbnails : null
                              }
                            />
                          );
                        })}
                    </InfiniteScroll>

                    {/* <RestrictedPost /> */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Col>
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

export default Feed;
