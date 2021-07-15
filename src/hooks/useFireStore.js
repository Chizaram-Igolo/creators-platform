import { useState, useEffect } from "react";
import { projectFirestore } from "../firebase/config";

export default function useFireStore(collection) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsub = projectFirestore
      .collection(collection)
      .orderBy("createdAt", "desc")
      .limit(5)
      .onSnapshot(
        (snap) => {
          let documents = [];

          snap.forEach((doc) => {
            documents.push({ ...doc.data(), id: doc.id });
          });

          setDocs(documents);
          setLoading(false);
        },
        (error) => {
          console.log(error);
          setError(error);
        }
      );

    return () => unsub();
  }, [collection]);

  return { docs, loading, error };
}
