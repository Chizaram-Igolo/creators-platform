import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

export default function useGetPostsByUser(username) {
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState(null);
  const [latestDoc, setLatestDoc] = useState(null);

  useEffect(() => {
    let foundPosts = [];

    const unsubscribe = projectFirestore
      .collection("posts")
      .where("posterUsername", "==", username)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get()
      .then((querySnapshot) => {
        let lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        setLatestDoc(lastVisible);

        querySnapshot.forEach((doc) => {
          if (!foundPosts.find((item) => item.id === doc.id)) {
            foundPosts.push({ ...doc.data(), id: doc.id });
          }
        });

        setDocs(foundPosts);
        setLoading(false);
      })
      .catch((err) => setError(err));

    return unsubscribe;
  }, [username]);

  return { docs, error, loading, latestDoc };
}
