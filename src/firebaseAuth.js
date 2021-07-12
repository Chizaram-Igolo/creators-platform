import { useState, useEffect } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { firebase } from "./firebase/config";

const firebaseAuthConfig = {
  signInFlow: "popup",
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],

  signInSuccessUrl: "/",
};

const FirebaseAuth = () => {
  return (
    <div>
      <StyledFirebaseAuth
        uiConfig={firebaseAuthConfig}
        firebaseAuth={firebase.auth()}
      />
    </div>
  );
};
