import React, { useState, useRef, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

import "./styles/Video.css";

export default function Video({ src }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  const playOrPause = useCallback(() => {
    if (videoRef.current.paused || videoRef.current.ended) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, []);

  const onPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const onPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return (
    <div className="video-wrapper">
      <video
        src={src}
        className="video"
        ref={videoRef}
        onPlay={onPlay}
        onPause={onPause}
      />

      <div className="controls" onClick={playOrPause}>
        <span
          className={`video-control ${
            isPlaying ? "control-hidden" : "control-shown"
          }`}
        >
          <FontAwesomeIcon
            icon={faPlay}
            size={48}
            color="rgba(255, 255, 255, 1.0)"
          />
        </span>
      </div>
    </div>
  );
}
