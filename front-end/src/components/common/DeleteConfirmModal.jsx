import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
  const confirmedRef = useRef(false);

  const progress = (time / seconds) * 100;

  // ===============================
  // TIMER CONTROL
  // ===============================
  useEffect(() => {
    if (!open) {
      clearInterval(timerRef.current);
      confirmedRef.current = false;
      setTime(seconds);
      return;
    }

    confirmedRef.current = false;
    setTime(seconds);

    timerRef.current = setInterval(() => {
      setTime((t) => t - 1);
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [open, seconds]);

  // ===============================
  // AUTO DELETE FIX (IMPORTANT)
  // ===============================
  useEffect(() => {
    if (!open) return;

    if (time <= 0 && !confirmedRef.current) {
      confirmedRef.current = true;
      clearInterval(timerRef.current);

      // small delay prevents next-item auto delete bug
      setTimeout(() => {
        onConfirm?.();
      }, 100);
    }
  }, [time, open]);

  // ===============================
  // HANDLERS
  // ===============================
  const handleConfirm = () => {
    if (confirmedRef.current) return;

    confirmedRef.current = true;
    clearInterval(timerRef.current);
    onConfirm?.();
  };

  const handleCancel = () => {
    clearInterval(timerRef.current);
    confirmedRef.current = false;
    setTime(seconds);
    onCancel?.();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* BACKDROP */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCancel}
          />

          {/* MODAL */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              x: time <= 3 ? [0, -5, 5, -5, 5, 0] : 0,
            }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ duration: 0.25 }}
            className="relative bg-gray-900 text-white rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-5 border border-red-500/20"
          >
            <h2 className="text-lg font-semibold text-red-400 text-center">
              {title}
            </h2>

            {image && (
              <img
                src={image}
                alt={itemName}
                className="w-24 h-24 object-cover rounded-xl mx-auto"
              />
            )}

            <p className="text-center font-medium">{itemName}</p>

            <p className="text-center text-gray-400 text-sm">{message}</p>

            {/* TIMER */}
            <div className="flex justify-center">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#374151"
                    strokeWidth="4"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#ef4444"
                    strokeWidth="4"
                    fill="transparent"
                    strokeDasharray={176}
                    strokeDashoffset={(1 - time / seconds) * 176}
                  />
                </svg>

                <span className="absolute inset-0 flex items-center justify-center text-sm">
                  {time}s
                </span>
              </div>
            </div>

            {/* PROGRESS */}
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-red-500 h-2"
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.2 }}
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                className="flex-1 bg-red-500 py-2 rounded-xl hover:bg-red-600"
              >
                Delete
              </button>

              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-700 py-2 rounded-xl hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
