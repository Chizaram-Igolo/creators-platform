import React, { useState, useEffect, useRef, useCallback } from "react";
import { useToasts } from "react-toast-notifications";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import Form from "react-bootstrap/Form";
import Resizer from "react-image-file-resizer";
import $ from "jquery";

import {
  PostButtonsContainer,
  Toast,
  ModalDialog,
  MultiUploadPreview,
} from ".";
import {
  uploadMultipleImages,
  uploadMultipleVideos,
  uploadMultipleFiles,
} from "./utiltities/uploadMedia";
import "./styles/NewPost.css";
import { useAuth } from "../contexts/AuthContext";

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
  const { user } = useAuth();
  const { addToast } = useToasts();

  const [postText, setPostText] = useState("");
  const [fileArray, setFileArray] = useState([]);
  const [images, setImages] = useState([]);
  const [thumbnails, setThumbnails] = useState([]);
  const [videos, setVideos] = useState([]);
  const [videoThumbnails, setVideoThumbnails] = useState([]);
  const [files, setFiles] = useState([]);
  const [totalBytes, setTotalBytes] = useState(0);

  const [post, setPost] = useState({});

  const [showModalDialog, setShowModalDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  // Refs
  const postTextRef = useRef();
  const imageUploadRef = useRef();
  const videoUploadRef = useRef();
  const fileUploadRef = useRef();
  const emojiPickerRef = useRef();

  const handleShowModalDialog = useCallback(() => {
    setShowModalDialog(true);
  }, []);

  const handleCloseModalDialog = useCallback(() => {
    setShowModalDialog(false);
  }, []);

  const onEmojiClick = (e, emojiObject) => {
    e.preventDefault();
    let _postText = postText;
    setPostText(_postText + emojiObject.emoji);
  };

  useEffect(() => {
    const postForm = document.getElementById("postForm");
    const postText = document.getElementById("postText");
    const multiPreview = $("#multiPreview");
    const emojiTogglerBtn = $("#emojiTogglerBtn");
    const emojiPickerDiv = $("#emojiPickerDiv");
    const imageUpload = $("#imageUpload");
    const videoUpload = $("#videoUpload");
    const fileUpload = $("#fileUpload");

    const overlay = document.getElementById("overlay");
    const overlayPostDiv = document.getElementById("overlayPostDiv");

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
      // postText.style.height = "";
      // postText.style.height = postText.scrollHeight + "px";
      if (
        postText.value.trim() === "" &&
        images.length === 0 &&
        videos.length === 0
      ) {
        postButtonsContainer.style.display = "none";
      }
      multiPreview.removeClass("multi-preview-focus");
      emojiPickerDiv.hide();
    });

    document.addEventListener("click", (evt) => {
      let targetElement = evt.target; // clicked element

      do {
        if (targetElement === overlayPostDiv || targetElement === postForm) {
          // This is a click inside. Do nothing, just return.

          return;
        }
        // Go up the DOM
        targetElement = targetElement.parentNode;
      } while (targetElement);

      overlay.style.display = "none";
      overlayPostDiv.style.display = "none";
    });

    postText.addEventListener("focus", (evt) => {
      overlay.style.display = "block";
      overlayPostDiv.style.display = "block";

      //   textArea.style.position = "relative";
      //   textArea.style.width = "100%";
      //   textArea.style.zIndex = "300";

      // postButtonsContainer.style.display = "flex";
      // postButtonsContainer.style.position = "relative";
      // multiPreview.addClass("multi-preview-focus");
    });

    postText.addEventListener("blur", (evt) => {
      multiPreview.removeClass("multi-preview-focus");
    });

    postText.addEventListener("input", (evt) => {
      postText.style.height = "";
      postText.style.height = postText.scrollHeight + "px";
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
    $("#imageUploadBtn").on("mouseup", () => {
      // If the mouse is released immediately (i.e., a click), before the
      //  holdStarter runs, then cancel the holdStarter and do the click
      if (holdStarter) {
        clearTimeout(holdStarter);

        // run click-only operation here
        imageUpload.trigger("click");
      }
      // Otherwise, if the mouse was being held, end the hold
      else if (holdActive) {
        holdActive = false;
        handleShowModalDialog();
      }
    });

    // MouseDown
    $("#videoUploadBtn").on("mousedown", () => {
      holdStarter = setTimeout(() => {
        holdStarter = null;
        holdActive = true;
      }, holdDelay);
    });

    // MouseUp
    $("#videoUploadBtn").on("mouseup", () => {
      if (holdStarter) {
        clearTimeout(holdStarter);
        // $(".status").text("Clicked!");
        videoUpload.trigger("click");
      }
      // Otherwise, if the mouse was being held, end the hold
      else if (holdActive) {
        holdActive = false;
        handleShowModalDialog();
      }
    });

    // MouseDown
    $("#fileUploadBtn").on("mousedown", () => {
      holdStarter = setTimeout(() => {
        holdStarter = null;
        holdActive = true;
      }, holdDelay);
    });

    // MouseUp
    $("#fileUploadBtn").on("mouseup", () => {
      if (holdStarter) {
        clearTimeout(holdStarter);
        // $(".status").text("Clicked!");
        fileUpload.trigger("click");
      }
      // Otherwise, if the mouse was being held, end the hold
      else if (holdActive) {
        holdActive = false;
        handleShowModalDialog();
      }
    });
  }, [handleShowModalDialog, images.length, videos.length]);

  function handleRemoveThumbnail(e) {
    // console.log(e.target.id);

    let fA = [...fileArray];

    let splicedItem = fA.splice(
      fA.findIndex((item) => item.url === e.target.id),
      1
    );

    if (splicedItem[0].type === "image") {
      images.splice(
        fA.findIndex((item) => item.url === e.target.id),
        1
      );
      thumbnails.splice(
        fA.findIndex((item) => item.url === e.target.id),
        1
      );
    } else if (splicedItem[0].type === "video") {
      videos.splice(
        fA.findIndex((item) => item.url === e.target.id),
        1
      );
      videoThumbnails.splice(
        fA.findIndex((item) => item.url === e.target.id),
        1
      );
    } else if (splicedItem[0].type === "file") {
      files.splice(
        fA.findIndex((item) => item.url === e.target.id),
        1
      );
    }

    setFileArray(fA);
  }

  function cleanUp(successState) {
    if (successState) {
      addToast(<Toast body="Your post was uploaded." />, {
        appearance: "success",
        autoDismiss: true,
      });
    }

    if (!successState) {
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
    }

    // Clear state
    setFileArray([]);
    setImages([]);
    setThumbnails([]);
    setVideos([]);
    setVideoThumbnails([]);
    setFiles([]);
    setPostText("");
    setTotalBytes(0);
    setPost({});
    setLoading(false);
    postTextRef.current.style.height = "54px";
    document.getElementById("postForm").reset();
    document.getElementById("postButtonsContainer").display = "none";
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    setPost({
      files: [...images, ...thumbnails, ...videos, ...files],
      text: postText,
      poster: [
        {
          userId: user.uid,
          username: user.displayName,
          userPhoto: user.photoURL,
        },
      ],
      totalBytes: (totalBytes * 1024) / 1000,
    });
  };

  function handleUploadMultipleImages(e) {
    uploadMultipleImages(
      e,
      images,
      thumbnails,
      setFileArray,
      imageResizer,
      setTotalBytes,
      addToast,
      imageUploadRef,
      setLoading
    );
  }

  function handleUploadMultipleVideos(e) {
    uploadMultipleVideos(
      e,
      videos,
      videoThumbnails,
      fileArray,
      setFileArray,
      setTotalBytes,
      addToast,
      videoUploadRef,
      setLoading
    );
  }

  function handleUploadMultipleFiles(e) {
    uploadMultipleFiles(
      e,
      files,
      fileArray,
      setFileArray,
      setTotalBytes,
      addToast,
      fileUploadRef,
      setLoading
    );
  }

  return (
    <>
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
              ref={postTextRef}
            />

            <MultiUploadPreview
              fileArray={fileArray}
              videos={videos}
              videoThumbnails={videoThumbnails}
              handleRemoveThumbnail={handleRemoveThumbnail}
            />
            <PostButtonsContainer
              hasNoFileContent={
                postText.trim() === "" &&
                images.length === 0 &&
                videos.length === 0 &&
                files.length === 0
              }
              loading={loading}
              cleanUp={cleanUp}
              handleUploadMultipleImages={handleUploadMultipleImages}
              handleUploadMultipleVideos={handleUploadMultipleVideos}
              handleUploadMultipleFiles={handleUploadMultipleFiles}
              post={post}
              ref={[imageUploadRef, videoUploadRef, fileUploadRef]}
            />

            <div className="post-text-overlay" id="overlayPostDiv"></div>
          </div>
        </Form.Group>

        <div className="emoji-picker-div hidden" id="emojiPickerDiv">
          <Picker
            onEmojiClick={onEmojiClick}
            disableAutoFocus={true}
            skinTone={SKIN_TONE_MEDIUM_DARK}
            groupNames={{ smileys_people: "PEOPLE" }}
            native
            ref={emojiPickerRef}
          />
        </div>
      </Form>

      <div id="overlay"></div>

      <ModalDialog
        showModalDialog={showModalDialog}
        handleCloseModalDialog={handleCloseModalDialog}
      />
    </>
  );
}
