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

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";

import ProgressBar from "./ProgressBar";

const PostButtonsContainer = forwardRef(
  (
    {
      user,
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
              ? "post-buttons-container mb-0"
              : "post-buttons-container mb-0"
          }
          id="postButtonsContainer"
        >
          <div className="mt-0 btn-div ">
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

          <div className="mt-0 btn-div ">
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

          <div className="mt-0 btn-div ">
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

          <div className="mt-0 btn-div ">
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

          <div className="mt-0 btn-div ">
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

          <div className="mt-0 btn-div submit-btn-div">
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

          <div className="bg-white border-bottom px-0 pb-3 mt-4 mb-2 col-12">
            <Container>
              <Row>
                <Col md={12} className="mt-0 px-0 pb-0 mb-0">
                  <div
                    className="Box py-3 px-3 border rounded-lg"
                    style={{ backgroundColor: "rgba(108,198,68,.1)" }}
                  >
                    <div
                      id="client-secret-1180296"
                      className="Box-row d-flex flex-items-center client-secret px-0 pb-2"
                      style={{ fontSize: "0.875em" }}
                    >
                      <div className="pt-2 px-3">
                        <span className="js-user-key-icon clearfix d-block text-center ">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            version="1.1"
                            data-view-component="true"
                            height="32"
                            width="32"
                            className="octicon octicon-key"
                          >
                            <path d="M16.75 8.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z"></path>
                            <path
                              fillRule="evenodd"
                              d="M15.75 0a8.25 8.25 0 00-7.851 10.79L.513 18.178A1.75 1.75 0 000 19.414v2.836C0 23.217.784 24 1.75 24h1.5A1.75 1.75 0 005 22.25v-1a.25.25 0 01.25-.25h2.735a.75.75 0 00.545-.22l.214-.213A.875.875 0 009 19.948V18.5a.25.25 0 01.25-.25h1.086c.464 0 .91-.184 1.237-.513l1.636-1.636A8.25 8.25 0 1015.75 0zM9 8.25a6.75 6.75 0 114.288 6.287.75.75 0 00-.804.168l-1.971 1.972a.25.25 0 01-.177.073H9.25A1.75 1.75 0 007.5 18.5v1H5.25a1.75 1.75 0 00-1.75 1.75v1a.25.25 0 01-.25.25h-1.5a.25.25 0 01-.25-.25v-2.836a.25.25 0 01.073-.177l7.722-7.721a.75.75 0 00.168-.804A6.73 6.73 0 019 8.25z"
                            ></path>
                          </svg>
                        </span>
                        <span
                          title="Label: Client secret"
                          data-view-component="true"
                          className="Label Label--secondary px-2 border rounded-3"
                          style={{
                            display: "inline-block",
                            marginTop: 10,
                            width: "94px",
                            borderRadius: "16px",
                            fontSize: "0.92em",
                            textAlign: "center",
                          }}
                        >
                          Paid content
                        </span>{" "}
                      </div>
                      <div className="flex-auto px-4">
                        <code>*****868786d5</code>
                        <Alert.Heading
                          className="restricted-heading mb-2 bold-text"
                          style={{ fontWeight: 900 }}
                        >
                          Access Restriction
                        </Alert.Heading>
                        <p className="color-text-secondary mb-0">
                          Added{" "}
                          <relative-time
                            datetime="2021-07-07T18:25:09Z"
                            className="no-wrap"
                          >
                            Jul 7, 2021
                          </relative-time>{" "}
                          by{" "}
                          <span className="bold-text">@{user.displayName}</span>
                        </p>
                        {/* <p className="mt-2 mb-1 post-p">
                          This content has been restricted. You need to pay to
                          see it.
                        </p> */}
                      </div>
                    </div>
                    <Form.Group
                      controlId="formBasicCheckbox"
                      className="mt-3 clearfix col-12 "
                    >
                      <Form.Check
                        type="radio"
                        label="Free to all"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios1"
                        custom
                        className="clickable"
                      />
                      <Form.Check
                        type="radio"
                        label="Basic Backer"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios2"
                        custom
                        className="mt-1 clickable"
                      />
                      <Form.Check
                        type="radio"
                        label="Medium Backer"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios3"
                        custom
                        className="mt-1 clickable"
                      />
                      <Form.Check
                        type="radio"
                        label="Premium Backer"
                        name="formHorizontalRadios"
                        id="formHorizontalRadios4"
                        custom
                        className="mt-1 clickable"
                      />
                    </Form.Group>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>

          {Object.keys(post).length !== 0 && (
            <ProgressBar post={post} cleanUp={cleanUp} />
          )}
        </div>
      </>
    );
  }
);

export default PostButtonsContainer;
