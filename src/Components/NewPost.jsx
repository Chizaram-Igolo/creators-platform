import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSmile,
  faCamera,
  faVideo,
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
import Alert from "react-bootstrap/Alert";

import { ProgressBar } from ".";

import "./styles/NewPost.css";

import Resizer from "react-image-file-resizer";

import $ from "jquery";

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

export default function NewPost() {
  const [postText, setPostText] = useState("");

  const [error, setError] = useState("");

  const [fileArray, setFileArray] = useState([]);
  const [images, setImages] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalBytes, setTotalBytes] = useState(0);

  const [urls, setUrls] = useState([]);
  const [thumbnailUrls, setThumbnailUrls] = useState([]);
  const [progress, setProgress] = useState(0);

  const imageTypes = ["image/png", "image/jpeg", "image/jpg"];

  const onEmojiClick = (e, emojiObject) => {
    e.preventDefault();
    const textArea = document.querySelector("textarea");
    textArea.value += emojiObject.emoji;
  };

  useEffect(() => {
    const textArea = document.getElementById("postText");
    const postForm = document.getElementById("postForm");
    const multiPreview = $("#multiPreview");
    const emojiTogglerBtn = document.getElementById("emojiTogglerBtn");
    const emojiPickerDiv = $("#emojiPickerDiv");

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
      if (textArea.value.trim() === "" && images.length === 0) {
        if (postButtonsContainer.style.display === "flex") {
          postButtonsContainer.style.display = "none";
        }
      }

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

    emojiTogglerBtn.addEventListener("click", (event) => {
      emojiPickerDiv.toggle();
    });
  }, [images.length]);

  function handleClickUploadBtn() {
    document.getElementById("imageUpload").click();
  }

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

    console.log(images);
    console.log(thumbnails);

    collectionRef
      .add({ post, createdAt, images, thumbnails })
      .catch((err) => console.log("Err:", err));

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
    setError("");
    e.preventDefault();

    setLoading(true);

    const promises = [];

    let allImages = images.concat(thumbnails);

    // If Images were upload (with or no post text).
    if (allImages.length > 0) {
      for (let i = 0; i < allImages.length; i++) {
        const uploadTask = projectStorage
          .ref(`images/${allImages[i].name}`)
          .put(allImages[i]);
        promises.push(uploadTask);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            setError(error);
          },
          async () => {
            await projectStorage
              .ref("images")
              .child(allImages[i].name)
              .getDownloadURL()
              .then((url) => {
                if (allImages[i].typeOfFile === "thumbnail") {
                  thumbnailUrls.push(url);
                } else {
                  urls.push(url);
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
      }

      Promise.all(promises)
        .then(() => {})
        .catch((err) => setError(err));
    }

    // If only post text.
    if (images.length <= 0 && postText.trim() !== "") {
      handleUploadPost();
    }
  };

  async function uploadMultipleFiles(e) {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];

      if (newImage && imageTypes.includes(newImage.type)) {
        setFileArray((prevState) => [
          ...prevState,
          URL.createObjectURL(newImage),
        ]);

        let imageType = newImage.type.split("/").slice(-1);
        if (imageType === "JPG") {
          imageType = "JPEG";
        }

        const imageBlob = await imageResizer(newImage, 1400, imageType);
        imageBlob["id"] = i;
        imageBlob["typeOfFile"] = "image";
        imageBlob["name"] = newImage["name"];

        const thumbnailBlob = await imageResizer(newImage, 100, imageType);
        thumbnailBlob["id"] = imageBlob["id"];
        thumbnailBlob["typeOfFile"] = "thumbnail";

        let fileNameParts = newImage["name"].split(".");
        thumbnailBlob["name"] =
          fileNameParts.slice(0, -1).join(".") +
          "_thumbnail" +
          "." +
          fileNameParts.slice(-1);

        images.push(imageBlob);
        thumbnails.push(thumbnailBlob);

        // console.log(images);
        // console.log(thumbnails);
        // setImages((prevState) => [...prevState, newImage]);
        setError("");
      } else {
        setError("Please select an image file (png or jpg)");
        return;
      }
    }

    let _totalBytesImages = images.reduce((accumulator, element) => {
      return accumulator + element.size;
    }, 0);

    let _totalBytesThumbnails = thumbnails.reduce((accumulator, element) => {
      return accumulator + element.size;
    }, 0);

    let _totalBytes = _totalBytesImages + _totalBytesThumbnails;
    setTotalBytes(_totalBytes);

    document.getElementById("imageUpload").value = null;
  }

  return (
    <>
      <div id="overlay"></div>
      <Form onSubmit={handleUpload} id="postForm">
        <Form.Group controlId="postText" className="mb-0">
          {error && (
            <>
              <Alert
                variant="light"
                className="form-alert text-danger border border-danger auto-height"
              >
                <Form.Text className="text-danger status-message">
                  {error}
                </Form.Text>
              </Alert>
              <br />
            </>
          )}
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
              className="post-buttons-container mb-0 hidden"
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
                <Button
                  type="button"
                  variant="primary"
                  data-view-component="true"
                  className="btn-sm text-reset text-decoration-none shadow-none post-buttons-2"
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
                  onChange={uploadMultipleFiles}
                  multiple
                />

                <Button
                  type="button"
                  variant="primary"
                  data-view-component="true"
                  className="btn-sm text-reset text-decoration-none shadow-none post-buttons-3"
                  onClick={handleClickUploadBtn}
                >
                  <FontAwesomeIcon icon={faCamera} color="white" />
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
    </>
  );
}
