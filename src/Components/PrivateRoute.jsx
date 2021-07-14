import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Router that checks if the user is logged in.
// If not, redirect to './login'

function PrivateRoute({ location, ...rest }) {
  const { user } = useAuth();

  if (user) {
    return <Route location={location} {...rest} />;
  } else {
    return (
      <Redirect
        to={{
          pathname: "/signin",
          state: { from: location },
        }}
      />
    );
  }
}

export default PrivateRoute;
