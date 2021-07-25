import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";
import VideoThumbnail from "react-video-thumbnail";

export default function MultiUploadPreview({
  fileArray,
  videoThumbnails,
  videos,
  handleRemoveThumbnail,
}) {
  return (
    <div className="form-group multi-preview mb-0" id="multiPreview">
      {(fileArray.filter((item) => item.type === "image") || []).map(
        (item, id) => (
          <div className="preview-img-div" key={item.url}>
            <img src={item.url} alt="..." />

            <button
              type="button"
              className="close closeThumbnail"
              aria-label="Close"
              style={{ position: "absolute", top: "-4px", right: "4px" }}
            >
              <span
                aria-hidden="true"
                id={item.url}
                onClick={handleRemoveThumbnail}
              >
                ×
              </span>
            </button>
          </div>
        )
      )}

      {(fileArray.filter((item) => item.type === "video") || []).map(
        (item, id) => (
          <div className="preview-img-div" key={item.url}>
            <>
              <VideoThumbnail
                videoUrl={item.url}
                thumbnailHandler={(thumbnail) => {
                  let thumb = thumbnail.split(",")[1].split("=")[0];
                  let thumbLength = thumb.length;
                  let size = thumbLength - (thumbLength / 8) * 2;
                  size = Number((size * 1024) / 1000).toFixed(2);

                  videoThumbnails.push({
                    name: videos[id].name,
                    img_base64: thumbnail,
                    typeOfFile: "videoThumbnail",
                    id: id,
                    size: size,
                  });
                }}
                width={1920}
                height={1080}
              />
              <span
                style={{
                  display: "inline-block",
                  position: "absolute",
                  top: "2px",
                  marginLeft: "calc(50% - 6px)",
                }}
              >
                <FontAwesomeIcon
                  icon={faPlay}
                  color="rgba(255, 255, 255, 0.28)"
                />
              </span>
            </>

            <button
              type="button"
              className="close closeThumbnail"
              aria-label="Close"
              style={{ position: "absolute", top: "-4px", right: "4px" }}
            >
              <span
                aria-hidden="true"
                id={item.url}
                onClick={handleRemoveThumbnail}
              >
                ×
              </span>
            </button>
          </div>
        )
      )}

      {(fileArray.filter((item) => item.type === "file") || []).map(
        (item, id) => (
          <div className="preview-file-div" key={item.url}>
            <div>
              {() => {
                // let nameParts = item.name.split(".");
                // let fileName =
                //   nameParts.slice(0, -1).join(".") + nameParts.slice(-1);
                // console.log(nameParts.slice(0, -1).join("."));
              }}
              <p className="px-2 pt-2 pr-5" style={{ fontSize: "0.9em" }}>
                {item.name.split(".").slice(0, -1).join(".").slice(0, 30) +
                  "." +
                  item.name.split(".").slice(-1)}
              </p>
            </div>

            <button
              type="button"
              className="close closeThumbnail"
              aria-label="Close"
              style={{
                position: "absolute",
                top: "-4px",
                right: "4px",
              }}
            >
              <span
                aria-hidden="true"
                id={item.url}
                onClick={handleRemoveThumbnail}
              >
                ×
              </span>
            </button>
          </div>
        )
      )}
    </div>
  );
}
