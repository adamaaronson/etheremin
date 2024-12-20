import { Wave } from "./Etheremin";
import { motion, AnimatePresence } from "motion/react";

interface CirclesProps {
  waves: Wave[];
}

export default function Circles({ waves }: CirclesProps) {
  return (
    <AnimatePresence>
      {waves.map(({ identifier, x, y }) => (
        <motion.div
          className="absolute bg-gray-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-0"
          key={identifier}
          style={{
            left: x,
            top: y,
            width: `${(x / window.innerWidth) * 15}dvh`,
            height: `${(x / window.innerWidth) * 15}dvh`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      ))}
    </AnimatePresence>
  );
}
