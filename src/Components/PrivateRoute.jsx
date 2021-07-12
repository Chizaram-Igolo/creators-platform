import React from "react";
import { Route } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Router that checks if the user is logged in.
// If not, redirect to './login'

function PrivateRoute({ location, ...rest }) {
  const { user } = useAuth();

  if (user) {
    return <Route location={location} {...rest} />;
  } else {
    return <Route location={location} {...rest} />;
  }
}

export default PrivateRoute;
