import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Resizer from "react-image-file-resizer";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import InputGroup from "react-bootstrap/InputGroup";
import { useAuth } from "../../contexts/AuthContext";

import "../styles/Signin.css";
import { AlertMessage, Toast } from "../../Components";
import {
  dbTimestamp,
  projectDatabase,
  projectStorage,
} from "../../firebase/config";
import Moment from "react-moment";
import { Alert, AlertTitle } from "@material-ui/lab";
import WarningOutlined from "@material-ui/icons/WarningOutlined";
import AvatarComponent from "../../Components/AvatarComponent";

import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import { useToasts } from "react-toast-notifications";

import "./styles/Settings.css";
import { CircularProgressbar } from "react-circular-progressbar";

// import { ReactImgInput } from "react-img-input";
// import "react-img-input/dist/index.css";

const imageResizer = (file, size, imageType) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      size,
      size,
      imageType,
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "blob"
    );
  });

export default function Account() {
  const {
    user,
    userProfile,
    updateProfile,
    deleteAccount,
    reauthenticateUser,
  } = useAuth();

  const [username, setUsername] = useState(user?.displayName);
  const [reAuthPassword, setReAuthPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [reAuthError, setReAuthError] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  const [showUsernameField, setShowUsernameField] = useState(false);
  const [updateType, setUpdateType] = useState("");
  const [deleteWarning, setDeleteWarning] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("Confirm");

  const history = useHistory();

  const { addToast } = useToasts();

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const types = ["image/png", "image/jpeg"];

  // const config = {
  //   size: 120,
  //   captureBtn: {
  //     bg: "#007bff",
  //     color: "#fff",
  //     onclick: () => alert("hi"),
  //   },
  //   cropBtn: {
  //     bg: "#F4B230",
  //     color: "#fff",
  //   },
  //   defaultImg: userProfile?.photoURL || user.photoURL || "",
  //   theme: "dark",
  //   compression: {
  //     maxSizeMB: 0.1,
  //     maxWidthOrHeight: 500,
  //     useWebWorker: true,
  //   },
  // };

  async function handleUpdateProfilePic(passedBase64) {
    let img = {};

    img["name"] = "profile_img.png";
    img["blob"] = passedBase64;

    await projectStorage
      .ref(`user_images/${user.uid}`)
      .listAll()
      .then((listResults) => {
        const promises = listResults.items.map((item) => {
          return item.delete();
        });
        Promise.all(promises);
      });

    console.log(img["blob"].split(/,(.+)/)[1]);

    let uploadImageTask = projectStorage
      .ref(`user_images/${user.uid}/${img.name}`)
      .put(img["blob"].split(/,(.+)/)[1], {
        contentType: img["blob"].split(";")[0].split(":")[1],
      });

    setIsUploading(true);

    uploadImageTask.on(
      "state_changed",
      (snapshot) => {
        let percentage = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(percentage);
      },
      (err) => {
        addToast(<Toast body="Sorry, the image could not be uploaded." />, {
          appearance: "error",
          autoDismiss: true,
        });
      },
      () => {
        uploadImageTask.snapshot.ref.getDownloadURL().then((url) => {
          user
            .updateProfile({ photoURL: url })
            .then(async () => {
              addToast(<Toast body="Your profile image was updated." />, {
                appearance: "success",
                autoDismiss: true,
              });

              setIsUploading(false);
              setProgress(0);

              await projectDatabase.ref(`users/${user.uid}`).update({
                photoURL: url,
                lastProfilePicChangeDate: dbTimestamp,
              });
            })
            .catch((err) => {
              addToast(
                <Toast body="Sorry, the image could not be uploaded." />,
                {
                  appearance: "error",
                  autoDismiss: true,
                }
              );

              setIsUploading(false);
              setProgress(0);
              uploadImageTask.cancel();
            });
        });
      }
    );
  }

  async function handleUpdateProfile(e) {
    let selectedImage = e.target.files[0];

    if (selectedImage && types.includes(selectedImage.type)) {
      // setFile(selected);

      let imageType = selectedImage.type.split("/").slice(-1);
      if (imageType === "JPG") {
        imageType = "JPEG";
      }

      const img = await imageResizer(selectedImage, 240, imageType);
      img["name"] = selectedImage["name"];

      await projectStorage
        .ref(`user_images/${user.uid}`)
        .listAll()
        .then((listResults) => {
          const promises = listResults.items.map((item) => {
            return item.delete();
          });
          Promise.all(promises);
        });

      let uploadImageTask = projectStorage
        .ref(`user_images/${user.uid}/${img.name}`)
        .put(img, { contentType: img.type });

      setIsUploading(true);

      uploadImageTask.on(
        "state_changed",
        (snapshot) => {
          let percentage = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(percentage);
        },
        (err) => {
          addToast(<Toast body="Sorry, the image could not be uploaded." />, {
            appearance: "error",
            autoDismiss: true,
          });
        },
        () => {
          uploadImageTask.snapshot.ref.getDownloadURL().then((url) => {
            user
              .updateProfile({ photoURL: url })
              .then(async () => {
                addToast(<Toast body="Your profile image was updated." />, {
                  appearance: "success",
                  autoDismiss: true,
                });

                setIsUploading(false);
                setProgress(0);

                await projectDatabase.ref(`users/${user.uid}`).update({
                  photoURL: url,
                  lastProfilePicChangeDate: dbTimestamp,
                });
              })
              .catch((err) => {
                addToast(
                  <Toast body="Sorry, the image could not be uploaded." />,
                  {
                    appearance: "error",
                    autoDismiss: true,
                  }
                );

                setIsUploading(false);
                setProgress(0);
                uploadImageTask.cancel();
              });
          });
        }
      );
    }
  }

  const lastUsernameChangeDateDiff =
    (Date.now() - userProfile?.lastUsernameChangeDate) / (1000 * 60 * 60 * 24);

  const lastProfilePicChangeDateDiff =
    (Date.now() - userProfile?.lastProfilePicChangeDate) /
    (1000 * 60 * 60 * 24);

  let anchorElem;

  if (lastProfilePicChangeDateDiff > 30) {
  } else {
    anchorElem = (
      <label
        disabled={true}
        style={{
          background: "#eeeeee",
          border: "#eeeeee",
        }}
        className="profile-pic-upload-label clickable"
        id="uploadLabel"
      >
        <input
          type="file"
          onChange={handleUpdateProfile}
          accept="image/x-png,image/jpeg"
          disabled={isUploading}
          className="profile-pic-upload-btn"
        />
        <IconButton
          aria-label="change profile picture"
          onClick={() => {
            document.getElementById("uploadLabel").click();
          }}
        >
          <Edit className="clickable" />
        </IconButton>
      </label>
    );
  }

  const [show, setShow] = useState(false);

  function clearMessages() {
    setMessage("");
    setError("");
  }

  const handleClose = () => {
    setShow(false);
    setReAuthPassword("");
    setReAuthError("");
    setModalLoading(false);
    setUpdateType("");
    setDeleteWarning("");
    setDeleteConfirmText("Confirm");
    setLoading(false);
  };

  const handleShow = () => setShow(true);

  async function handleReauthenticateUser(e) {
    e.preventDefault();

    setReAuthError("");

    try {
      setModalLoading(true);
      await reauthenticateUser(user.email, reAuthPassword);

      if (updateType === "update-profile") {
        doUpdateProfile();
      } else if (updateType === "delete-account") {
        doDeleteAccount();
      }
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setReAuthError(
          "This password is invalid, please enter the correct password."
        );
        setModalLoading(false);
        return;
      }
    }
  }

  const doUpdateProfile = () => {
    // Validation

    const promises = [];
    setLoading(true);
    setError("");

    if (username && username !== user.displayName) {
      promises.push(updateProfile({ displayName: username }));
      promises.push(
        projectDatabase
          .ref(`users/${user.uid}`)
          .update({ username: username, lastUsernameChangeDate: dbTimestamp })
      );
    }

    Promise.all(promises)
      .then(() => {
        setMessage("Your profile was updated successfully.");
        handleClose();
        setShowUsernameField(false);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const doDeleteAccount = async () => {
    await deleteAccount();
    history.push("/");
  };

  function handleSubmit(e) {
    e.preventDefault();
    setUpdateType("update-profile");
    handleShow(true);
  }

  function handleDeleteAccount() {
    setDeleteWarning("Once you delete your account, it can't be undeleted.");
    setDeleteConfirmText("Delete Account");
    setUpdateType("delete-account");
    handleShow(true);
  }

  return (
    <>
      <div className="pt-4 px-2 mb-5">
        <div className="pt-2 mb-5">
          <div className="d-flex flex-row justify-content-between pb-1 mb-4 border-bottom">
            <h5 className="mb-3">Change your account information</h5>
            <Link to={`/${user.displayName}`} className="text-decoration-none">
              Back to wall
            </Link>
          </div>

          <p>
            For security reasons, you may only change your username or profile
            picture once every month.
          </p>

          <Form.Label className="semi-bold-text">Profile Picture</Form.Label>

          <Form.Text className="text-muted mb-2">
            {userProfile !== null && userProfile.lastProfilePicChangeDate && (
              <>
                Last changed{" "}
                <Moment fromNow>
                  {userProfile.lastProfilePictureChangeDate}
                </Moment>
                .
              </>
            )}
          </Form.Text>

          {/* <ReactImgInput config={config} setOutput={handleUpdateProfilePic} /> */}

          <Form className="vertical-center" onSubmit={handleSubmit}>
            {error && (
              <AlertMessage
                message={error}
                severity="error"
                isOpen={error.length > 0}
                clearMessages={clearMessages}
              />
            )}

            {message && (
              <AlertMessage
                message={message}
                severity="success"
                isOpen={message.length > 0}
                clearMessages={clearMessages}
              />
            )}

            <div className="position-relative" style={{ width: "114px" }}>
              <AvatarComponent
                imgSrc={user.photoURL}
                displayName={userProfile?.username?.toLocaleUpperCase()}
                size="large"
                avatarColour={userProfile?.avatarColour}
                showOnlineStatus={false}
                anchorElement={anchorElem}
              />

              {isUploading && (
                <div
                  style={{
                    position: "absolute",
                    top: "-1px",
                    left: "-1px",
                    width: 116,
                    height: 116,
                  }}
                >
                  <CircularProgressbar value={progress} strokeWidth={3} />
                </div>
              )}
            </div>

            <Form.Group className="mt-4">
              <Form.Label className="semi-bold-text">Username</Form.Label>

              <Form.Text className="text-muted mb-2">
                {userProfile !== null && userProfile.lastUsernameChangeDate && (
                  <>
                    Last changed{" "}
                    <Moment fromNow>
                      {userProfile.lastUsernameChangeDate}
                    </Moment>
                    .
                  </>
                )}
              </Form.Text>
              <p>
                <Button
                  disabled={lastUsernameChangeDateDiff < 30}
                  variant="primary"
                  type="button"
                  className="btn-sm inline-block semi-bold-text rounded-lg"
                  style={{ letterSpacing: "0.82px" }}
                  onClick={() => setShowUsernameField(true)}
                >
                  Change Username
                </Button>
              </p>
            </Form.Group>

            {showUsernameField && (
              <Form.Group>
                <Form.Label className="semi-bold-text">Username</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text id="btnGroupAddon">@</InputGroup.Text>

                  <Form.Control
                    type="text"
                    placeholder="Username"
                    value={username}
                    defaultValue={user?.displayName}
                    onChange={(e) => setUsername(e.target.value)}
                    // isInvalid={confirmPassError.length > 0}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please choose a username.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            )}

            <div className="d-flex flex-row justify-content-end">
              <Button
                disabled={loading || username === user.displayName}
                variant="primary"
                type="submit"
                className="btn-sm inline-block semi-bold-text rounded-lg"
                style={{ letterSpacing: "0.82px" }}
              >
                {loading ? (
                  <div className="box">
                    <div className="card1"></div>
                    <div className="card2"></div>
                    <div className="card3"></div>
                  </div>
                ) : (
                  "Update profile"
                )}
              </Button>
            </div>
          </Form>
        </div>

        <Form className="vertical-center" onSubmit={handleSubmit}>
          <div>
            <div className="d-flex flex-row justify-content-between pb-1 mb-4 border-bottom">
              <h5 className="mb-3 text-danger">Delete Your Account</h5>
            </div>
            <p>
              Deleting your account means your profile and all your content will
              be erased permanently. Only proceed if you are sure.
            </p>

            <div className="d-flex flex-row justify-content-end">
              <Button
                variant="outline-danger"
                type="button"
                onClick={() => handleDeleteAccount()}
                className="rounded-lg"
              >
                Delete your Account
              </Button>
            </div>
          </div>
        </Form>

        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title className="px-2" style={{ fontSize: "1.4em" }}>
              Enter password to confirm
            </Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleReauthenticateUser}>
            <Modal.Body className="px-4">
              {deleteWarning && (
                // <p>
                //   <span className="bold-text">Warning: </span>
                //   {deleteWarning}
                // </p>

                <Alert
                  icon={<WarningOutlined fontSize="inherit" />}
                  severity="error"
                  style={{ fontSize: "1em" }}
                >
                  <AlertTitle>Warning</AlertTitle>
                  {deleteWarning}
                </Alert>
              )}
              <p className="mt-3">
                Please enter your current password to confirm this operation.
              </p>
              <Form.Group controlId="formBasicReAuthPassword">
                {/* <Form.Label>Password</Form.Label> */}
                <InputGroup hasValidation>
                  <Form.Control
                    type="password"
                    isInvalid={reAuthError.length > 0}
                    value={reAuthPassword}
                    placeholder="Your current password"
                    onChange={(e) => setReAuthPassword(e.target.value)}
                    style={{
                      borderTopRightRadius: "4px",
                      borderBottomRightRadius: "4px",
                    }}
                  />
                  <Form.Text id="passwordHelpBlock" muted></Form.Text>
                  <Form.Control.Feedback
                    type="invalid"
                    style={{ fontSize: "0.86em" }}
                  >
                    {reAuthError}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer style={{ backgroundColor: "#eeeeee" }}>
              <Button
                variant="secondary"
                className="btn-sm inline-block semi-bold-text"
                onClick={handleClose}
                style={{ letterSpacing: "1px" }}
              >
                Cancel
              </Button>
              <Button
                disabled={modalLoading || reAuthPassword === ""}
                variant={deleteWarning === "" ? "primary" : "danger"}
                type="submit"
                className="btn-sm inline-block semi-bold-text"
                style={{ letterSpacing: "1px" }}
              >
                {modalLoading ? (
                  <div className="box">
                    <div className="card1"></div>
                    <div className="card2"></div>
                    <div className="card3"></div>
                  </div>
                ) : (
                  deleteConfirmText
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    </>
  );
}
