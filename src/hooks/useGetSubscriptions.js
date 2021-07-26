import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { projectFirestore } from "../firebase/config";

export default function useGetSubscriptions(collection) {
  const { user } = useAuth();
  const [subscriptions, setSubscriptions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let subs = [];

    let unsubscribe = projectFirestore
      .collection(collection)
      .doc(user.uid)
      .get()
      .then((doc) => {
        if (doc.exists) {
          subs = doc.data().subscriptions;
        } else {
          setSubscriptions([]);
        }
        setSubscriptions(subs);
      })
      .catch((err) => {
        setError(err.code);
      });

    return unsubscribe;
  }, [collection, user]);
  return { subscriptions, error };
}
