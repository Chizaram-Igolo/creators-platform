import React, { useState, useEffect, useRef } from "react";
import Button from "react-bootstrap/Button";

import "./styles/DropdownMenu.css";

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
          !event.target.classList.contains("top-menu-item")
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
    <div className="menu-button" style={{ position: "relative" }}>
      {props.icon && (
        <Button
          variant="light"
          data-view-component="true"
          className="btn-sm text-reset text-decoration-none shadow-none more-button"
          onClick={() => setOpen(!open)}
          ref={wrapperRef}
        >
          {props.icon}
        </Button>
      )}

      {open && props.children}
    </div>
  );
}

function DropdownItem(props) {
  function callHandlerFunction(e) {
    e.stopPropagation();
    props.handlerFunction();
  }

  return (
    <button
      type="button"
      className="btn btn-link text-reset text-decoration-none shadow-none top-menu-item"
      to={props.route}
      onClick={callHandlerFunction}
    >
      {props.children}
    </button>
  );
}

function Menu(props) {
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
  }, []);

  return (
    <div
      className="menu-dropdown"
      style={{ height: menuHeight }}
      ref={dropdownRef}
    >
      <div className="top-menu">
        {props.options.map((option, id) => (
          <DropdownItem key={id} handlerFunction={option.handlerFunction}>
            {option.option}
          </DropdownItem>
        ))}
      </div>
    </div>
  );
}

export default function DropDownMenu(props) {
  return (
    <NavItem icon={props.icon} id="collasible-nav-dropdown">
      <Menu options={props.options} />
    </NavItem>
  );
}
