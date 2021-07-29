import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

export default function useGetRecommended(collection) {
  const [loading, setLoading] = useState(true);
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

        setRecommendedUsers(foundUsers);
        setLoading(false);
      })
      .catch((err) => setError(err));

    return unsubscribe;
  }, [collection]);
  return { recommendedUsers, loading, error };
}
