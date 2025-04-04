"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface AnimatedTextProps {
  text: string | ReactNode;
  className?: string;
  once?: boolean;
}

export function AnimatedText({
  text,
  className = "",
  once = false,
}: AnimatedTextProps) {
  const words = typeof text === "string" ? text.split(" ") : [text];

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      style={{ overflow: "hidden", display: "flex", flexWrap: "wrap" }}
      variants={container}
      initial="hidden"
      animate={once ? "visible" : undefined}
      whileInView={!once ? "visible" : undefined}
      viewport={{ once: true }}
    >
      {words.map((word, index) => (
        <motion.span
          variants={child}
          style={{ marginRight: "0.25em" }}
          key={index}
          className={className}
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
}
