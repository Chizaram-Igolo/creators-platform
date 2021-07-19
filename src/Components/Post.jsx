import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";

import { Comments, ImageGrid, DropdownMenu, Toast } from ".";
import { deletePost } from "../firebase/firestore";
import { useToasts } from "react-toast-notifications";

export default function Post(props) {
  const [showComments, setShowComments] = useState(false);
  const { addToast } = useToasts();

  const handleDeletePost = async () => {
    try {
      deletePost("posts", props.postId).then(
        addToast(<Toast body="Post successfully deleted." />, {
          appearance: "success",
          autoDismiss: true,
        })
      );
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

  return (
    <div className="bg-white border-bottom pb-3 mt-2 mb-3 no-hor-padding">
      <div>
        <div className="d-flex flex-row justify-content-between p-2">
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
          <div className="feed-icon px-2">
            <DropdownMenu
              icon={<FontAwesomeIcon icon={faEllipsisV} color="#333333" />}
              options={[
                { option: "Delete Post", handlerFunction: handleDeletePost },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="p-2">
        <p className="post-p">{props.text}</p>
      </div>

      {/* {props.images && (
        <div className="feed-image mt-3 p-2 px-3">
          <img className="img-fluid img-responsive" src={img1} alt="" />
        </div>
      )} */}

      {props.images !== null && (
        <div className="feed-image pb-2 px-3">
          <ImageGrid images={props.images} thumbnails={props.thumbnails} />
        </div>
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
