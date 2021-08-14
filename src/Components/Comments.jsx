import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faReply } from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import Button from "react-bootstrap/Button";

import { projectFirestore } from "../firebase/config";

export default class Comments extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showComments: false,
      docs: [],
      latestDoc: null,
      hasLoadedOnce: false,
      hasMore: true,
      loading: true,
      error: null,
    };

    this.getComments = this.getComments.bind(this);
    this.getMoreComments = this.getMoreComments.bind(this);
    this.handleShowHideComments = this.handleShowHideComments.bind(this);
    this.handleChangeError = this.handleChangeError.bind(this);
  }

  handleChangeError(error) {
    this.setState({ error });
  }

  handleShowHideComments() {
    let { showComments } = this.state.showComments;

    this.setState({ showComments: !showComments });
    this.getComments();
  }

  getComments() {
    let set = this;
    const { postId } = this.props;

    this.unsubscribe = projectFirestore
      .collection("posts")
      .doc(postId)
      .collection("comments")
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
          // Send email with error to developer
          console.log(err);
        }
      );
  }

  componentWillUnmount() {
    if (this.unsubscribe !== null && this.unsubscribe instanceof Function) {
      this.unsubscribe();
    }
  }

  getMoreComments() {
    let set = this;
    let latestDoc = this.state.latestDoc;
    const { postId } = this.props;

    this.unsubscribe = projectFirestore
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy("createdAt", "asc")
      .startAfter(latestDoc)
      .limit(5)
      .onSnapshot(
        function (querySnapshot) {
          var latestDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
          const docs = [];

          querySnapshot.forEach(function (doc) {
            docs.push({ ...doc.data(), id: doc.id });
          });

          set.setState({ docs, latestDoc, loading: false });

          if (docs.length === 0) {
            set.setState({ hasMore: false });
          }

          console.log(docs);
        },
        (err) => {
          // Send email with error to developer
          console.log(err);
        }
      );
  }

  // handleAddReply = async (e) => {
  //   e.preventDefault();
  //   let replyClean = reply.trim();

  //   let replyObj = {
  //     text: replyClean,
  //     replyId: user.uid,
  //     replierPhoto: user.photoURL,
  //     replierUsername: user.displayName,
  //   };

  //   setReply("");

  //   if (replyClean !== "") {
  //     try {
  //       await addComment("posts", props.postId, user.uid, replyObj);
  //     } catch (err) {
  //       // Send email with error to developer.
  //       console.log(err);
  //     }
  //   } else {
  //     return;
  //   }
  // };

  render() {
    const { showComments, loading, docs } = this.state;
    const { handleShowHideComments } = this;

    return (
      <>
        <p className="text-center">
          <button
            className="btn btn-link shadow-none text-center"
            onClick={handleShowHideComments}
            block
            size="sm"
          >
            <p className="text-center">
              {!showComments && <>Show comments</>}
              {showComments && <>Hide comments</>}
            </p>
          </button>
        </p>

        {showComments && (
          <div>
            {loading && (
              <div className="loading pt-4">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
              </div>
            )}

            {(docs || []).map((item) => (
              <div className="media-block pl-5 px-2 pt-3" key={item.id}>
                <Link className="media-left" to="/">
                  <img
                    className="rounded-circle img-sm"
                    src={item.commenterPhoto}
                    alt=""
                    onError="this.style.display='none'"
                  />
                </Link>
                <div className="media-body">
                  <div className="mar-btm">
                    <Link
                      to="/"
                      className="btn-link text-semibold media-heading box-inline"
                    >
                      {item.commenterUsername}
                    </Link>
                    <p className="text-muted" style={{ fontSize: "0.76em" }}>
                      Mobile -{" "}
                      {item.createdAt !== null && (
                        <Moment fromNow>
                          {item.createdAt !== null && item.createdAt.toDate()}
                        </Moment>
                      )}
                    </p>
                  </div>
                  <p className="comment-p">{item.text}</p>
                  {/* <div className="pad-ver">
                    <div className="d-flex justify-content-end socials p-2 py-3">
                      <Link className="mr-2" to="/">
                        You like it
                      </Link>
                      <Link className="" to="/">
                        Comment
                      </Link>
                    </div>
                  </div> */}
                  <div className="d-flex justify-content-end socials py-2">
                    <div className="d-flex flex-row mr-4">
                      <Button
                        variant="none"
                        className="btn btn-sm shadow-none clickable feed-icon text-muted"
                      >
                        <FontAwesomeIcon icon={faThumbsUp} />
                      </Button>
                      <span className="text-right feed-stats">
                        {/* <strong>{numLikes > 0 && numLikes}</strong> */}
                      </span>
                    </div>

                    <div className="d-flex flex-row">
                      <Button
                        variant="none"
                        className="btn btn-sm shadow-none mr-2 clickable feed-icon text-muted"
                      >
                        <FontAwesomeIcon icon={faReply} />
                      </Button>
                      <span className="text-right feed-stats">
                        <strong>
                          {/* {props.numComments > 0 && props.numComments} */}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>

                {/* {showReplyForm && (
                  <Form className="mb-5 px-2" onSubmit={handleAddReply}>
                    <Form.Group
                      className="mb-0"
                      controlId="exampleForm.ControlTextarea1"
                    >
                      <Form.Control
                        as="textarea"
                        rows={3}
                        className="rounded-0"
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                      />
                    </Form.Group>

                    <Button
                      disabled={reply.trim() === ""}
                      variant="primary"
                      type="block"
                      block={true.toString()}
                      className="inline-block rounded-0"
                    >
                      Submit
                    </Button>
                  </Form>
                )} */}
              </div>
            ))}
          </div>
        )}
      </>
    );
  }
}
