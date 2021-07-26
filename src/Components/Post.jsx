import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faFile } from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";

import { Comments, ImageGrid, DropdownMenu, Toast } from ".";
import { deletePost, deleteFiles } from "../firebase/firestore";
import { useToasts } from "react-toast-notifications";
import { useAuth } from "../contexts/AuthContext";

export default function Post(props) {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [numOfFilesToShow] = useState(3);
  const [isShowMoreFiles, setIsShowMoreFiles] = useState(false);
  const [postFiles, setPostFiles] = useState([]);
  const { addToast } = useToasts();

  const options = [];

  useEffect(() => {
    setPostFiles([...props.resourceList]);
  }, [props.resourceList]);

  const onClickShowMore = useCallback(() => {
    setIsShowMoreFiles(true);
  }, []);

  const onClickShowLess = useCallback(() => {
    setIsShowMoreFiles(false);
  }, []);

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

  if (user.uid === props.poster.userId) {
    options.push({ option: "Delete Post", handlerFunction: handleDeletePost });
  }

  const handleDeleteFiles = async () => {
    Promise.all(deleteFiles(postFiles))
      .then(() => {})
      .catch((err) => {});
  };

  return (
    <div className="bg-white border-bottom pb-3 mt-2 mb-3 no-hor-padding">
      <div>
        <div className="d-flex flex-row justify-content-between py-2">
          <div className="d-flex flex-row align-items-center feed-text">
            <img
              className="rounded-circle"
              src={props.poster.userPhoto}
              alt=""
              width="45"
              height="45"
            />
            <div className="d-flex flex-column flex-wrap ml-2">
              <span className="font-weight-bold cooper">
                {props.poster.username}
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
          <div className="feed-icon pl-2">
            <DropdownMenu
              icon={<FontAwesomeIcon icon={faEllipsisV} color="#333333" />}
              options={options}
            />
          </div>
        </div>
      </div>
      <div className="py-2">
        <p className="post-p">{props.text}</p>
      </div>

      {/* {props.videos !== null && props.videos.length > 0 && (
        <div className="feed-image pb-2 px-3">
          <ImageGrid images={props.videos} thumbnails={props.videoThumbnails} />
        </div>
      )} */}

      {props.images !== null && props.images.length > 0 && (
        <div className="feed-image pb-2 px-3">
          <ImageGrid images={props.images} thumbnails={props.thumbnails} />
        </div>
      )}

      {props.files !== null &&
        props.files.map((item, id) => {
          if (id < numOfFilesToShow) {
            return (
              <p className="py-0" style={{ lineHeight: "0.98em" }}>
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
                <div className="row">
                  <div className="col">
                    <div
                      className="collapse multi-collapse"
                      id="multiCollapseExample1"
                    >
                      <p className="py-0" style={{ lineHeight: "0.98em" }}>
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
                  </div>
                </div>
              </>
            );
          }
        })}

      {props.files !== null && !isShowMoreFiles && (
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
            {!isShowMoreFiles && props.files.length > numOfFilesToShow && (
              <>Show more ... ({props.files.length - numOfFilesToShow})</>
            )}

            {isShowMoreFiles && <>Show less</>}
          </button>
        </p>
      )}

      {props.files !== null && isShowMoreFiles && (
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

      <div className="d-flex justify-content-end socials py-3">
        <small className="fa fa-thumbs-up mr-2">Like</small>
        <small className="fa fa-comments-o mr-2">Comment</small>
        <small className="fa fa-share">Share</small>
      </div>

      {props.comments !== null && (
        <Link onClick={() => setShowComments(!showComments)} block size="sm">
          <p className="text-center">See comments</p>
          {showComments && <Comments />}
        </Link>
      )}
    </div>
  );
}
