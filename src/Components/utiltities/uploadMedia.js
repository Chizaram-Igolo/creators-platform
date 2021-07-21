import { Toast } from "../";

async function uploadMultipleImages(
  e,
  images,
  thumbnails,
  setFileArray,
  imageResizer,
  setTotalBytes,
  addToast,
  imageUploadBtn
) {
  const imageTypes = ["image/png", "image/jpeg", "image/jpg"];

  for (let i = 0; i < e.target.files.length; i++) {
    const newImage = e.target.files[i];
    if (newImage && imageTypes.includes(newImage.type)) {
      setFileArray((prevState) => [
        ...prevState,
        { type: "image", url: URL.createObjectURL(newImage) },
      ]);

      let imageType = newImage.type.split("/").slice(-1);
      if (imageType === "JPG") {
        imageType = "JPEG";
      }

      const imageBlob = await imageResizer(newImage, 1400, imageType);
      imageBlob["id"] = i;
      imageBlob["typeOfFile"] = "image";
      imageBlob["name"] = newImage["name"];

      const thumbnailBlob = await imageResizer(newImage, 100, imageType);
      thumbnailBlob["id"] = imageBlob["id"];
      thumbnailBlob["typeOfFile"] = "thumbnail";

      let fileNameParts = newImage["name"].split(".");
      thumbnailBlob["name"] =
        fileNameParts.slice(0, -1).join(".") +
        "_thumbnail" +
        "." +
        fileNameParts.slice(-1);

      images.push(imageBlob);
      thumbnails.push(thumbnailBlob);

      // setImages((prevState) => [...prevState, newImage]);
    } else {
      addToast(<Toast body="Please select an image file (png or jpeg)" />, {
        appearance: "error",
        autoDismiss: true,
      });

      return;
    }
  }

  let _totalBytesImages = images.reduce((accumulator, element) => {
    return accumulator + element.size;
  }, 0);

  let _totalBytesThumbnails = thumbnails.reduce((accumulator, element) => {
    return accumulator + element.size;
  }, 0);

  let _totalBytes = _totalBytesImages + _totalBytesThumbnails;
  setTotalBytes((prevState) => prevState + _totalBytes);

  imageUploadBtn.value = null;
}

var video;
var _addToast;
var _myVideos;

let onVideoLoad = function () {
  window.URL.revokeObjectURL(video.src);
  var duration = video.duration;
  if (Math.floor(duration) > 600.0) {
    _addToast(<Toast body="Video cannot be longer than 10 minutes" />, {
      appearance: "error",
      autoDismiss: true,
    });
    return;
  }
  console.log("duration", duration);
  _myVideos[_myVideos.length - 1].duration = duration;
};

async function uploadMultipleVideos(
  e,
  videos,
  videoThumbnails,
  fileArray,
  setFileArray,
  setTotalBytes,
  addToast
) {
  const videoTypes = ["video/mp4", "video/avi"];

  for (let i = 0; i < e.target.files.length; i++) {
    const newVideo = e.target.files[i];

    window.URL = window.URL || window.webkitURL;
    let myVideos = [];

    let numberOfVideos = fileArray.filter(
      (item) => item.type === "video"
    ).length;

    if (i > 4 || numberOfVideos >= 5) {
      addToast(
        <Toast body="You can only upload a maximum of 5 videos at a time." />,
        {
          appearance: "error",
          autoDismiss: true,
        }
      );

      break;
    }

    if (newVideo && videoTypes.includes(newVideo.type)) {
      setFileArray((prevState) => [
        ...prevState,
        { type: "video", url: URL.createObjectURL(newVideo) },
      ]);

      console.log(URL.createObjectURL(newVideo));

      //   const imageBlob = await imageResizer(newImage, 1400, imageType);
      newVideo["id"] = i;
      newVideo["typeOfFile"] = "video";

      console.log(newVideo);

      //   const thumbnailBlob = await imageResizer(newImage, 100, imageType);
      //   thumbnailBlob["id"] = imageBlob["id"];
      //   thumbnailBlob["typeOfFile"] = "thumbnail";

      //   let fileNameParts = newImage["name"].split(".");
      //   thumbnailBlob["name"] =
      //     fileNameParts.slice(0, -1).join(".") +
      //     "_thumbnail" +
      //     "." +
      //     fileNameParts.slifce(-1);

      videos.push(newVideo);

      // setImages((prevState) => [...prevState, newImage]);

      myVideos.push(newVideo);

      _myVideos = myVideos;
      _addToast = addToast;

      video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = onVideoLoad;

      video.src = URL.createObjectURL(newVideo);
    } else {
      addToast(<Toast body="Please select a video file (mp4 or avi)" />, {
        appearance: "error",
        autoDismiss: true,
      });

      return;
    }
  }

  let _totalBytesVideos = videos.reduce((accumulator, element) => {
    return accumulator + element.size;
  }, 0);

  let _totalBytesVideoThumbnails = videoThumbnails.reduce(
    (accumulator, element) => {
      return accumulator + element.size;
    },
    0
  );

  let _totalBytes = _totalBytesVideos + _totalBytesVideoThumbnails;
  setTotalBytes((prevState) => prevState + _totalBytes);
}

export { uploadMultipleImages, uploadMultipleVideos };
