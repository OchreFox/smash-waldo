"use client";
import React from "react";
import { Variants, motion } from "framer-motion";
import { Rectangle } from "@/app/components/canvas/shapes";

const pathVariants: Variants = {
  initial: {
    opacity: 0,
    pathLength: 0,
    pathOffset: 0,
    pathSpacing: 0,
  },
  animate: {
    opacity: 1,
    pathLength: 0.05,
    pathOffset: 0.91,
    pathSpacing: 0.02,

    transition: {
      pathOffset: {
        duration: 4,
        ease: "linear",
        repeat: Infinity,
        repeatType: "loop",
      },

      duration: 0.6,
      ease: [0.87, 0, 0.13, 1],
      delay: 0,
    },
  },
};

const AnimatedSelector = ({
  rectangle,
  index,
}: {
  rectangle: Rectangle;
  index: number;
}) => {
  // Offset the rectangle by the border size (5px)
  const offset = 5;

  const x = rectangle.x - offset;
  const y = rectangle.y - offset;
  const width = rectangle.width + offset * 2;
  const height = rectangle.height + offset * 2;

  return (
    <div className="absolute w-full h-full pointer-events-none">
      <motion.svg
        style={{ width: "100%", height: "100%" }}
        viewBox="0 0 1280 720"
        xmlns="http://www.w3.org/2000/svg"
      >
        <motion.path
          variants={pathVariants}
          initial="initial"
          animate="animate"
          stroke="#bae6fd"
          strokeWidth={4}
          fill="none"
          d={`M${x} ${y} h${width} v${height} h-${width} v-${height}`}
        />
      </motion.svg>
      {/* Display the index at the center of the rectangle */}
      <div
        className="absolute flex items-center justify-center w-10 h-10 font-bold text-white bg-white/25 border-black border-2 rounded-full"
        style={{
          left: x + width / 2 - 20,
          top: y + height / 2 - 20,
        }}
      >
        {index}
      </div>
    </div>
  );
};

export default AnimatedSelector;
