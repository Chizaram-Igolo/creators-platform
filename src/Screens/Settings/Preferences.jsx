import React, { useState } from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";

import "../styles/Signin.css";
import "./styles/Settings.css";
import { globalVars } from "../../global_vars";
import { useAuth } from "../../contexts/AuthContext";

export default function Preferences({ setLightMode, setDarkMode }) {
  const { user } = useAuth();

  const [lightChecked, setLightChecked] = useState(false);
  const [darkChecked, setDarkChecked] = useState(false);

  // function handleUpdateProfile() {}

  function handleCheck(e) {
    if (e.target.id === "lightTheme") {
      setLightChecked(true);
      setDarkChecked(false);
      setLightMode();
    } else {
      setLightChecked(false);
      setDarkChecked(true);
      setDarkMode();
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <div className="pt-4 px-2 mb-5">
        <Form className="vertical-center" onSubmit={handleSubmit}>
          <div className="pt-2 mb-5">
            <div className="d-flex flex-row justify-content-between pb-1 mb-4 border-bottom">
              <h5 className="mb-3">Change Theme</h5>
              <Link
                to={`/${user.displayName}`}
                className="text-decoration-none"
              >
                Back to wall
              </Link>
            </div>
            <p className="mb-5">
              Choose how {globalVars.name} looks to you. Select a single theme,
              or sync with your system and automatically switch between day and
              night themes.
            </p>
            <Form.Group controlId="formBasicCheckbox">
              <div
                className="d-flex gutter-condensed flex-wrap clearfix"
                role="radiogroup"
                aria-label="Single theme picker"
              >
                <div className="position-relative mb-3 flex-shrink-0 col-6 col-md-6 px-0 mr-0 clickable">
                  <Form.Check
                    type="radio"
                    id="lightTheme"
                    className="semi-bold-text mt-3"
                    value="light"
                    checked={lightChecked}
                    style={{
                      position: "absolute",
                      zIndex: 5,
                      bottom: "16px",
                      left: "19px",
                    }}
                    custom
                    onChange={(e) => handleCheck(e)}
                  />
                  <label
                    className="radio-label pl-0 pr-0 pt-0 pb-2 overflow-hidden hx_theme-toggle width-full semi-bold-text"
                    htmlFor="lightTheme"
                  >
                    <img
                      alt=""
                      className="d-block border mb-2 width-full p-3 rounded"
                      src="https://github.githubassets.com/images/modules/settings/color_modes/light_preview.svg"
                      style={{ display: "inline-block" }}
                    />
                    <span className="ml-5" style={{ fontSize: "1.15em" }}>
                      Light Theme
                    </span>
                  </label>
                </div>

                <div className="position-relative mb-3 flex-shrink-0 col-6 col-md-6 pl-0 clickable">
                  <Form.Check
                    type="radio"
                    id="darkTheme"
                    className="semi-bold-text mt-3"
                    value="dark"
                    checked={darkChecked}
                    style={{
                      position: "absolute",
                      zIndex: 5,
                      bottom: "16px",
                      left: "19px",
                    }}
                    custom
                    onChange={(e) => handleCheck(e)}
                  />

                  <label
                    className="radio-label pl-0 pr-0 pt-0 pb-2 overflow-hidden hx_theme-toggle width-full semi-bold-text"
                    htmlFor="darkTheme"
                  >
                    <img
                      alt=""
                      className="d-block border mb-2 width-full p-3 rounded"
                      src="https://github.githubassets.com/images/modules/settings/color_modes/dark_preview.svg"
                      style={{ borderRadius: 8 }}
                    />
                    <span className="ml-5" style={{ fontSize: "1.15em" }}>
                      Dark Theme
                    </span>
                  </label>
                </div>
              </div>
            </Form.Group>

            <Form.Group
              controlId="exampleForm.ControlSelect1"
              style={{ width: "50%" }}
            >
              <Form.Label className="semi-bold-text">Language</Form.Label>
              <Form.Control as="select">
                <option>Arabic</option>
                <option>English</option>
                <option>Indonesian</option>
                <option>Spanish</option>
              </Form.Control>
            </Form.Group>
          </div>
        </Form>
      </div>
    </>
  );
}
