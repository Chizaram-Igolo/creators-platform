import React, { useState } from "react";
import { Link } from "react-router-dom";
import Moment from "react-moment";

// import FbImageLibrary from "react-fb-image-grid";
// import Button from "react-bootstrap/Button";
import { Comments, ImageGrid } from ".";
import img1 from "../assets/img1.jpeg";
import "../Screens/Feed.css";

const images = [
  "https://images.pexels.com/photos/6192010/pexels-photo-6192010.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
  "https://images.pexels.com/photos/159644/art-supplies-brushes-rulers-scissors-159644.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
  "https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg?auto=compress&cs=tinysrgb&h=350",
  "https://www.gettyimages.ie/gi-resources/images/Homepage/Hero/UK/CMS_Creative_164657191_Kingfisher.jpg",

  "https://cdn.pixabay.com/photo/2016/10/27/22/53/heart-1776746_960_720.jpg",
  // "https://images.pexels.com/photos/257840/pexels-photo-257840.jpeg?auto=compress&cs=tinysrgb&h=350",
  // "https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&h=350",
  // "https://wallpaperbrowse.com/media/images/3848765-wallpaper-images-download.jpg",
];

export default function Post({ text, comments, hasImages, createdAt }) {
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
                <Moment fromNow>{createdAt.toDate()}</Moment>
              </span>
            </div>
          </div>
          <div className="feed-icon px-2">
            <i className="fa fa-ellipsis-v text-black-50"></i>
          </div>
        </div>
      </div>
      <div className="p-2">
        <p className="post-p">{text}</p>
      </div>

      {/* {props.images && (
        <div className="feed-image mt-3 p-2 px-3">
          <img className="img-fluid img-responsive" src={img1} alt="" />
        </div>
      )} */}

      {hasImages && (
        <div className="feed-image pb-2 px-3">
          <ImageGrid images={images} />
        </div>
      )}

      <div className="d-flex justify-content-end socials py-3">
        <small className="fa fa-thumbs-up mr-2">Like</small>
        <small className="fa fa-comments-o mr-2">Comment</small>
        <small className="fa fa-share">Share</small>
      </div>

      {comments && (
        <Link onClick={() => setShowComments(!showComments)} block size="sm">
          <p className="text-center">See comments</p>
        </Link>
      )}

      {comments && showComments && <Comments />}
    </div>
  );
}
