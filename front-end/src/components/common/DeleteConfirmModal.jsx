import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Trash2, X, AlertTriangle } from "lucide-react";

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
  const [time, setTime]           = useState(seconds);
  const timerRef                  = useRef(null);
  const confirmedRef              = useRef(false);

  /* circumference for r=36 circle */
  const R          = 36;
  const CIRC       = 2 * Math.PI * R;
  const progress   = (time / seconds) * 100;
  const dashOffset = CIRC * (1 - time / seconds);

  /* ── TIMER CONTROL — logic unchanged ── */
  useEffect(() => {
    if (!open) {
      clearInterval(timerRef.current);
      confirmedRef.current = false;
      setTime(seconds);
      return;
    }
    confirmedRef.current = false;
    setTime(seconds);
    timerRef.current = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [open, seconds]);

  /* ── AUTO DELETE — logic unchanged ── */
  useEffect(() => {
    if (!open) return;
    if (time <= 0 && !confirmedRef.current) {
      confirmedRef.current = true;
      clearInterval(timerRef.current);
      setTimeout(() => onConfirm?.(), 100);
    }
  }, [time, open]);

  /* ── HANDLERS — logic unchanged ── */
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

  /* ── countdown ring color transitions red as time runs out ── */
  const danger   = time <= 3;
  const ringColor = danger ? "#ef4444" : time <= 6 ? "#f97316" : "#6366f1";

  const modal = (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* Blurred backdrop */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            onClick={handleCancel}
          />

          {/* Modal panel */}
          <motion.div
            initial={{ scale: 0.88, opacity: 0, y: 32 }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0,
              /* shake when critical — logic unchanged */
              x: danger ? [0, -6, 6, -6, 6, -4, 4, 0] : 0,
            }}
            exit={{ scale: 0.88, opacity: 0, y: 32 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="relative z-10 w-full max-w-sm"
          >
            <div
              className="relative flex flex-col rounded-2xl overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #130f1a 0%, #0e1117 60%, #0a0d12 100%)",
                border: `1px solid ${danger ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.07)"}`,
                boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset`,
                transition: "border-color 0.4s ease",
              }}
            >
              {/* Top accent */}
              <div
                className="absolute inset-x-0 top-0 h-px transition-all duration-500"
                style={{
                  background: `linear-gradient(90deg, transparent, ${ringColor}, transparent)`,
                }}
              />

              {/* Close button */}
              <button
                onClick={handleCancel}
                className="
                  absolute top-3.5 right-3.5 z-10
                  w-7 h-7 flex items-center justify-center
                  rounded-lg bg-white/5 hover:bg-white/10
                  text-gray-600 hover:text-gray-300
                  transition-all duration-150
                "
              >
                <X size={13} />
              </button>

              {/* ── BODY ── */}
              <div className="px-6 pt-7 pb-6 flex flex-col items-center gap-5">

                {/* Warning icon ring */}
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-500"
                    style={{
                      background: `${ringColor}12`,
                      border: `1.5px solid ${ringColor}30`,
                    }}
                  >
                    <AlertTriangle
                      size={26}
                      className="transition-colors duration-500"
                      style={{ color: ringColor }}
                    />
                  </div>
                  {/* Pulse ring */}
                  <div
                    className="absolute inset-0 rounded-full animate-ping opacity-20"
                    style={{ background: ringColor }}
                  />
                </div>

                {/* Title */}
                <div className="text-center space-y-1.5">
                  <h2
                    className="text-base font-semibold tracking-tight transition-colors duration-500"
                    style={{ color: danger ? "#f87171" : "#e5e7eb" }}
                  >
                    {title || "Confirm Delete"}
                  </h2>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-[220px] mx-auto">
                    {message || "This action cannot be undone."}
                  </p>
                </div>

                {/* Item name / image */}
                {(image || itemName) && (
                  <div
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {image && (
                      <img
                        src={image}
                        alt={itemName}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    {itemName && (
                      <span className="text-sm font-medium text-gray-300 truncate">
                        {itemName}
                      </span>
                    )}
                    <Trash2 size={14} className="ml-auto flex-shrink-0 text-gray-700" />
                  </div>
                )}

                {/* Countdown ring */}
                <div className="relative flex items-center justify-center">
                  <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    className="-rotate-90"
                  >
                    {/* Track */}
                    <circle
                      cx="40"
                      cy="40"
                      r={R}
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="3"
                    />
                    {/* Progress */}
                    <motion.circle
                      cx="40"
                      cy="40"
                      r={R}
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray={CIRC}
                      animate={{ strokeDashoffset: dashOffset, stroke: ringColor }}
                      transition={{ duration: 0.35, ease: "linear" }}
                    />
                  </svg>

                  {/* Center number */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      key={time}
                      initial={{ scale: 1.3, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-xl font-bold leading-none transition-colors duration-500"
                      style={{ color: ringColor }}
                    >
                      {time}
                    </motion.span>
                    <span className="text-[9px] text-gray-700 mt-0.5 uppercase tracking-widest">
                      sec
                    </span>
                  </div>
                </div>

                {/* Linear countdown bar */}
                <div className="w-full h-1 rounded-full bg-white/[0.04] overflow-hidden">
                  <motion.div
                    className="h-full rounded-full transition-colors duration-500"
                    style={{ background: ringColor }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.25 }}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex gap-2.5 w-full pt-1">
                  <button
                    onClick={handleConfirm}
                    className="
                      flex-1 flex items-center justify-center gap-2
                      py-2.5 rounded-xl
                      text-sm font-semibold text-white
                      transition-all duration-150 active:scale-[0.97]
                    "
                    style={{
                      background: "linear-gradient(135deg, #dc2626, #ef4444)",
                      boxShadow: "0 4px 16px rgba(220,38,38,0.35)",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>

                  <button
                    onClick={handleCancel}
                    className="
                      flex-1 py-2.5 rounded-xl
                      text-sm font-semibold
                      bg-white/[0.05] hover:bg-white/[0.09]
                      text-gray-400 hover:text-gray-200
                      border border-white/[0.07] hover:border-white/[0.12]
                      transition-all duration-150 active:scale-[0.97]
                    "
                  >
                    Cancel
                  </button>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}