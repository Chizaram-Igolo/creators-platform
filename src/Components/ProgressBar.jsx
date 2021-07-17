import React from "react";
import { motion } from "framer-motion";

export default function ProgressBar({ progress }) {
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
