import React, { useState } from "react";
import Resizer from "react-image-file-resizer";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import { useAuth } from "../contexts/AuthContext";

import { Alert, AlertTitle } from "@material-ui/lab";
import Button from "@material-ui/core/Button";

import Form from "react-bootstrap/Form";

import { Toast } from ".";

import "./styles/ProfileHeader.css";
import { projectFirestore, projectStorage } from "../firebase/config";
import { useToasts } from "react-toast-notifications";

import AvatarComponent from "./AvatarComponent";

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

export default function ProfileHeader({ userDetails }) {
  const { addToast } = useToasts();

  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const types = ["image/png", "image/jpeg"];

  async function handleSendEmailVerification() {
    await user.sendEmailVerification();
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

                await projectFirestore
                  .collection("users")
                  .doc(user.uid)
                  .update({
                    photoURL: url,
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

  return (
    <div className="px-2 pt-5">
      <Form className="d-flex flex-row justify-content-between img-form pt-0 pb-0">
        <div className="img-grid p-0">
          {/* <div className="img-wrap border-50">
            <div
              className="user-profile-img-wrap img"
              style={{ background: `url(${userDetails.photoURL})` }}
            ></div>
          </div> */}

          <AvatarComponent
            imgSrc={userDetails.photoURL}
            displayName={userDetails?.username?.toLocaleUpperCase()}
            size="large"
            showOnlineStatus={userDetails.showOnlineStatus}
            avatarColour={userDetails.avatarColour}
          />

          {/* <label
            disabled={true}
            style={{
              background: isUploading ? "#dddddd" : "#efb6b2",
              border: isUploading ? "1px solid #dddddd" : "1px solid #efb6b2",
            }}
          >
            <input
              type="file"
              onChange={handleUpdateProfile}
              accept="image/x-png,image/jpeg"
              disabled={isUploading}
            />
            <span style={{ fontSize: "16px" }}>
              <FontAwesomeIcon icon={faUpload} color="white" />
            </span>
          </label> */}
        </div>
        {/* <div className="d-flex align-items-end">
          <Link to="/create" className="text-decoration-none btn btn-primary">
            Create Content &nbsp;
            <span style={{ fontSize: "1em" }}>
              <FontAwesomeIcon icon={faPlus} />
            </span>
          </Link>
        </div> */}
      </Form>
      <div className="pt-2">
        {userDetails.channelName && (
          <p className="mt-2 mb-1">
            <span className="bold-text">{userDetails.channelName}</span>
          </p>
        )}

        {userDetails.username && (
          <p>
            <span className="semi-bold-text">@{userDetails.username}</span>
            &nbsp;
            {user?.emailVerified ||
              (true && (
                <>
                  {/* <span>
                  <VerifiedUser />{" "}
                </span> */}
                  <span
                    class="material-icons"
                    style={{
                      position: "relative",
                      top: "4px",
                      color: "green",
                      fontSize: "1.2em",
                    }}
                  >
                    verified
                  </span>
                  &nbsp;
                </>
              ))}
            {userDetails.showLastSeenDate && (
              <>
                <span>•</span>
                <Form.Text style={{ display: "inline" }}>
                  &nbsp; Last seen{" "}
                  <Moment fromNow>{user?.metadata?.lastSignInTime}</Moment>
                  <br />
                </Form.Text>
              </>
            )}
          </p>
        )}

        {/* {userDetails.username === user?.displayName && !user?.emailVerified && (
          <Alert
            severity="info"
            action={
              <Button
                color="inherit"
                size="medium"
                onClick={() => handleSendEmailVerification()}
              >
                Send Verification Email
              </Button>
            }
            style={{ fontSize: "1em" }}
          >
            Verify your email address to begin posting.
          </Alert>
        )} */}

        {userDetails.bio && (
          <p className="preformatted-text">{userDetails.bio}</p>
        )}
      </div>

      {isUploading && (
        <div
          style={{
            width: 134,
            height: 134,
            position: "absolute",
            top: "40px",
            left: "1px",
            zIndex: 100,
          }}
        >
          <CircularProgressbar value={progress} strokeWidth={3} />
        </div>
      )}
    </div>
  );
}
