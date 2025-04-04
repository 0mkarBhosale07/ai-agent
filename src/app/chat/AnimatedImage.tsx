import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download } from "lucide-react";

interface AnimatedImageProps {
  src: string;
  alt: string;
}

export default function AnimatedImage({ src, alt }: AnimatedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
      // Add a small delay before removing the loading state for smoother transition
      // setTimeout(() => setIsLoading(false), 500);
    };
  }, [src]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <motion.a
        href={src}
        download="generated-image.jpg"
        className="inline-flex items-center px-3 py-1 text-sm text-white transition-colors bg-gray-800 rounded-md hover:bg-gray-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Download className="w-4 h-4 mr-2" />
        Download Image
      </motion.a>

      <div className="relative w-full max-w-[400px] aspect-square">
        {/* Skeleton Loader */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="absolute inset-0 bg-gray-800 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </AnimatePresence>

        {/* Image with Blur-to-Sharp Effect */}
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full rounded-lg"
          initial={{ opacity: 0, filter: "blur(20px)" }}
          // animate={{
          //   opacity: isLoaded ? 1 : 0,
          //   filter: isLoaded ? "blur(0px)" : "blur(20px)",
          // }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
        />
      </div>
    </div>
  );
}
