import React, { useState } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";

// import FbImageLibrary from "react-fb-image-grid";
// import Button from "react-bootstrap/Button";
import { Comments, ImageGrid } from ".";
import img1 from "../assets/img1.jpeg";
import "../Screens/Feed.css";

export default function Post(props) {
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="bg-white border-bottom pb-3 mt-2 mb-3 no-hor-padding">
      <div>
        <div className="d-flex flex-row justify-content-between align-items-center p-2">
          <div className="d-flex flex-row align-items-center feed-text">
            <img
              className="rounded-circle"
              src={img1}
              alt=""
              width="45"
              height="45"
            />
            <div className="d-flex flex-column flex-wrap ml-2">
              <span className="font-weight-bold cooper">Thomson ben</span>
              <span className="text-black-50 time">
                <Moment fromNow>
                  {props.createdAt !== null && props.createdAt.toDate()}
                </Moment>
              </span>
            </div>
          </div>
          <div className="feed-icon px-2">
            <i className="fa fa-ellipsis-v text-black-50"></i>
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
          <ImageGrid images={props.images} />
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
