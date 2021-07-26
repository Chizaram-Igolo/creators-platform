import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import useGetSubscriptions from "../hooks/useGetSubscriptions";
import { Toast } from ".";
import { useAuth } from "../contexts/AuthContext";

export default function SideBarSubscriptionList() {
  const { user } = useAuth();
  const { addToast } = useToasts();
  const { subscriptions, error } = useGetSubscriptions("users", user.uid);

  useEffect(() => {
    if (error) {
      addToast(<Toast body={error} />, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }, [error, addToast]);

  return (
    <>
      {subscriptions.length > 0 && <p>Your Subscriptions</p>}
      {(subscriptions || []).map((item) => (
        <Link to="/" className="nav-link" role="button" key="item">
          {item}
        </Link>
      ))}
    </>
  );
}
