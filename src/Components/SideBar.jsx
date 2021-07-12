import React from "react";
import "./SideBar.css";

export default function SideBar(props) {
  return <div className="pt-5">{props.children}</div>;
}
