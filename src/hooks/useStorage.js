import { useState, useEffect } from "react";
import {
  projectFirestore,
  projectStorage,
  timestamp,
} from "../firebase/config";

export default function useStorage(post) {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let imageUrls = [];
    let thumbnailUrls = [];

    function handleUploadPost() {
      const collectionRef = projectFirestore.collection("posts");
      const text = post.text.trim();
      const createdAt = timestamp();
      const imUrls = imageUrls;
      const thumbUrls = thumbnailUrls;

      // Sort the images and thumbnail urls by their numerical ids to keep the order.
      imUrls.sort((a, b) => (a.id > b.id ? 1 : -1));
      thumbUrls.sort((a, b) => (a.id > b.id ? 1 : -1));

      let _images = imUrls.map((image) => image.url);
      let _thumbnails = thumbUrls.map((thumbnail) => thumbnail.url);

      collectionRef
        .add({
          text,
          createdAt,
          images: _images,
          thumbnails: _thumbnails,
          poster: post.poster,
        })
        .then(() => {
          setProgress(0);
          setLoading(0);
          imageUrls = [];
          thumbnailUrls = [];
          setError(null);
          setSuccess(imUrls.slice(-1));
        })
        .catch((err) => {
          setProgress(0);
          setLoading(false);
          return;
        });
    }

    setLoading(true);
    const promises = [];

    let allFiles = post.files;

    if (allFiles.length > 0) {
      let totalBytesTransferred = 0;

      allFiles.forEach((file) => {
        let uploadTask;
        if (file.type.includes("image")) {
          uploadTask = projectStorage
            .ref(`images/${file.name}`)
            .put(file, { contentType: file.type });
        }

        promises.push(uploadTask);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            totalBytesTransferred += snapshot.bytesTransferred;

            let percentage = Math.round(
              (totalBytesTransferred / post.totalBytes) * 100
            );
            setProgress(percentage);
          },
          (err) => {
            setError(err);
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              if (file.typeOfFile === "thumbnail") {
                thumbnailUrls.push({ url: url, id: file["id"] });
              } else {
                imageUrls.push({ url: url, id: file["id"] });
              }
              if (
                imageUrls.length + thumbnailUrls.length === allFiles.length &&
                allFiles.length > 0
              ) {
                handleUploadPost();
              }
            });
          }
        );
      });
    }

    Promise.all(promises);

    // If it's just a text post.
    if (post.files.length <= 0 && post.text.trim() !== "") {
      handleUploadPost();
    }
  }, [post]);

  return { progress, error, loading, success };
}
