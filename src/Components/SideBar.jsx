import React from "react";
import "./styles/SideBar.css";

export default function SideBar(props) {
  return <div className="pt-5">{props.children}</div>;
}
