import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

import { ReactComponent as BellIcon } from "../assets/icons/bell.svg";
import { ReactComponent as CaretIcon } from "../assets/icons/caret.svg";

import { useAuth } from "../contexts/AuthContext";

import { SearchBar, AlertBox } from ".";

import { globalVars } from "../../src/global_vars";
import { BookData } from "../Data";

import "./styles/Header.css";

function App() {
  const history = useHistory();
  const { user, signout } = useAuth();

  return (
    <AppNavbar>
      <NavItem
        brand={
          <Navbar.Brand
            className="pointer-on-hover brand"
            onClick={() => history.push("/feed")}
          >
            {globalVars.name}
          </Navbar.Brand>
        }
      />
      <NavItem
        search={
          <div className="top-navbar-search-web d-none d-sm-block">
            {/* <Form>
              <FormControl
                type="text"
                placeholder="Search or jump to..."
                className="mr-sm-2 ml-2 d-none d-sm-block"
                style={{ width: 290, height: 30, fontSize: "0.92em" }}
              />
            </Form> */}

            <SearchBar placeholder="Search or jump to..." options={BookData} />
          </div>
        }
      />
      {/* <NavItem
        search={
          <div className="top-navbar-search-mobile">
            <Form>
              <FormControl
                type="text"
                placeholder="Search or jump to..."
                className="mr-sm-2 ml-2 d-block d-sm-none"
                style={{ width: 20, height: 30, fontSize: "0.92em" }}
              />
            </Form>
          </div>
        }
      /> */}
      <div className="top-navbar-links">
        {!user && <NavItem route="/signup" text="Sign up" />}

        {!user && <NavItem divider text="|" />}
        {!user && <NavItem route="/signin" text="Sign in" />}

        {user && (
          <>
            <NavItem icon={<BellIcon />} />
            <NavItem
              icon={
                <>
                  <img
                    src={user.photoURL}
                    alt={user.email[0]}
                    className="avatar"
                  />
                  <CaretIcon fontSize={8} />
                </>
              }
              id="collasible-nav-dropdown"
            >
              <DropdownMenu user={user} signout={signout}></DropdownMenu>
            </NavItem>
          </>
        )}
      </div>
    </AppNavbar>
  );
}

function AppNavbar(props) {
  return (
    <nav className="top-navbar fixed-position w-100 z-300 pl-xs-3 pr-xs-4 pl-md-4 pr-md-5">
      <ul className="top-navbar-nav pl-2">{props.children}</ul>
    </nav>
  );
}

function NavItem(props) {
  const [open, setOpen] = useState(false);

  function useOutsideFocus(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (
          ref.current &&
          !ref.current.contains(event.target) &&
          !event.target.classList.contains("top-menu-item") &&
          !event.target.classList.contains("color-text-secondary") &&
          !event.target.classList.contains("mb-0") &&
          !event.target.classList.contains("strong-signed-in-name")
        ) {
          setOpen(false);
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideFocus(wrapperRef);

  return (
    <li className="top-nav-item">
      {props.icon && (
        <button
          className="btn btn-link text-decoration-none text-reset shadow-none icon-button"
          onClick={() => setOpen(!open)}
          ref={wrapperRef}
        >
          {props.icon}
        </button>
      )}

      {props.route && (
        <Link className="top-navbar-link" to={props.route}>
          {props.text}
        </Link>
      )}

      {props.divider && (
        <span className="top-navbar-divider">{props.text}</span>
      )}

      {props.brand && (
        <Link className="top-navbar-brand" to="/">
          {props.brand}
        </Link>
      )}

      {props.search && props.search}

      {open && props.children}
    </li>
  );
}

function DropdownMenu(props) {
  const { user } = useAuth();
  const [error, setError] = useState("");
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  const history = useHistory();

  async function handleSignout() {
    setError("");
    try {
      await props.signout();
      history.push("/signin");
    } catch {
      setError("Failed to log out");
    }
  }

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
  }, []);

  // function calcHeight(el) {
  //   const height = el.offsetHeight;
  //   setMenuHeight(height);
  // }

  function DropdownItem(props) {
    if (props.handleSignout) {
      return (
        <span className="top-menu-item" onClick={handleSignout}>
          {props.children}
        </span>
      );
    } else {
      return (
        <Link className="top-menu-item" to={props.route}>
          {props.children}
        </Link>
      );
    }
  }

  return (
    <>
      {/* <div className="dropdown-arrow-head"></div> */}

      {props.user && (
        <>
          <div
            className="dropdown"
            style={{ height: menuHeight }}
            ref={dropdownRef}
          >
            <div className="top-menu">
              <DropdownItem route="/profile">
                <p className="color-text-secondary mb-0">
                  Signed in as
                  <br />
                  <strong className="strong-signed-in-name">
                    {user.displayName}
                  </strong>
                  {/* <span class="d-block ">Never used</span> */}
                </p>
              </DropdownItem>
              <NavDropdown.Divider />
              <DropdownItem route="/profile">Your profile</DropdownItem>
              <DropdownItem route="/feed">Your feed</DropdownItem>
              <DropdownItem route="/subscriptions">
                Your subscriptions
              </DropdownItem>
              <DropdownItem route="/posts">Your posts</DropdownItem>
              <DropdownItem route="/comments">Your comments</DropdownItem>
              <NavDropdown.Divider />
              <DropdownItem route="/help">Help</DropdownItem>
              <DropdownItem route="/settings">Settings</DropdownItem>
              <NavDropdown.Divider />
              <DropdownItem handleSignout={handleSignout}>
                Sign out
              </DropdownItem>
            </div>
          </div>

          <AlertBox error={error} />
        </>
      )}
    </>
  );
}

export default App;
