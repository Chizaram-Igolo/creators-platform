import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { Toast, SideBarSkeleton } from ".";
import { useAuth } from "../contexts/AuthContext";
import useGetRecommended from "../hooks/useGetRecommended";
import SideBarSubscriptionList from "./SideBarSubscriptionList";

export default function LeftSideBar() {
  const { user } = useAuth();
  const { addToast } = useToasts();
  const [loading, setLoading] = useState(true);
  const { recommendedUsers, error } = useGetRecommended("users");

  let recommended = [];

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

  useEffect(() => {
    if (recommended !== null && recommended.length > 0) {
      setLoading(false);
    }
  }, [recommended]);

  return (
    <div className="container pt-5">
      <Nav
        defaultActiveKey="/"
        className="flex-column fixed-position d-none d-md-block container col-md-3"
      >
        {user !== null && user.id !== null && <SideBarSubscriptionList />}
        <p></p>

        {loading && (
          <div className="mt-2 mb-5 pt-0 px-0 col-6">
            <SideBarSkeleton />
          </div>
        )}

        {!loading && recommended.length > 0 && <p>Suggested channels</p>}
        {!loading &&
          (recommended || []).map((item) => (
            <Link to="/" className="nav-link" role="button">
              @{item.username}
            </Link>
          ))}
      </Nav>
    </div>
  );
}
