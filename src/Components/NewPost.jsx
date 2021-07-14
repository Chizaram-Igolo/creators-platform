import React, { useState, useRef, useEffect } from "react";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import {
  projectFirestore,
  projectStorage,
  timestamp,
} from "../firebase/config";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { ProgressBar } from ".";

import "./NewPost.css";

export default function NewPost() {
  const [postText, setPostText] = useState("");

  const [error, setError] = useState("");

  const [fileArray, setFileArray] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState(0);

  const imageTypes = ["image/png", "image/jpeg", "image/jpg"];

  const onEmojiClick = (e, emojiObject) => {
    e.preventDefault();
    const textArea = document.querySelector("textarea");
    textArea.value += emojiObject.emoji;
  };

  useEffect(() => {
    const textArea = document.querySelector("textarea");

    textArea.addEventListener("input", (event) => {
      textArea.style.height = "";
      textArea.style.height = textArea.scrollHeight + "px";
    });

    const postButtonsContainer = document.getElementById(
      "postButtonsContainer"
    );

    textArea.addEventListener("focus", (event) => {
      postButtonsContainer.style.display = "block";
    });

    postButtonsContainer.addEventListener("blur", (event) => {
      postButtonsContainer.style.display = "none";
    });
  }, []);

  function handleClickUploadBtn(e, element) {
    // if (e.target != element) {
    //   e.stopPropagation();
    //   return;
    // }
    document.getElementById("imageUpload").click();
  }

  function handleUploadPost() {
    const collectionRef = projectFirestore.collection("posts");
    const post = postText.trim();
    const createdAt = timestamp();
    const images = urls;

    collectionRef
      .add({ post, createdAt, images: images })
      .catch((err) => setError(err.message));

    // Clear state
    setFileArray([]);
    setUrls([]);
    setImages([]);
    setPostText("");
    setLoading(false);
    document.getElementById("postText").style.height = "54px";
    document.getElementById("postForm").reset();
  }

  const handleUpload = (e) => {
    setError("");
    e.preventDefault();

    setLoading(true);

    const promises = [];

    // If Images were upload (with or no post text).
    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const uploadTask = projectStorage
          .ref(`images/${images[i].name}`)
          .put(images[i]);
        promises.push(uploadTask);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(progress);
          },
          (error) => {
            setError(error);
          },
          async () => {
            await projectStorage
              .ref("images")
              .child(images[i].name)
              .getDownloadURL()
              .then((url) => {
                urls.push(url);
                if (urls.length === images.length && urls.length > 0) {
                  handleUploadPost();
                }
              });
          }
        );
      }

      Promise.all(promises)
        .then(() => {})
        .catch((err) => console.log(err));
    }

    // If only post text.
    if (images.length <= 0 && postText.trim() !== "") {
      handleUploadPost();
    }
  };

  //   function handlePostSubmit(e) {
  //     setError("");
  //     e.preventDefault();

  //     if (
  //       (postRef.current.value && postRef.current.value.trim() !== "") ||
  //       fileArray !== []
  //     ) {
  //       // references
  //       const collectionRef = projectFirestore.collection("posts");
  //       const post = postRef.current.value;
  //       const createdAt = timestamp();
  //       const images = urls;
  //       collectionRef
  //         .add({ post, createdAt, images })
  //         .catch((err) => setError(err.message));
  //     }

  // console.log(files);
  // setFileArray([]);
  //   }

  function uploadMultipleFiles(e) {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];

      if (newImage && imageTypes.includes(newImage.type)) {
        newImage["id"] = Math.random();
        setFileArray((prevState) => [
          ...prevState,
          URL.createObjectURL(newImage),
        ]);
        images.push(newImage);
        // setImages((prevState) => [...prevState, newImage]);
        setError("");
      } else {
        setError("Please select an image file (png or jpg)");
        return;
      }
    }
  }

  return (
    <>
      <Form onSubmit={handleUpload} id="postForm">
        <Form.Group controlId="exampleForm.ControlTextarea1" className="mb-0">
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
              id="postText"
              className="shadow-none animated new-post-textarea rounded-0 border-bottom-0"
              onChange={(e) => setPostText(e.target.value)}
              value={postText}
            />

            <div className="form-group multi-preview mb-0" id="multiPreview">
              {(fileArray || []).map((url) => (
                <div className="preview-img-div" key={url}>
                  <img src={url} alt="..." />
                </div>
              ))}
            </div>

            <Container
              className="post-buttons-container hidden mb-0"
              id="postButtonsContainer"
            >
              <Row>
                <Col className="px-0">
                  <div className="mt-0">
                    <Button
                      type="button"
                      variant="light"
                      data-view-component="true"
                      className="btn-sm text-reset text-decoration-none shadow-none w-100 post-buttons-1"
                    >
                      🙂
                    </Button>
                  </div>
                </Col>
                <Col className="px-0">
                  <div className="mt-0">
                    <Button
                      type="button"
                      variant="light"
                      data-view-component="true"
                      className="btn-sm text-reset text-decoration-none shadow-none w-100 post-buttons-2"
                    >
                      📹
                    </Button>
                  </div>
                </Col>
                <Col className="px-0">
                  <div className="mt-0">
                    <label className="camera-icon-btn">
                      <input
                        type="file"
                        className="form-control"
                        id="imageUpload"
                        onChange={uploadMultipleFiles}
                        multiple
                      />

                      <Button
                        data-view-component="true"
                        className="btn btn-light btn-sm text-reset text-decoration-none shadow-none w-100 post-buttons-3"
                        onClick={handleClickUploadBtn}
                      >
                        📷
                      </Button>
                    </label>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </Form.Group>
        {loading && <ProgressBar progress={progress} />}
        <div className="hidden">
          <Picker
            onEmojiClick={onEmojiClick}
            disableAutoFocus={true}
            skinTone={SKIN_TONE_MEDIUM_DARK}
            groupNames={{ smileys_people: "PEOPLE" }}
            native
          />
        </div>
        <Button
          disabled={postText.length === 0 && images.length === 0}
          variant="primary"
          type="submit"
          block={true.toString()}
          className="mt-2 inline-block"
        >
          {loading ? (
            <div className="box">
              <div className="card1"></div>
              <div className="card2"></div>
              <div className="card3"></div>
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </Form>
    </>
  );
}
