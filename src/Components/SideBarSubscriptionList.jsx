import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGetSubscriptions from "../hooks/useGetSubscriptions";
import { useAuth } from "../contexts/AuthContext";

export default function SideBarSubscriptionList() {
  const { user } = useAuth();
  const { subscriptions, error } = useGetSubscriptions("users", user.uid);

  useEffect(() => {
    if (error) {
      // Send email with error details to developer.
    }
  }, [error]);

  return (
    <>
      {subscriptions && subscriptions.length > 0 && <p>Your Subscriptions</p>}
      {(subscriptions || []).map((item) => (
        <Link to="/" className="nav-link" role="button" key={item}>
          {item}
        </Link>
      ))}
    </>
  );
}
