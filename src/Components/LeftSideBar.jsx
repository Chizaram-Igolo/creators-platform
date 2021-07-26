import React from "react";
import { useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { Toast } from ".";
import { useAuth } from "../contexts/AuthContext";
import useGetRecommended from "../hooks/useGetRecommended";
import SideBarSubscriptionList from "./SideBarSubscriptionList";

export default function LeftSideBar() {
  const { user } = useAuth();
  const { addToast } = useToasts();
  const { recommendedUsers, error } = useGetRecommended("users");

  let recommended;

  if (user !== null && user.id !== null) {
    recommended = recommendedUsers.filter((item) => item.id !== user.uid);
  } else {
    recommended = recommendedUsers;
  }

  useEffect(() => {
    if (error) {
      addToast(<Toast body={error} />, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }, [error, addToast]);

  return (
    <div className="pt-5">
      <Nav
        defaultActiveKey="/"
        className="flex-column fixed-position d-none d-md-block"
      >
        {user !== null && user.id !== null && <SideBarSubscriptionList />}
        <p></p>

        {recommended.length > 0 && <p>Suggested</p>}
        {(recommended || []).map((item) => (
          <Link to="/" className="nav-link" role="button">
            @{item.username}
          </Link>
        ))}
      </Nav>
    </div>
  );
}
