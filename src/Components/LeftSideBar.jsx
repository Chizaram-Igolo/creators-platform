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
    <div className="pt-2 pt-md-5">
      <Nav defaultActiveKey="/" className="clearfix flex flex-column">
        {user !== null && user.id !== null && <SideBarSubscriptionList />}

        {loading && (
          <div className="mt-2 mb-5 pt-0 px-0">
            <SideBarSkeleton />
          </div>
        )}

        {!loading && recommended.length > 0 && (
          <p className="mt-3 ">Suggested channels</p>
        )}

        <ul>
          {!loading &&
            (recommended || []).map((item) => (
              <li key={item.username}>
                <Link
                  to={`/${item.username}`}
                  className="nav-link text-decoration-none"
                  role="button"
                >
                  @{item.username}
                </Link>
              </li>
            ))}
        </ul>
      </Nav>
    </div>
  );
}
