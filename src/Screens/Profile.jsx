import React, { useState } from "react";
import { Link } from "react-router-dom";
import Resizer from "react-image-file-resizer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
// import Button from "react-bootstrap/Button";

import { SideBar, Tab, Toast } from "../Components";

import "./styles/Profile.css";
import { projectStorage } from "../firebase/config";
import { useToasts } from "react-toast-notifications";

const tabContent = [
  { selector: "myPosts", heading: "My Posts", body: "My Posts" },
  { selector: "engagements", heading: "Engagements", body: "Engagements" },
];

const selectors = [tabContent.map((item) => item.selector)];

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

function Profile() {
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
              .then(() => {
                addToast(<Toast body="Your profile image was updated." />, {
                  appearance: "success",
                  autoDismiss: true,
                });

                setIsUploading(false);
                setProgress(0);
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
    <>
      <Container>
        <Row>
          <Col md={{ span: 3 }}>
            <SideBar>
              <Form className="img-form pb-0">
                <div className="img-grid">
                  <div className="img-wrap border-50">
                    <img src={user.photoURL} alt="" className="profile-img" />
                  </div>
                  <label
                    disabled={true}
                    style={{
                      background: isUploading ? "#dddddd" : "#efb6b2",
                      border: isUploading
                        ? "1px solid #dddddd"
                        : "1px solid #efb6b2",
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
              </Form>
              <div className="pt-4">
                <p>{user.email}</p>

                <Link to="/settings">Settings</Link>
              </div>

              {isUploading && (
                <div
                  style={{
                    width: 175,
                    height: 174,
                    position: "absolute",
                    top: "40px",
                    left: "8px",
                    zIndex: 100,
                  }}
                >
                  <CircularProgressbar value={progress} strokeWidth={3} />
                </div>
              )}
            </SideBar>
          </Col>

          <Col md={{ span: 7 }} className="px-0 pt-5">
            <div className="container pt-4 mb-5">
              <div className="d-flex justify-content-center row">
                <div className="col-md-12 px-2">
                  <div className="feed">
                    <div className="bg-white p-2 pt-0 pl-0 pr-1 pb-3  mb-3 no-hor-padding">
                      <Tab selectors={selectors} tabContent={tabContent} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </>
  );
}

export default Profile;
