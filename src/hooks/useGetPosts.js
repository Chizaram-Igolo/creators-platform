import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

export default function useGetPosts() {
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState(null);
  const [latestDoc, setLatestDoc] = useState(null);

  useEffect(() => {
    let foundPosts = [];

    console.log("in useGetPosts hook");

    let unsubscribe = projectFirestore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(5)
      .onSnapshot(
        function (querySnapshot) {
          var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

          setLatestDoc(lastVisible);

          querySnapshot.forEach(function (doc) {
            if (!foundPosts.find((item) => item.id === doc.id)) {
              foundPosts.push({ ...doc.data(), id: doc.id });
            }
          });

          setDocs(foundPosts);
          setLoading(false);
        },
        (err) => {
          // Send email with error to developer
          setError(err);
        }
      );

    return unsubscribe;
  }, []);

  return { docs, error, loading, latestDoc };
}
