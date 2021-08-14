import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { projectFirestore } from "../firebase/config";
import { addComment } from "../firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { get } from "jquery";

export default class Comments {
  const { user } = useAuth();
  const { docID } = props;
  // let { docs, loading, error, latestDoc } = useGetComments(docID);
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [unsubscribe, setUnsubscribe] = useState(null);
  const [reply, setReply] = useState("");
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);

  // const [comments, setComments] = useState([]);
  // const [lastDoc, setLastDoc] = useState([]);

  // useEffect(() => {
    // setComments(docs);
    // setLastDoc(latestDoc);
  // }, [docs]);

  // useEffect(() => {
  //   if (unsubscribe) {
  //     return () => unsubscribe;
  //   }
  // }, [unsubscribe]);

  const handleShowHideComments = () => {
    setShowComments(!showComments);
    getComments();
  };

  function loadMoreComments() {
    let foundDocs = [...comments];

    let unsub = projectFirestore
      .collection("posts")
      .doc(docID)
      .collection("comments")
      .orderBy("createdAt", "desc")
      .startAfter(lastDoc)
      .limit(3)
      .get()
      .then((querySnapshot) => {
        let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        setLastDoc(lastVisible);

        querySnapshot.forEach((doc) => {
          foundDocs.push({ ...doc.data(), id: doc.id });
        });

        setComments(foundDocs);
        setHasMore(querySnapshot.docs.length === 0 ? false : true);
      })
      .catch((err) => {
        // Send email with error to developer.
      });

    setUnsubscribe(unsub);

    // console.log("here");
  }

  const getComments = () => {
    let foundComments = [...comments];

    if (!hasLoadedOnce) {
      setLoading(true);

      let unsub = projectFirestore
        .collection("posts")
        .doc(props.postId)
        .collection("comments")
        .orderBy("createdAt", "desc")
        .limit(3);

      unsub.onSnapshot(
        function (querySnapshot) {
          var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

          setLastDoc(lastVisible);

          querySnapshot.forEach(function (doc) {
            if (!foundComments.find((item) => item.id === doc.id)) {
              foundComments.push({ ...doc.data(), id: doc.id });
            }
          });

          setDocs(foundComments);
          setLoading(false);
        },
        (err) => {
          // Send email with error to developer
          console.log(err);
        }
      );

      setUnsubscribe(unsub);

      // .get()
      // .then((querySnapshot) => {
      //   let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      //   setLastDoc(lastVisible);

      //   querySnapshot.forEach((doc) => {
      //     foundComments.push({ ...doc.data(), id: doc.id });
      //   });

      //   setComments(foundComments);
      //   setHasLoadedOnce(true);
      //   setLoading(false);
      //   // setHasMore(querySnapshot.docs.length === 0 ? false : true);
      // })
      // .catch((err) => {
      //   // Send email with error to developer.
      // });
    }
  };

  const getMoreComments = () => {
    console.log("in getMoreComments");

    let foundComments = [...comments];

    projectFirestore
      .collection("posts")
      .doc(props.postId)
      .collection("comments")
      .orderBy("createdAt", "desc")
      .startAfter(lastDoc)
      .limit(5)
      .get()
      .then((querySnapshot) => {
        let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        setLastDoc(lastVisible);

        querySnapshot.forEach((doc) => {
          foundComments.push({ ...doc.data(), id: doc.id });
        });

        setComments(foundComments);

        // setHasMore(querySnapshot.docs.length === 0 ? false : true);
      })
      .catch((err) => {
        // Send email with error to developer.
      });

    // setUnsubscribe(unsub);
  };

  const handleAddReply = async (e) => {
    e.preventDefault();
    let replyClean = reply.trim();

    let replyObj = {
      text: replyClean,
      replyId: user.uid,
      replierPhoto: user.photoURL,
      replierUsername: user.displayName,
    };

    setReply("");

    if (replyClean !== "") {
      try {
        await addComment("posts", props.postId, user.uid, replyObj);
      } catch (err) {
        // Send email with error to developer.
        console.log(err);
      }
    } else {
      return;
    }
  };

  return (
    <>
      <button className="btn btn-link shadow-none" onClick={handleShowHideComments} block size="sm">
        <p className="text-center">
          {!showComments && <>Show comments</>}
          {showComments && <>Hide comments</>}
        </p>
      </button>

      {showComments && (
        <div>
          {loading && (
            <div className="loading pt-4">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
            </div>
          )}

          {(comments || []).map((item) => (
            <div className="media-block px-5 pt-3" key={item.id}>
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
                <div className="pad-ver">
                  <div className="d-flex justify-content-end socials p-2 py-3">
                    <Link className="mr-2" to="/">
                      You like it
                    </Link>
                    <Link className="" to="/">
                      Comment
                    </Link>
                  </div>
                </div>
              </div>

              {showReplyForm && (
                <Form className="mb-5 px-2" onSubmit={handleAddReply}>
                  <Form.Group
                    className="mb-0"
                    controlId="exampleForm.ControlTextarea1"
                  >
                    {/* <Form.Label>Example textarea</Form.Label> */}
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
              )}
            </div>
          ))}

          {/* <div className="media-block px-5 pt-3">
        <Link className="media-left" to="/">
          <img className="rounded-circle img-sm" src={img1} alt="" />
        </Link>
        <div className="media-body">
          <div className="mar-btm">
            <Link
              to="/"
              className="btn-link text-semibold media-heading box-inline"
            >
              Lisa D.
            </Link>
            <p className="text-muted text-sm">
              <i className="fa fa-mobile fa-lg"></i> Mobile - 11 min ago
            </p>
          </div>
          <p className="comment-p">
            consectetuer adipiscing elit, sed diam nonummy nibh euismod
            tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi
            enim ad minim veniam, quis nostrud exerci tation ullamcorper
            suscipit lobortis nisl ut aliquip ex ea commodo consequat.
          </p>
          <div className="pad-ver">
            <div className="d-flex justify-content-end socials p-2 py-3">
              <Link className="mr-2" to="/">
                You like it
              </Link>
              <Link className="" to="/">
                Comment
              </Link>
            </div>
          </div>
          <hr />

          <div>
            <div className="media-block">
              <Link className="media-left" to="/">
                <img className="rounded-circle img-sm" src={img1} alt="" />
              </Link>
              <div className="media-body">
                <div className="mar-btm">
                  <Link
                    to="/"
                    className="btn-link text-semibold media-heading box-inline"
                  >
                    Lucy Moon
                  </Link>
                  <p className="text-muted text-sm">
                    <i className="fa fa-globe fa-lg"></i> Web - 2 min ago
                  </p>
                </div>
                <p className="comment-p">
                  Duis autem vel eum iriure dolor in hendrerit in vulputate ?
                </p>
                <div className="pad-ver">
                  <div className="d-flex justify-content-end socials p-2 py-3">
                    <Link className="mr-2" to="/">
                      You like it
                    </Link>
                    <Link className="" to="/">
                      Comment
                    </Link>
                  </div>
                  <div className="btn-group"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
        </div>
      )}
    </>
  );
}
