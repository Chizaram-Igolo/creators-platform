import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faFile } from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import ProgressiveImage from "react-progressive-image-loading";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import { SRLWrapper } from "simple-react-lightbox-pro";

import { Comments, ImageGrid, DropdownMenu, Toast } from "..";
import {
  deletePost,
  deleteFiles,
  addLike,
  removeLike,
  checkHasLiked,
  addComment,
} from "../../firebase/firestore";
import { useToasts } from "react-toast-notifications";
import { useAuth } from "../../contexts/AuthContext";
import IconButton from "@material-ui/core/IconButton";
import Favorite from "@material-ui/icons/Favorite";
import Comment from "@material-ui/icons/Comment";

import "./Post.css";
import AvatarComponent from "../AvatarComponent";

export default function Post(props) {
  const { user } = useAuth();
  const { addToast } = useToasts();
  const [numLikes, setNumLikes] = useState(props.numLikes);
  const [numComments] = useState(props.numComments);
  const [hasLiked, setHasLiked] = useState(false);
  const [postFiles, setPostFiles] = useState([]);
  const [numOfFilesToShow] = useState(3);
  const [showMoreFiles, setIsShowMoreFiles] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [comment, setComment] = useState("");

  const options = [];

  useEffect(() => {
    setNumLikes(props.numLikes);
  }, [props]);

  useEffect(() => {
    (async () => {
      try {
        const likeDoc = await checkHasLiked("posts", props.postId, user.uid);
        setHasLiked(likeDoc.exists);
      } catch (err) {
        // Send email with error to developer.
      }
    })();
  }, [props, user]);

  useEffect(() => {
    setPostFiles([...props.resourceList]);
  }, [props.resourceList]);

  const onClickShowMore = useCallback(() => {
    setIsShowMoreFiles(true);
  }, []);

  const onClickShowLess = useCallback(() => {
    setIsShowMoreFiles(false);
  }, []);

  const handleLikeDislike = () => {
    if (hasLiked) {
      handleRemoveLike();
    } else {
      handleAddLike();
    }
  };

  const handleAddLike = async () => {
    setHasLiked(true);
    setNumLikes((numLikes) => numLikes + 1);

    try {
      await addLike("posts", props.postId, user.uid);
      console.log("liked");
    } catch (err) {
      // Send email with error to developer.
    }
  };

  const handleRemoveLike = async () => {
    setNumLikes((numLikes) => numLikes - 1);
    setHasLiked(false);

    try {
      await removeLike("posts", props.postId, user.uid, props.numLikes);
    } catch (err) {
      // Send email with error to developer.
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    let commentClean = comment.trim();

    let commentObj = {
      text: commentClean,
      commentId: user.uid,
      commenterPhoto: user.photoURL,
      commenterUsername: user.displayName,
    };

    setComment("");

    if (commentClean !== "") {
      try {
        await addComment("posts", props.postId, commentObj);
        setShowCommentForm(false);
      } catch (err) {
        // Send email with error to developer.
      }
    } else {
      return;
    }
  };

  const handleDeletePost = async () => {
    try {
      deletePost("posts", props.postId).then(() => {
        addToast(<Toast body="Post successfully deleted." />, {
          appearance: "success",
          autoDismiss: true,
        });

        handleDeleteFiles();
      });
    } catch (err) {
      addToast(
        <Toast
          heading="We're sorry"
          body="Sorry, we couldn't delete the post right now."
        />,
        {
          appearance: "error",
          autoDismiss: true,
        }
      );
    }
  };

  if (user === null || user.id === null) {
  } else if (user.uid === props.posterId) {
    options.push({ option: "Delete Post", handlerFunction: handleDeletePost });
  } else if (user.uid !== props.posterId) {
    options.push({ option: "Report Post", handlerFunction: () => {} });
  }

  const handleDeleteFiles = async () => {
    Promise.all(deleteFiles(postFiles))
      .then(() => {})
      .catch((err) => {});
  };

  return (
    <div className="border-bottom pb-3 mb-3 px-md-0">
      <div className="d-flex flex-row justify-content-between py-2 px-0">
        <Link
          to={`/${props.posterUsername}`}
          className="text-decoration-none text-reset"
        >
          <div className="d-flex flex-row align-items-center feed-text">
            <ProgressiveImage
              preview={props.posterPhoto}
              src={props.posterPhoto}
              initialBlur={2}
              render={(src, style) => (
                <>
                  <AvatarComponent
                    imgSrc={src}
                    displayName={props.posterUsername.toLocaleUpperCase()}
                    size="medium"
                    showOnlineStatus={false}
                    avatarColour={props.posterAvatarColour}
                  />
                  {/* <img
                    className="rounded-circle"
                    src={src}
                    style={style}
                    alt=""
                    width="45"
                    height="45"
                  /> */}
                </>
              )}
            />
            <div className="d-flex flex-column flex-wrap ml-2">
              <span className="semi-bold-text">
                {props.posterUsername}{" "}
                <span
                  class="material-icons"
                  style={{
                    position: "relative",
                    top: "2px",
                    color: "green",
                    fontSize: "1em",
                  }}
                >
                  verified
                </span>
              </span>
              <span className="text-black-50 time">
                {props.createdAt !== null && (
                  <Moment fromNow>
                    {props.createdAt !== null && props.createdAt.toDate()}
                  </Moment>
                )}

                {props.createdAt === null && <>calculating...</>}
              </span>
            </div>
          </div>
        </Link>
        <div>
          <DropdownMenu
            icon={<FontAwesomeIcon icon={faEllipsisV} color="#333333" />}
            options={options}
          />
        </div>
      </div>
      <div className="py-3 px-2">
        <p className="post-p">{props.text}</p>
      </div>

      {/* {props.videos !== null && props.videos.length > 0 && (
        <video src={props.videos[0]}>
          <source src={props.videos[0]} />
        </video>
      )} */}

      {props.videos !== null && props.videos.length > 0 && (
        <SRLWrapper>
          <div>
            <img src={props.videoThumbnails[0]} className="clickable" alt="0" />
            <video
              width="100%"
              height="100%"
              srl_video_thumbnail={props.videoThumbnails[0]}
              // srl_video_caption="A video with a rabbit"
              srl_video_controls="true"
              srl_video_autoplay="true"
              srl_video_muted="false"
              style={{ display: "none" }}
            >
              <source src={props.videos[0]} />
              Your browser does not support the video tag.
            </video>
          </div>
        </SRLWrapper>
      )}

      {props.images !== null && props.images.length > 0 && (
        <div className="feed-image pb-2 px-4">
          <ImageGrid images={props.images} thumbnails={props.thumbnails} />
        </div>
      )}

      {props.files !== null &&
        props.files.map((item, id) => {
          if (id < numOfFilesToShow) {
            return (
              <p
                className="py-0 px-2"
                style={{ lineHeight: "0.98em", hyphens: "auto" }}
              >
                <a href={item} download={item} target="_blank" rel="noreferrer">
                  <FontAwesomeIcon icon={faFile} />
                  &nbsp;
                  {item
                    .replace("%2F", "/")
                    .replace("%20", " ")
                    .split("?")
                    .slice(0, -1)
                    .join("")
                    .split("/")
                    .slice(-1)}
                </a>
              </p>
            );
          } else {
            return (
              <>
                <div
                  className="collapse multi-collapse"
                  id="multiCollapseExample1"
                >
                  <p className="py-0 px-2" style={{ lineHeight: "0.98em" }}>
                    <a
                      href={item}
                      download={item}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon icon={faFile} />
                      &nbsp;
                      {item
                        .replace("%2F", "/")
                        .replace("%20", " ")
                        .split("?")
                        .slice(0, -1)
                        .join("")
                        .split("/")
                        .slice(-1)}
                    </a>
                  </p>
                </div>
              </>
            );
          }
        })}
      {props.files !== null && props.files.length > 0 && !showMoreFiles && (
        <p className="text-center">
          <button
            className="btn btn-link shadow-none"
            data-toggle="collapse"
            href="#multiCollapseExample1"
            aria-expanded="false"
            aria-controls="multiCollapseExample1"
            style={{
              color: "#007bff",
              textDecoration: "none",
              backgroundColor: "transparent",
            }}
            onClick={onClickShowMore}
          >
            {!showMoreFiles && props.files.length > numOfFilesToShow && (
              <>Show more ... ({props.files.length - numOfFilesToShow})</>
            )}

            {showMoreFiles && <>Show less</>}
          </button>
        </p>
      )}
      {props.files !== null && props.files.length > 0 && showMoreFiles && (
        <p className="text-center">
          <button
            className="btn btn-link shadow-none"
            data-toggle="collapse"
            href="#multiCollapseExample1"
            aria-expanded="false"
            aria-controls="multiCollapseExample1"
            style={{
              color: "#007bff",
              textDecoration: "none",
              backgroundColor: "transparent",
            }}
            onClick={onClickShowLess}
          >
            Show less
          </button>
        </p>
      )}
      <div className="d-flex col-12 justify-content-end socials pr-0">
        <div className="d-flex flex-row mr-4">
          {/* <Button
            variant="none"
            className={
              hasLiked === true
                ? "btn btn-sm shadow-none clickable feed-icon text-muted selected"
                : "btn btn-sm shadow-none clickable feed-icon text-muted"
            }
            onClick={handleLikeDislike}
          > */}
          <IconButton
            aria-label="delete"
            className={`feed-icon ${hasLiked === true ? "selected" : ""}`}
            onClick={handleLikeDislike}
          >
            <Favorite />
            {/* <FontAwesomeIcon icon={faHeart} /> */}
          </IconButton>
          {/* </Button> */}
          <span className="text-right feed-stats semi-bold-text">
            {numLikes > 0 && numLikes}
          </span>
        </div>

        <div className="d-flex flex-row">
          {/* <Button
            variant="none"
            className="btn btn-sm shadow-none mr clickable feed-icon text-muted"
            onClick={() => setShowCommentForm(!showCommentForm)}
          > */}
          <IconButton
            aria-label="delete"
            className={`feed-icon text-muted`}
            onClick={() => setShowCommentForm(!showCommentForm)}
          >
            <Comment />
          </IconButton>
          {/* <FontAwesomeIcon icon={faComment} /> */}
          {/* </Button> */}
          <span className="text-right feed-stats semi-bold-text semi-bold-text">
            {numComments > 0 && numComments}
          </span>
        </div>
      </div>
      {showCommentForm && (
        <Form className="mb-5 px-2" onSubmit={handleAddComment}>
          <Form.Group className="mb-0" controlId="exampleForm.ControlTextarea1">
            <Form.Control
              as="textarea"
              rows={3}
              className="rounded-0"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>

          <Button
            disabled={comment.trim() === ""}
            variant="primary"
            type="block"
            block={true.toString()}
            className="inline-block rounded-0"
          >
            Submit
          </Button>
        </Form>
      )}

      {props.numComments > 0 && <Comments postId={props.postId} />}
    </div>
  );
}
