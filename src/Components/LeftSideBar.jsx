import React, { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import { Link } from "react-router-dom";
import { SideBarSkeleton } from ".";
import { useAuth } from "../contexts/AuthContext";
import useGetRecommended from "../hooks/useGetRecommended";
import SideBarSubscriptionList from "./SideBarSubscriptionList";

export default function LeftSideBar() {
  const { user } = useAuth();
  const { recommendedUsers, loading, error } = useGetRecommended("users");
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    if (error) {
      // Send email with error details to developer.
    }
  }, [error]);

  useEffect(() => {
    if (user !== null && user.id !== null) {
      let filteredRecommended = recommendedUsers.filter(
        (item) => item.id !== user.uid
      );
      setRecommended(filteredRecommended);
    } else {
      setRecommended(recommendedUsers);
    }
  }, [user, recommendedUsers]);

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
            <Link
              to={`/${item.username}`}
              className="nav-link text-decoration-none"
              role="button"
              key={item.username}
            >
              @{item.username}
            </Link>
          ))}
      </Nav>
    </div>
  );
}
