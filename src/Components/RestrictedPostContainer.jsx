import React from "react";
import { useAuth } from "../contexts/AuthContext";
import RestrictedPost from "./RestrictedPost";

export default function RestrictedPostContainer() {
  const { user } = useAuth();

  return <>{user !== null && user.uid !== null && <RestrictedPost />}</>;
}
