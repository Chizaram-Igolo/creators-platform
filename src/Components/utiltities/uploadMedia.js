import { Toast } from "../";
import { globalVars } from "../../global_vars";

async function uploadMultipleImages(
  e,
  images,
  thumbnails,
  setFileArray,
  imageResizer,
  setTotalBytes,
  addToast,
  imageUploadRef,
  setLoading
) {
  const imageTypes = ["image/png", "image/jpeg", "image/jpg"];

  for (let i = 0; i < e.target.files.length; i++) {
    const newImage = e.target.files[i];
    if (newImage && imageTypes.includes(newImage.type)) {
      setLoading(true);

      setFileArray((prevState) => [
        ...prevState,
        {
          type: "image",
          url: URL.createObjectURL(newImage),
          name: newImage.name,
        },
      ]);

      let imageType = newImage.type.split("/").slice(-1);
      if (imageType === "JPG") {
        imageType = "JPEG";
      }

      const imageBlob = await imageResizer(
        newImage,
        globalVars.imageMaxSize,
        imageType,
        globalVars.imageQuality
      );
      imageBlob["id"] = i;
      imageBlob["typeOfFile"] = "image";
      imageBlob["name"] = newImage["name"];

      const thumbnailBlob = await imageResizer(
        newImage,
        100,
        imageType,
        globalVars.imageQuality
      );
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

      setLoading(false);
    } else {
      addToast(<Toast body="Please select an image file (png or jpeg)" />, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }

  let totalBytes = images.concat(thumbnails).reduce((acc, elem) => {
    return acc + elem.size;
  }, 0);

  setTotalBytes((prevState) => prevState + totalBytes);

  imageUploadRef.current.value = null;
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
  _myVideos[_myVideos.length - 1].duration = duration;
};

const maxNumOfVideos = 3;

async function uploadMultipleVideos(
  e,
  videos,
  videoThumbnails,
  fileArray,
  setFileArray,
  setTotalBytes,
  addToast,
  videoUploadRef,
  setLoading
) {
  const videoTypes = ["video/mp4", "video/avi"];

  for (let i = 0; i < e.target.files.length; i++) {
    setLoading(true);

    const newVideo = e.target.files[i];
    window.URL = window.URL || window.webkitURL;
    let myVideos = [];

    let numberOfVideos = fileArray.filter(
      (item) => item.type === "video"
    ).length;

    if (i > maxNumOfVideos - 1 || numberOfVideos >= maxNumOfVideos) {
      addToast(
        <Toast
          body={`You can only upload a maximum of ${maxNumOfVideos} videos at a time.`}
        />,
        {
          appearance: "error",
          autoDismiss: true,
        }
      );

      break;
    }

    if (newVideo && videoTypes.includes(newVideo.type)) {
      newVideo["id"] = i;
      newVideo["typeOfFile"] = "video";

      videos.push(newVideo);
      myVideos.push(newVideo);

      _myVideos = myVideos;
      _addToast = addToast;

      video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = onVideoLoad;
      video.src = URL.createObjectURL(newVideo);

      setFileArray((prevState) => [
        ...prevState,
        {
          type: "video",
          url: URL.createObjectURL(newVideo),
          name: newVideo.name,
        },
      ]);

      setLoading(false);
    } else {
      addToast(<Toast body="Please select a video file (mp4 or avi)" />, {
        appearance: "error",
        autoDismiss: true,
      });

      return;
    }
  }

  let totalBytes = videos.concat(videoThumbnails).reduce((acc, elem) => {
    return acc + elem.size;
  }, 0);

  setTotalBytes((prevState) => prevState + totalBytes);

  videoUploadRef.current.value = null;
}

async function uploadMultipleFiles(
  e,
  files,
  fileArray,
  setFileArray,
  setTotalBytes,
  addToast,
  fileUploadRef,
  setLoading
) {
  for (let i = 0; i < e.target.files.length; i++) {
    const newFile = e.target.files[i];
    if (
      !newFile.type.match(
        /(image|video|audio|application\/pdf|application\/doc|text\/plain)/g
      )
    ) {
      addToast(<Toast body="We don't support upload of such files." />, {
        appearance: "error",
        autoDismiss: true,
      });

      return;
    } else {
      setLoading(true);

      setFileArray((prevState) => [
        ...prevState,
        { type: "file", url: URL.createObjectURL(newFile), name: newFile.name },
      ]);

      newFile["id"] = i;
      newFile["typeOfFile"] = "file";
      files.push(newFile);

      setLoading(false);

      // console.log(fileArray);
      // console.log(files);
    }
  }

  let totalBytes = files.reduce((acc, elem) => {
    return acc + elem.size;
  }, 0);

  setTotalBytes((prevState) => prevState + totalBytes);

  fileUploadRef.current.value = null;
}

export { uploadMultipleImages, uploadMultipleVideos, uploadMultipleFiles };
