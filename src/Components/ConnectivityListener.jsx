import React, { Fragment, useEffect, useRef, useState } from "react";
import { useToasts } from "react-toast-notifications";

const ConnectivityListener = () => {
  useConnectivityListener();
  return null;
};

export function useConnectivityListener() {
  const { addToast, removeToast } = useToasts();
  const [isOnline, setOnline] = useState(
    window ? window.navigator.onLine : false
  );
  const toastId = useRef(null);

  useEffect(() => {
    const onlineHandler = () => setOnline(true);
    const offlineHandler = () => setOnline(false);

    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);

    return () => {
      window.removeEventListener("online", onlineHandler);
      window.removeEventListener("offline", offlineHandler);
    };
  }, []);

  useUpdateEffect(() => {
    const content = (
      <Fragment>
        <strong style={{ fontSize: "1.1em" }}>
          {isOnline ? "Online" : "Offline"}
        </strong>
        <div style={{ fontSize: "1.1em" }}>
          {isOnline
            ? "You are back online."
            : "You went offline but we'll catch you up when you get back online. :)"}
        </div>
      </Fragment>
    );

    // remove the existing offline notification if it exists, otherwise store
    // the added toast id for use later
    const callback = isOnline
      ? () => {
          removeToast(toastId.current);
          toastId.current = null;
        }
      : (id) => {
          toastId.current = id;
        };

    // add the applicable toast
    addToast(
      content,
      { appearance: isOnline ? "success" : "warning", autoDismiss: isOnline },
      callback
    );
  }, [isOnline]);
}

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * @param {Function} effect
 */
function useUpdateEffect(effect, deps = []) {
  const initialMount = useRef(true);

  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false;
    } else {
      effect();
    }
  }, deps);
}

export default ConnectivityListener;
