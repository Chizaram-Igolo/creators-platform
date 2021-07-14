import { useState, useEffect } from "react";
import {
  projectStorage,
  projectFirestore,
  timestamp,
} from "../firebase/config";

export default function useStorage(post) {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    // references

    const promises = [];

    for (let i = 0; i < post.images.length; i++) {
      //   console.log(post);

      const uploadTask = projectStorage
        .ref(`images/${post.images[i].name.replace(/[^a-zA-Z0-9]/g, "")}`)
        .put(post.images[i]);

      promises.push(uploadTask);

      //   console.log(post.images[i].name);
      //   const collectionRef = projectFirestore.collection("posts");

      uploadTask.on(
        "state_changed",
        (snap) => {
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
          setProgress(percentage);
        },
        (err) => {
          setError(err);
        },
        async () => {
          //   const images = [];

          await projectStorage
            .ref("images")
            .child(post.images[i].name)
            .getDownloadURL()
            .then((urls) => {
              setUrls((prevState) => [...prevState, urls]);
            });

          //   images.push(url);
          //   const createdAt = timestamp();

          //   collectionRef.add({ images, createdAt });
          //   //   setUrl(url);
          //   urls.push(url);
        }
      );
    }

    Promise.all(promises)
      .then(() => "All images uploaded")
      .catch((err) => console.log(err));
  }, [post, urls]);

  return { progress, urls, error };
}
