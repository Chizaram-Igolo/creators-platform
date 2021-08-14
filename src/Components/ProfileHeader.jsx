import React, { useState } from "react";
import Resizer from "react-image-file-resizer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import Moment from "react-moment";
import { useAuth } from "../contexts/AuthContext";

import Form from "react-bootstrap/Form";

import { Toast } from ".";

import "./styles/ProfileHeader.css";
import { projectFirestore, projectStorage } from "../firebase/config";
import { useToasts } from "react-toast-notifications";

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

export default function ProfileHeader() {
  const { addToast } = useToasts();

  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const types = ["image/png", "image/jpeg"];

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
    <div>
      <Form className="d-flex flex-row justify-content-between img-form pt-3 pb-0">
        <div className="img-grid">
          <div className="img-wrap border-50">
            <div
              className="user-profile-img-wrap img"
              style={{ background: `url(${user.photoURL})` }}
            ></div>
          </div>
          <label
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
          </label>
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
      <div className="pt-4">
        {user.displayName && (
          <p>
            <span className="bold-text">@{user.displayName}</span> • &nbsp;
            <span>
              Last seen{" "}
              <Moment fromNow>{user?.metadata?.lastSignInTime}</Moment>
            </span>
          </p>
        )}

        {/* <Link to="/settings">Settings</Link> */}
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