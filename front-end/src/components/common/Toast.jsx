/*
=====================================================
Reusable Animated Toast
✔ Always centered
✔ Auto close
✔ Smooth animation
✔ No stacking
=====================================================
*/

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast({ type, message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -40 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-6 left-1/2 -translate-x-1/2 
        z-9999 px-6 py-3 rounded-xl shadow-2xl 
        font-semibold text-white
        ${type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
}