import React, { forwardRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSmile,
  faCamera,
  faVideo,
  faMicrophone,
  faPaperclip,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import Button from "react-bootstrap/Button";
import { ProgressBar } from ".";

const PostButtonsContainer = forwardRef(
  (
    {
      hasNoFileContent,
      loading,
      cleanUp,
      handleUploadMultipleImages,
      handleUploadMultipleVideos,
      handleUploadMultipleFiles,
      post,
    },
    ref
  ) => {
    return (
      <>
        <div
          className={
            hasNoFileContent
              ? "post-buttons-container mb-0 hidden"
              : "post-buttons-container mb-0"
          }
          id="postButtonsContainer"
        >
          <div className="mt-0 ">
            <Button
              disabled={loading}
              type="button"
              variant="primary"
              data-view-component="true"
              className="btn-sm text-reset text-decoration-none shadow-none post-buttons-1"
              id="emojiTogglerBtn"
            >
              <FontAwesomeIcon icon={faSmile} color="white" />
            </Button>
          </div>

          <div className="mt-0">
            <input
              type="file"
              className="video-upload"
              id="videoUpload"
              onChange={handleUploadMultipleVideos}
              accept="video/*"
              multiple
            />
            <Button
              disabled={loading}
              type="button"
              variant="primary"
              data-view-component="true"
              className="btn-sm text-reset text-decoration-none shadow-none post-buttons-2"
              id="videoUploadBtn"
            >
              <FontAwesomeIcon icon={faVideo} color="white" />
            </Button>
          </div>

          <div className="mt-0">
            {/* <label className="camera-icon-btn"> */}
            <input
              type="file"
              className="image-upload"
              id="imageUpload"
              onChange={handleUploadMultipleImages}
              accept="image/x-png,image/jpeg"
              multiple
              ref={ref[0]}
            />

            <Button
              disabled={loading}
              type="button"
              variant="primary"
              data-view-component="true"
              className="btn-sm text-reset text-decoration-none shadow-none post-buttons-3"
              id="imageUploadBtn"
            >
              <FontAwesomeIcon icon={faCamera} color="white" />
            </Button>
          </div>

          <div className="mt-0">
            {/* <label className="camera-icon-btn"> */}
            <input
              type="file"
              className="image-upload"
              id="audioUpload"
              onChange={handleUploadMultipleImages}
              multiple
              ref={ref[1]}
            />

            <Button
              disabled={loading}
              type="button"
              variant="dark"
              data-view-component="true"
              className="btn-sm text-reset text-decoration-none shadow-none post-buttons-4"
              id="audioUploadBtn"
            >
              <FontAwesomeIcon icon={faMicrophone} color="white" />
            </Button>
          </div>

          <div className="mt-0">
            {/* <label className="camera-icon-btn"> */}
            <input
              type="file"
              className="image-upload"
              id="fileUpload"
              onChange={handleUploadMultipleFiles}
              multiple
              ref={ref[2]}
            />

            <Button
              disabled={loading}
              type="button"
              variant="dark"
              data-view-component="true"
              className="btn-sm text-reset text-decoration-none shadow-none post-buttons-5"
              id="fileUploadBtn"
            >
              <FontAwesomeIcon icon={faPaperclip} color="white" />
            </Button>
          </div>

          <div className="mt-0 submit-btn-div">
            <Button
              disabled={hasNoFileContent || loading}
              variant="primary"
              type="submit"
              block={true.toString()}
              className="inline-block  shadow-none post-buttons-3"
            >
              {loading ? (
                <div className="box">
                  <div className="card1"></div>
                  <div className="card2"></div>
                  <div className="card3"></div>
                </div>
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} color="white" />
              )}
            </Button>
          </div>
        </div>

        {Object.keys(post).length !== 0 && (
          <ProgressBar post={post} cleanUp={cleanUp} />
        )}
      </>
    );
  }
);

export default PostButtonsContainer;
