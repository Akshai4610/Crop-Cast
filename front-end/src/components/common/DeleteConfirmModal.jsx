import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/*
========================================================
DeleteConfirmModal (Stable Version)
✔ Timer safe
✔ No second auto-delete bug
✔ Proper cleanup
========================================================
*/

export default function DeleteConfirmModal({
  open,
  onConfirm,
  onCancel,
  seconds = 10,
  title,
  message,
  itemName,
  image,
}) {
  const [time, setTime] = useState(seconds);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    setTime(seconds);

    timerRef.current = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [open, seconds]);

  useEffect(() => {
    if (!open) return;

    if (time <= 0) {
      clearInterval(timerRef.current);
      onConfirm?.();
    }
  }, [time, open, onConfirm]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onCancel}
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="relative bg-gray-900 text-white rounded-2xl p-8 w-96 shadow-2xl space-y-5"
        >
          <h2 className="text-xl font-semibold text-red-400 text-center">
            {title}
          </h2>

          {image && (
            <img
              src={image}
              alt={itemName}
              className="w-24 h-24 object-cover rounded-xl mx-auto"
            />
          )}

          <p className="text-center text-lg">{itemName}</p>

          <p className="text-center text-gray-400 text-sm">
            {message}
          </p>

          <p className="text-center text-red-400 text-sm">
            Auto delete in {time}s
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                clearInterval(timerRef.current);
                onConfirm();
              }}
              className="flex-1 bg-red-500 py-2 rounded-xl"
            >
              Delete Now
            </button>

            <button
              onClick={() => {
                clearInterval(timerRef.current);
                onCancel();
              }}
              className="flex-1 bg-gray-700 py-2 rounded-xl"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}