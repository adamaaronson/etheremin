import { Wave } from "./Etheremin";
import { motion, AnimatePresence } from "motion/react";

interface CirclesProps {
  waves: Map<number, Wave>;
}

export default function Circles({ waves }: CirclesProps) {
  return (
    <AnimatePresence>
      {Array.from(waves.entries()).map(([identifier, wave]) => (
        <motion.div
          className="absolute bg-gray-500 rounded-full -translate-x-1/2 -translate-y-1/2 z-0"
          key={identifier}
          style={{
            left: wave.x,
            top: wave.y,
            width: `${(wave.x / window.innerWidth) * 15}dvh`,
            height: `${(wave.x / window.innerWidth) * 15}dvh`,
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
