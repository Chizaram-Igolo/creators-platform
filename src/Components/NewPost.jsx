import React, { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSmile,
  faCamera,
  faVideo,
  faMicrophone,
  faPaperclip,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import {
  projectFirestore,
  projectStorage,
  timestamp,
} from "../firebase/config";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Resizer from "react-image-file-resizer";
import $ from "jquery";

import { ProgressBar, Toast } from ".";
import {
  uploadMultipleImages,
  uploadMultipleVideos,
} from "./utiltities/uploadMedia";
import "./styles/NewPost.css";

const imageResizer = (file, size, imageType) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      size,
      size,
      imageType,
      80,
      0,
      (uri) => {
        resolve(uri);
      },
      "blob"
    );
  });

export default function NewPost({ handleChangeError }) {
  const [postText, setPostText] = useState("");

  const [fileArray, setFileArray] = useState([]);
  const [images, setImages] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalBytes, setTotalBytes] = useState(0);

  const [urls, setUrls] = useState([]);
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [progress, setProgress] = useState(0);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { addToast } = useToasts();

  const onEmojiClick = (e, emojiObject) => {
    e.preventDefault();
    let _postText = postText;
    setPostText(_postText + emojiObject.emoji);
  };

  useEffect(() => {
    const textArea = document.getElementById("postText");
    const postForm = document.getElementById("postForm");
    const multiPreview = $("#multiPreview");
    const emojiTogglerBtn = $("#emojiTogglerBtn");
    const emojiPickerDiv = $("#emojiPickerDiv");
    const imageUpload = $("#imageUpload");
    const videoUpload = $("#videoUpload");

    textArea.addEventListener("input", (event) => {
      textArea.style.height = "";
      textArea.style.height = textArea.scrollHeight + "px";
    });

    const postButtonsContainer = document.getElementById(
      "postButtonsContainer"
    );

    document.addEventListener("click", (evt) => {
      let targetElement = evt.target; // clicked element

      do {
        if (targetElement === postForm) {
          // This is a click inside. Do nothing, just return.
          return;
        }
        // Go up the DOM
        targetElement = targetElement.parentNode;
      } while (targetElement);

      // This is a click outside.
      textArea.style.height = "";
      textArea.style.height = textArea.scrollHeight + "px";
      multiPreview.removeClass("multi-preview-focus");
      emojiPickerDiv.hide();
    });

    textArea.addEventListener("focus", (event) => {
      //   document.getElementById("overlay").style.display = "block";
      //   textArea.style.position = "relative";
      //   textArea.style.width = "100%";
      //   textArea.style.zIndex = "300";

      postButtonsContainer.style.display = "flex";
      postButtonsContainer.style.position = "relative";
      multiPreview.addClass("multi-preview-focus");

      //   postButtonsContainer.style.display = "flex";
      //   postButtonsContainer.style.zIndex = "300";
    });

    textArea.addEventListener("blur", (event) => {
      multiPreview.removeClass("multi-preview-focus");
    });

    emojiTogglerBtn.on("click", function () {
      emojiPickerDiv.toggle();
    });

    // This timeout, started on mousedown, triggers the beginning of a hold
    var holdStarter = null;

    // This is how many milliseconds to wait before recognizing a hold
    var holdDelay = 500;

    // This flag indicates the user is currently holding the mouse down
    var holdActive = false;

    // MouseDown
    $("#imageUploadBtn").on("mousedown", onMouseDown1);
    function onMouseDown1() {
      // Do not take any immediate action - just set the holdStarter
      //  to wait for the predetermined delay, and then begin a hold
      holdStarter = setTimeout(function () {
        holdStarter = null;
        holdActive = true;
      }, holdDelay);
    }

    // MouseUp
    $("#imageUploadBtn").on("mouseup", onMouseUp1);
    function onMouseUp1() {
      // If the mouse is released immediately (i.e., a click), before the
      //  holdStarter runs, then cancel the holdStarter and do the click
      if (holdStarter) {
        clearTimeout(holdStarter);
        // run click-only operation here
        // $(".status").text("Clicked!");
        imageUpload.trigger("click");
      }
      // Otherwise, if the mouse was being held, end the hold
      else if (holdActive) {
        holdActive = false;
        handleShow();
      }
    }

    // MouseDown
    $("#videoUploadBtn").on("mousedown", onMouseDown2);
    function onMouseDown2() {
      // Do not take any immediate action - just set the holdStarter
      //  to wait for the predetermined delay, and then begin a hold
      holdStarter = setTimeout(function () {
        holdStarter = null;
        holdActive = true;
      }, holdDelay);
    }

    // MouseUp
    $("#videoUploadBtn").on("mouseup", onMouseUp2);
    function onMouseUp2() {
      // If the mouse is released immediately (i.e., a click), before the
      //  holdStarter runs, then cancel the holdStarter and do the click
      if (holdStarter) {
        clearTimeout(holdStarter);
        // run click-only operation here
        // $(".status").text("Clicked!");
        videoUpload.trigger("click");
      }
      // Otherwise, if the mouse was being held, end the hold
      else if (holdActive) {
        holdActive = false;
        handleShow();
      }
    }

    // OnClick
    // not using onclick at all - onmousedown and onmouseup take care of everything

    // Optional add-on: if mouse moves out, then release hold
    // $("#imageUploadBtn").on("mouseout", function () {
    //   onMouseUp();
    // });
  }, []);

  function handleRemoveThumbnail(e) {
    let fA = [...fileArray];
    fA.splice(fA.indexOf(e.target.id), 1);
    images.splice(fA.indexOf(e.target.id), 1);
    thumbnails.splice(fA.indexOf(e.target.id), 1);
    setFileArray(fA);
  }

  function handleUploadPost() {
    const collectionRef = projectFirestore.collection("posts");
    const post = postText.trim();
    const createdAt = timestamp();
    const images = urls;
    const thumbnails = thumbnailUrls;

    // Sort the image and thumbnail urls by their numeric ids to keep the order.
    images.sort((a, b) => (a.id > b.id ? 1 : -1));
    thumbnails.sort((a, b) => (a.id > b.id ? 1 : -1));

    let _images = images.map((image) => image.url);
    let _thumbnails = thumbnails.map((thumbnail) => thumbnail.url);

    collectionRef
      .add({ post, createdAt, images: _images, thumbnails: _thumbnails })
      .catch((err) => {
        addToast(
          <Toast
            heading="We're sorry"
            body="We couldn't complete the current operation due to a faulty connection. Please try again."
          />,
          {
            appearance: "error",
            autoDismiss: false,
          }
        );

        setProgress(0);
        setLoading(false);
        return;
      });

    addToast(<Toast body="Your post was uploaded." />, {
      appearance: "success",
      autoDismiss: true,
    });

    // Clear state
    setFileArray([]);
    setUrls([]);
    setThumbnailUrls([]);
    setImages([]);
    setThumbnails([]);
    setPostText("");
    setTotalBytes(0);
    setLoading(false);
    document.getElementById("postText").style.height = "54px";
    document.getElementById("postForm").reset();
    document.getElementById("postButtonsContainer").display = "none";
  }

  const handleUpload = async (e) => {
    e.preventDefault();

    setLoading(true);

    const promises = [];

    let allImages = images.concat(thumbnails);

    // If Images were upload (with or no post text).
    if (allImages.length > 0) {
      let totalBytesTransferred = 0;

      allImages.forEach((image) => {
        const uploadTask = projectStorage
          .ref(`images/${image.name}`)
          .put(image);
        promises.push(uploadTask);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            totalBytesTransferred += snapshot.bytesTransferred;

            const progress = Math.round(
              (totalBytesTransferred / totalBytes) * 100
            );

            setProgress(progress);
          },
          (err) => {
            addToast(
              <Toast
                heading="We're sorry"
                body="We couldn't complete the current operation due to a faulty connection. Please try again."
              />,
              {
                appearance: "error",
                autoDismiss: false,
              }
            );

            setProgress(0);
            setLoading(false);
            return;
          },
          async () => {
            await projectStorage
              .ref("images")
              .child(image.name)
              .getDownloadURL()
              .then((url) => {
                if (image.typeOfFile === "thumbnail") {
                  thumbnailUrls.push({ url: url, id: image["id"] });
                } else {
                  urls.push({ url: url, id: image["id"] });
                }

                if (
                  urls.length + thumbnailUrls.length === allImages.length &&
                  allImages.length > 0
                ) {
                  handleUploadPost();
                }
              });
          }
        );
      });

      Promise.all(promises)
        .then(() => {})
        .catch((err) => {
          addToast(
            <Toast
              heading="We're sorry"
              body="We couldn't complete the current operation due to a faulty connection. Please try again."
            />,
            {
              appearance: "error",
              autoDismiss: true,
            }
          );

          setProgress(0);
          setLoading(false);
          return;
        });
    }

    // If only post text.
    if (images.length <= 0 && postText.trim() !== "") {
      handleUploadPost();
    }
  };

  function handleUploadMultipleImages(e) {
    let imageUploadInput = document.getElementById("imageUpload");

    uploadMultipleImages(
      e,
      images,
      thumbnails,
      setFileArray,
      imageResizer,
      setTotalBytes,
      addToast,
      imageUploadInput
    );
  }

  function handleUploadMultipleVideos(e) {
    let imageUploadInput = document.getElementById("imageUpload");

    uploadMultipleVideos(
      e,
      images,
      thumbnails,
      setFileArray,
      imageResizer,
      setTotalBytes,
      addToast,
      imageUploadInput
    );
  }

  return (
    <>
      <div id="overlay"></div>
      <Form onSubmit={handleUpload} id="postForm">
        <Form.Group controlId="postText" className="mb-0">
          <div className="grow-wrap">
            <Form.Control
              as="textarea"
              placeholder="Enter in content you want to share."
              rows={1}
              role="textarea"
              className="shadow-none animated new-post-textarea border-bottom-0"
              onChange={(e) => setPostText(e.target.value)}
              value={postText}
            />

            <div className="form-group multi-preview mb-0" id="multiPreview">
              {(fileArray || []).map((url) => (
                <div className="preview-img-div" key={url}>
                  <img src={url} alt="..." />
                  <button
                    type="button"
                    className="close closeThumbnail"
                    aria-label="Close"
                    style={{ position: "absolute", top: "-4px", right: "4px" }}
                  >
                    <span
                      aria-hidden="true"
                      id={url}
                      onClick={handleRemoveThumbnail}
                    >
                      ×
                    </span>
                  </button>
                </div>
              ))}
            </div>

            <div
              className={
                postText.trim() === "" && images.length === 0
                  ? "post-buttons-container mb-0 hidden"
                  : "post-buttons-container mb-0"
              }
              id="postButtonsContainer"
            >
              <div className="mt-0 ">
                <Button
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
                  multiple
                />
                <Button
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
                  multiple
                />

                <Button
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
                  id="imageUpload"
                  onChange={handleUploadMultipleImages}
                  multiple
                />

                <Button
                  type="button"
                  variant="dark"
                  data-view-component="true"
                  className="btn-sm text-reset text-decoration-none shadow-none post-buttons-3"
                  id="imageUploadBtn"
                >
                  <FontAwesomeIcon icon={faMicrophone} color="white" />
                </Button>
              </div>

              <div className="mt-0">
                {/* <label className="camera-icon-btn"> */}
                <input
                  type="file"
                  className="image-upload"
                  id="imageUpload"
                  onChange={handleUploadMultipleImages}
                  multiple
                />

                <Button
                  type="button"
                  variant="dark"
                  data-view-component="true"
                  className="btn-sm text-reset text-decoration-none shadow-none post-buttons-3"
                  id="imageUploadBtn"
                >
                  <FontAwesomeIcon icon={faPaperclip} color="white" />
                </Button>
              </div>

              <div className="mt-0 submit-btn-div">
                <Button
                  disabled={
                    (postText.length === 0 && images.length === 0) || loading
                  }
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
          </div>
        </Form.Group>
        {loading && <ProgressBar progress={progress} />}
        <div className="emoji-picker-div hidden" id="emojiPickerDiv">
          <Picker
            onEmojiClick={onEmojiClick}
            disableAutoFocus={true}
            skinTone={SKIN_TONE_MEDIUM_DARK}
            groupNames={{ smileys_people: "PEOPLE" }}
            native
          />
        </div>
      </Form>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
