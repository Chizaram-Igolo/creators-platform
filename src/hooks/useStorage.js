import { useState, useEffect } from "react";
import {
  projectFirestore,
  projectStorage,
  timestamp,
} from "../firebase/config";

export default function useStorage(post) {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    let imageUrls = [];
    let thumbnailUrls = [];
    let videoUrls = [];
    let fileUrls = [];
    let resourceList = [];

    function handleUploadPost() {
      const collectionRef = projectFirestore.collection("posts");
      const text = post.text.trim();
      const createdAt = timestamp();

      // Sort the images and thumbnail urls by their numerical ids to keep the order.
      imageUrls.sort((a, b) => (a.id > b.id ? 1 : -1));
      thumbnailUrls.sort((a, b) => (a.id > b.id ? 1 : -1));
      videoUrls.sort((a, b) => (a.id > b.id ? 1 : -1));
      fileUrls.sort((a, b) => (a.id > b.id ? 1 : -1));

      let images = imageUrls.map((image) => image.url);
      let thumbnails = thumbnailUrls.map((thumbnail) => thumbnail.url);
      let videos = videoUrls.map((video) => video.url);
      let files = fileUrls.map((file) => file.url);

      collectionRef
        .add({
          text,
          createdAt,
          images,
          thumbnails,
          videos,
          files,
          resourceList,
          poster: post.poster,
        })
        .then(() => {
          setProgress(0);
          imageUrls = thumbnailUrls = videoUrls = fileUrls = resourceList = [];
          setError(null);
          setSuccess(Math.random());
        })
        .catch((err) => {
          setProgress(0);
          setError(err);
          return;
        });
    }

    const promises = [];

    let allFiles = post.files;

    if (allFiles.length > 0) {
      let totalBytesTransferred = 0;

      allFiles.forEach((file) => {
        let uploadTask;

        // if (
        //   file.typeOfFile === "videoThumbnail" &&
        //   typeof file.img_base64 === "string"
        // ) {
        //   let base64_img = file.img_base64.split(/,(.+)/)[1];
        //   let contentType = file.img_base64.split(";")[0].split(":")[1];

        //   uploadTask = projectStorage
        //     .ref(`videoThumbnails/${file.name}`)
        //     .putString(base64_img, "base64", {
        //       contentType: contentType,
        //     });

        //   resourceList.push(`videoThumbnails/${file.name}`);
        // }

        if (file.typeOfFile === "image") {
          uploadTask = projectStorage
            .ref(`images/${file.name}`)
            .put(file, { contentType: file.type });

          resourceList.push(`images/${file.name}`);
        } else if (file.typeOfFile === "video") {
          uploadTask = projectStorage
            .ref(`videos/${file.name}`)
            .put(file, { contentType: file.type });

          resourceList.push(`videos/${file.name}`);
        } else {
          uploadTask = projectStorage
            .ref(`files/${file.name}`)
            .put(file, { contentType: file.type });

          resourceList.push(`files/${file.name}`);
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
            uploadTask.cancel();
            return;
          },
          () => {
            uploadTask.snapshot.ref.getDownloadURL().then((url) => {
              if (file.typeOfFile === "thumbnail") {
                thumbnailUrls.push({ url: url, id: file["id"] });
              } else if (file.typeOfFile === "image") {
                imageUrls.push({ url: url, id: file["id"] });
              } else if (file.typeOfFile === "video") {
                videoUrls.push({ url: url, id: file["id"] });
              } else if (file.typeOfFile === "file") {
                fileUrls.push({ url: url, id: file["id"] });
              }

              if (
                imageUrls.length +
                  thumbnailUrls.length +
                  videoUrls.length +
                  fileUrls.length ===
                  allFiles.length &&
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

  return { progress, error, success };
}
