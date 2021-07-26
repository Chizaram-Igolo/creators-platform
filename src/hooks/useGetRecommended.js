import { data } from "jquery";
import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

export default function useGetRecommended(collection) {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let foundUsers = [];

    let unsubscribe = projectFirestore
      .collection(collection)
      .limit(6)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (!foundUsers.find((item) => item.id === doc.id)) {
            foundUsers.push({ ...doc.data(), id: doc.id });
          }
        });

        setRecommendedUsers((prevState) => [...prevState, ...foundUsers]);
      })
      .catch((err) => setError(err));

    return unsubscribe;
  }, [collection]);
  return { recommendedUsers, error };
}
