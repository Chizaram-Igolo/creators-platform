import React from "react";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import SideBar from "./SideBar";

export default function LeftSideBarSettings() {
  const subroutes = [
    { name: "Profile", route: "/settings" },
    { name: "Account", route: "/settings/account" },
    { name: "Preferences", route: "/settings/preferences" },
    { name: "Payment/Billing", route: "/settings/payment" },
    { name: "Privacy", route: "/settings/privacy" },
    { name: "Security", route: "/settings/security" },
  ];

  return (
    <SideBar>
      <div className="pt-2 pt-md-3">
        <Nav defaultActiveKey="/" className="clearfix flex flex-column">
          {/* <p className="mt-0">Settings</p> */}

          <ul>
            {subroutes.map((item) => (
              <Link
                to={item.route}
                className="nav-link text-decoration-none semi-bold-text"
                role="button"
                style={{
                  fontSize: "1.2em",
                  color: "#333",
                }}
              >
                {/* {item.route === "/settings" && (
                    <>
                      <FontAwesomeIcon icon={faCarCrash} />
                      &nbsp;&nbsp;
                    </>
                  )}
                  {item.route === "/settings/payment" && (
                    <>
                      <FontAwesomeIcon icon={faCreditCard} />
                      &nbsp;&nbsp;
                    </>
                  )}
                  {item.route === "/settings/privacy" && (
                    <>
                      <FontAwesomeIcon icon={faLock} />
                      &nbsp;&nbsp;
                    </>
                  )} */}
                {item.name}
              </Link>
            ))}
          </ul>
        </Nav>
      </div>
    </SideBar>
  );
}
