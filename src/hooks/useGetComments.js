import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

export default function useGetComments(docID) {
  const [loading, setLoading] = useState(true);
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState(null);
  const [latestDoc, setLatestDoc] = useState(null);

  useEffect(() => {
    let foundComments = [];

    let unsubscribe = projectFirestore
      .collection("posts")
      .doc(docID)
      .collection("comments")
      .orderBy("createdAt", "desc")
      .limit(5)
      .onSnapshot(
        function (querySnapshot) {
          var lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

          setLatestDoc(lastVisible);

          querySnapshot.forEach(function (doc) {
            if (!foundComments.find((item) => item.id === doc.id)) {
              foundComments.push({ ...doc.data(), id: doc.id });
            }
          });

          setDocs(foundComments);
          setLoading(false);
        },
        (err) => {
          // Send email with error to developer
          setError(err);
        }
      );

    return unsubscribe;
  }, [docID]);

  return { docs, error, loading, latestDoc };
}
