import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import SideBar from "./SideBar";
// import { SideBarSkeleton } from ".";

export default function LeftSideBarSettings() {
  const subroutes = [
    { name: "Profile", route: "/settings" },
    { name: "Account", route: "/settings/account" },
    { name: "Appearance", route: "/settings/appearance" },
    { name: "Payment/Billing", route: "/settings/payment" },
    { name: "Privacy", route: "/settings/privacy" },
    { name: "Account Security", route: "/settings/security" },
  ];

  return (
    <SideBar>
      <div className="pt-2 pt-md-3">
        <Nav defaultActiveKey="/" className="clearfix flex flex-column">
          <p className="mt-0">Settings</p>

          <ul>
            {subroutes.map((item) => (
              <li key={item.route}>
                <Link
                  to={item.route}
                  className="nav-link text-decoration-none"
                  role="button"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </Nav>
      </div>
    </SideBar>
  );
}
