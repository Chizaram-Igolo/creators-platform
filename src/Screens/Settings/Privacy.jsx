import React, { useState } from "react";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useAuth } from "../../contexts/AuthContext";

import "../styles/Signin.css";
import { projectDatabase } from "../../firebase/config";
import { AlertMessage } from "../../Components";

export default function Privacy() {
  const { user, userProfile } = useAuth();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showOnlineStatus, setShowOnlineStatus] = useState(
    userProfile.showOnlineStatus
  );

  const [showSubscriberCount, setShowSubscriberCount] = useState(
    userProfile.showSubscriberCount
  );

  const [makeAccountDiscoverable, setMakeAccountDiscoverable] = useState(
    userProfile.makeAccountDiscoverable
  );

  const [showMediaCount, setShowMediaCount] = useState(
    userProfile.showMediaCount
  );

  const [showLastSeenDate, setShowLastSeenDate] = useState(
    userProfile.showLastSeenDate
  );

  function clearMessages() {
    setMessage("");
    setError("");
  }

  async function handleUpdateProfile(e) {
    e.preventDefault();

    setLoading(true);

    const prefsObj = {};

    if (showOnlineStatus !== userProfile.showOnlineStatus) {
      prefsObj["showOnlineStatus"] = showOnlineStatus;
    }
    if (showSubscriberCount !== userProfile.showSubscriberCount) {
      prefsObj["showSubscriberCount"] = showSubscriberCount;
    }
    if (makeAccountDiscoverable !== userProfile.makeAccountDiscoverable) {
      prefsObj["makeAccountDiscoverable"] = makeAccountDiscoverable;
    }
    if (showMediaCount !== userProfile.showMediaCount) {
      prefsObj["showMediaCount"] = showMediaCount;
    }
    if (showLastSeenDate !== userProfile.showLastSeenDate) {
      prefsObj["showLastSeenDate"] = showLastSeenDate;
    }

    await projectDatabase
      .ref(`users/${user.uid}`)
      .update(prefsObj)
      .then(() => {
        setLoading(false);
        setMessage("Your settings were saved");
      })
      .catch((err) => setError(err.message));
  }

  return (
    <>
      <div className="pt-4 px-2 mb-5">
        <Form className="vertical-center" onSubmit={handleUpdateProfile}>
          {/* <h3 className="mb-5 text-center">Profile</h3> */}

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

          <div className="pt-2 mb-5">
            <div className="d-flex flex-row justify-content-between pb-1 mb-4 border-bottom">
              <h5 className="mb-3">Privacy Settings</h5>
              <Link
                to={`/${user.displayName}`}
                className="text-decoration-none"
              >
                Back to wall
              </Link>
            </div>

            <Form.Group className="mb-3" controlId="formBasicCheckbox1">
              <Form.Check
                type="checkbox"
                label="Show online status"
                className="clickable"
                custom
                checked={showOnlineStatus}
                onClick={() =>
                  setShowOnlineStatus((showOnlineStatus) => !showOnlineStatus)
                }
              />
              <Form.Text className="text-muted">
                Hiding your online status will also prevent you from seeing
                other people's online status.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox2">
              <Form.Check
                type="checkbox"
                label="Show subscriber count"
                className="clickable"
                custom
                checked={showSubscriberCount}
                onClick={() =>
                  setShowSubscriberCount(
                    (showSubscriberCount) => !showSubscriberCount
                  )
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox3">
              <Form.Check
                type="checkbox"
                label="Make account discoverable in search"
                className="clickable"
                custom
                checked={makeAccountDiscoverable}
                onClick={() =>
                  setMakeAccountDiscoverable(
                    (makeAccountDiscoverable) => !makeAccountDiscoverable
                  )
                }
              />
              <Form.Text className="text-muted">
                Whether search results should include your account and your
                account's content.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox4">
              <Form.Check
                type="checkbox"
                label="Show media content count"
                className="clickable"
                custom
                checked={showMediaCount}
                onClick={() =>
                  setShowMediaCount((showMediaCount) => !showMediaCount)
                }
              />
              <Form.Text className="text-muted">
                A short summary of all your pictures, audio, videos on your
                profile banner
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox5">
              <Form.Check
                type="checkbox"
                label='Show "last seen" date'
                className="clickable"
                custom
                checked={showLastSeenDate}
                onClick={() =>
                  setShowLastSeenDate((showLastSeenDate) => !showLastSeenDate)
                }
              />
            </Form.Group>

            <div className="d-flex flex-row justify-content-end">
              <Button
                disabled={
                  loading ||
                  (showOnlineStatus === userProfile.showOnlineStatus &&
                    showSubscriberCount === userProfile.showSubscriberCount &&
                    makeAccountDiscoverable ===
                      userProfile.makeAccountDiscoverable &&
                    showMediaCount === userProfile.showMediaCount &&
                    showLastSeenDate === userProfile.showLastSeenDate)
                }
                variant="primary"
                type="submit"
                className="btn-sm inline-block semi-bold-text"
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
          </div>
        </Form>
      </div>
    </>
  );
}
