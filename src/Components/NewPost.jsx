import React, { useState, useRef, useEffect } from "react";
import Picker, { SKIN_TONE_MEDIUM_DARK } from "emoji-picker-react";
import { projectFirestore, timestamp } from "../firebase/config";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";

import { ProgressBar } from ".";

import "./NewPost.css";

export default function NewPost() {
  const postRef = useRef();

  const [error, setError] = useState("");

  const [fileObj, setFileObj] = useState([]);
  const [fileArray, setFileArray] = useState([]);
  const [files, setFiles] = useState(null);

  const [file, setFile] = useState(null);

  const imageTypes = ["image/png", "image/jpeg", "image/jpg"];

  const [chosenEmoji, setChosenEmoji] = useState(null);

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);

    const textArea = document.querySelector("textarea");
    textArea.value += emojiObject.emoji;
    console.log(chosenEmoji);
    console.log(textArea.innerText);
  };

  //   const [loading, setLoading] = useState(false);

  useEffect(() => {
    postRef.current.addEventListener("input", (event) => {
      const textArea = document.querySelector("textarea");
      textArea.style.height = "";
      textArea.style.height = textArea.scrollHeight + "px";
    });

    postRef.current.addEventListener("focus", (event) => {
      const postButtonsContainer = document.getElementById(
        "postButtonsContainer"
      );
      postButtonsContainer.style.display = "block";
    });

    const postButtonsContainer = document.getElementById(
      "postButtonsContainer"
    );

    postButtonsContainer.addEventListener("blur", (event) => {
      postButtonsContainer.style.display = "none";
    });
  }, []);

  async function handleSubmitPost(e) {
    setError("");
    e.preventDefault();

    if (postRef.current.value && postRef.current.value.trim() !== "") {
      // references
      const collectionRef = projectFirestore.collection("posts");

      const post = postRef.current.value;
      const comments = [];
      const createdAt = timestamp();
      collectionRef
        .add({ post, createdAt, comments })
        .catch((err) => setError(err.message));
    }

    console.log(files);
    setFileArray([]);
  }

  function uploadMultipleFiles(e) {
    // fileObj.push(e.target.files);
    // for (let i = 0; i < fileObj[0].length; i++) {
    //   fileArray.push(URL.createObjectURL(fileObj[0][i]));
    // }
    // setFiles({ file: fileArray });
    // setFileObj([]);

    let selected = e.target.files[0];

    if (selected && imageTypes.includes(selected.type)) {
      setFile(selected);
      setError("");
    } else {
      setFile(null);
      setError("Please select an image file (png or jpg)");
    }

    console.log(selected);
  }

  return (
    <>
      <Form onSubmit={handleSubmitPost}>
        <Form.Group controlId="exampleForm.ControlTextarea1 mb-0 pb-0">
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
              ref={postRef}
              rows={1}
              role="textarea"
              className="shadow-none animated new-post-textarea rounded-0 border-bottom-0"
            />

            <div className="form-group multi-preview mb-0" id="multiPreview">
              {(fileArray || []).map((url) => (
                <div className="preview-img-div">
                  <img src={url} alt="..." key={url} />
                </div>
              ))}
            </div>

            {/* <div class="text-area icon-example w-100 rounded"></div> */}
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
                      {/* <MoodSmile size={24} strokeWidth={2} color={"white"} /> */}
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
                      {/* <DeviceComputerCamera
                        size={24}
                        strokeWidth={2}
                        color={"white"}
                      /> */}
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
                        onChange={uploadMultipleFiles}
                        multiple
                      />

                      <span
                        data-view-component="true"
                        className="btn btn-light btn-sm text-reset text-decoration-none shadow-none w-100 post-buttons-3"
                      >
                        {/* <Camera size={24} strokeWidth={2} color={"white"} /> */}
                        📷
                      </span>
                    </label>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </Form.Group>
        {file && <ProgressBar file={file} setFile={setFile} />}
        <div className="hidden">
          <Picker
            onEmojiClick={onEmojiClick}
            disableAutoFocus={true}
            skinTone={SKIN_TONE_MEDIUM_DARK}
            groupNames={{ smileys_people: "PEOPLE" }}
            native
          />
          {/* {chosenEmoji && <EmojiData chosenEmoji={chosenEmoji} />} */}
        </div>
        <Button
          disabled={false}
          variant="primary"
          type="submit"
          block={true.toString()}
          className=""
        >
          {false ? "Loading" : "Submit"}
        </Button>
      </Form>
    </>
  );
}
