import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

export default function useFireStore(collection) {
  const [docs, setDocs] = useState([]);
  const [latestDoc, setLatestDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = projectFirestore
      .collection(collection)
      .orderBy("createdAt", "desc")
      .limit(2)
      .onSnapshot(
        (snap) => {
          let documents = [];

          snap.forEach((doc) => {
            documents.push({ ...doc.data(), id: doc.id });
          });

          setDocs(documents);
          setLatestDoc(documents[documents.length - 1]);
          setLoading(false);
        },
        (error) => {
          console.log(error);
          setError(error);
        }
      );

    console.log("inside useEffect");

    return () => unsub();
  }, []);

  return { docs, loading, latestDoc, error };
}
