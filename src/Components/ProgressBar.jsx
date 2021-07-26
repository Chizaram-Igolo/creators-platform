import React, { useEffect } from "react";
import { motion } from "framer-motion";
import useStorage from "../hooks/useStorage";

export default function ProgressBar({ post, cleanUp }) {
  let { success, error, progress } = useStorage(post);

  useEffect(() => {
    if (success) {
      cleanUp(true);
    } else if (error) {
      cleanUp(false);
    }
  }, [success, error, cleanUp]);

  if (progress > 100) {
    progress = 100;
  }

  return (
    <motion.div
      className="progress-bar"
      initial={{ width: 0 + "%" }}
      animate={{ width: progress + "%" }}
    ></motion.div>
  );
}
