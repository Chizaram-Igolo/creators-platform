import { useEffect, useState, useContext, createContext } from "react";
import { auth } from "../firebase/config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ email: "chizaram.igolo@yahoo.com" });

  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function signin(email, password) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function signout() {
    return auth.signOut();
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return user.updateEmail(email);
  }

  function updatePassword(password) {
    return user.updatePassword(password);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    signup,
    signin,
    signout,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
