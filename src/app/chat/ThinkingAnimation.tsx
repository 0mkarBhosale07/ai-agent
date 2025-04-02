"use client";

import { motion } from "framer-motion";

export const ThinkingAnimation = () => {
  return (
    <motion.div
      className="flex items-center space-x-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="text-gray-400"
      >
        Thinking...
      </motion.div>
    </motion.div>
  );
};
