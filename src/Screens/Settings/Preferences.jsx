import React from "react";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { useAuth } from "../../contexts/AuthContext";

import "../styles/Signin.css";
import "./styles/Settings.css";
import { globalVars } from "../../global_vars";

export default function Preferences() {
  const { user } = useAuth();

  // function handleUpdateProfile() {}

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
              <Link to="/profile" className="text-decoration-none">
                Back to profile
              </Link>
            </div>
            <p className="mb-5">
              Choose how {globalVars.name} looks to you. Select a single theme,
              or sync with your system and automatically switch between day and
              night themes.
            </p>
            <Form.Group>
              <div
                class="d-flex gutter-condensed flex-wrap"
                role="radiogroup"
                aria-label="Single theme picker"
              >
                <div class="position-relative mb-3 flex-shrink-0 col-6 col-md-6 px-0 mr-0">
                  <input
                    class="position-absolute"
                    id="option-light"
                    type="radio"
                    name="user_theme"
                    data-type="light"
                    data-mode="light"
                    value="light"
                    style={{
                      position: "absolute",
                      zIndex: 5,
                      bottom: "12px",
                      left: "19px",
                    }}
                    data-action="click:appearance-form#themeClicked"
                    data-throttled-autosubmit=""
                  />
                  <label
                    class="radio-label pl-0 pr-0 pt-0 pb-2 overflow-hidden hx_theme-toggle width-full bold-text"
                    for="option-light"
                  >
                    <img
                      alt=""
                      class="d-block border-bottom mb-2 width-full"
                      src="https://github.githubassets.com/images/modules/settings/color_modes/light_preview.svg"
                    />
                    <span class="ml-5">Light Theme</span>
                  </label>
                </div>
                <div class="position-relative mb-3 flex-shrink-0 col-6 col-md-6 pl-0">
                  <input
                    class="position-absolute"
                    id="option-dark"
                    type="radio"
                    name="user_theme"
                    data-type="dark"
                    data-mode="dark"
                    value="dark"
                    checked=""
                    style={{
                      position: "absolute",
                      zIndex: 5,
                      bottom: "12px",
                      left: "19px",
                    }}
                    data-action="click:appearance-form#themeClicked"
                    data-throttled-autosubmit=""
                  />
                  <label
                    class="radio-label pl-0 pr-0 pt-0 pb-2 overflow-hidden hx_theme-toggle width-full bold-text"
                    for="option-dark"
                  >
                    <img
                      alt=""
                      class="d-block border-bottom mb-2 width-full"
                      src="https://github.githubassets.com/images/modules/settings/color_modes/dark_preview.svg"
                    />
                    <span class="ml-5">Dark Theme</span>
                  </label>
                </div>
              </div>
            </Form.Group>
          </div>
        </Form>
      </div>
    </>
  );
}
