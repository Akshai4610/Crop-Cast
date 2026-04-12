import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";


/* ── type config ── */
const TYPE_CONFIG = {
  success: {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
        <circle cx="10" cy="10" r="9" stroke="#34d399" strokeWidth="1.5" />
        <path d="M6.5 10.5l2.5 2.5 4.5-5" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    label: "Completed",
    accent: "#34d399",
    glow: "rgba(52,211,153,0.15)",
    bar: "from-emerald-500 to-teal-400",
    border: "rgba(52,211,153,0.2)",
  },
  error: {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
        <circle cx="10" cy="10" r="9" stroke="#f87171" strokeWidth="1.5" />
        <path d="M7 7l6 6M13 7l-6 6" stroke="#f87171" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Error",
    accent: "#f87171",
    glow: "rgba(248,113,113,0.15)",
    bar: "from-red-500 to-rose-400",
    border: "rgba(248,113,113,0.2)",
  },
  progress: {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 animate-spin" style={{ animationDuration: "1.4s" }}>
        <circle cx="10" cy="10" r="8" stroke="rgba(99,102,241,0.25)" strokeWidth="2" />
        <path d="M10 2a8 8 0 0 1 8 8" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    label: "Training Model...",
    accent: "#818cf8",
    glow: "rgba(99,102,241,0.15)",
    bar: "from-indigo-500 to-violet-400",
    border: "rgba(99,102,241,0.2)",
  },
  info: {
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4">
        <circle cx="10" cy="10" r="9" stroke="#60a5fa" strokeWidth="1.5" />
        <path d="M10 9v5M10 7v.5" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    label: "Info",
    accent: "#60a5fa",
    glow: "rgba(96,165,250,0.15)",
    bar: "from-blue-500 to-cyan-400",
    border: "rgba(96,165,250,0.2)",
  },
};

export default function Toast({
  type,
  message,
  progress = 0,
  accuracy,
  crop = "general",
  onClose,
}) {
  const audioRef = useRef(null);
  const cfg = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const [getCropGlow, setGetCropGlow] = useState(() => () => ({
    glow: "rgba(52,211,153,0.15)",
    border: "from-emerald-500 to-teal-400"
  }));

  useEffect(() => {
    const loadGlow = async () => {
       const mods = import.meta.glob('../../utils/*.js');
       if (mods['../../utils/cropGlow.js']) {
          try { const m = await mods['../../utils/cropGlow.js'](); if (m.getCropGlow) setGetCropGlow(() => m.getCropGlow); } catch(e){}
       }
    };
    loadGlow();
  }, []);

  /* ── 🔊 SOUND — logic unchanged ── */
  useEffect(() => {
    if (type === "success") {
      audioRef.current = new Audio("/sounds/success.mp3");
      audioRef.current.play().catch(() => {});
    }
  }, [type]);

  /* ── ⏳ AUTO CLOSE — logic unchanged ── */
  useEffect(() => {
    if (type === "progress") return;
    const timer = setTimeout(() => onClose?.(), 2000);
    return () => clearTimeout(timer);
  }, [type, onClose]);

  const glow = getCropGlow(crop, 0.8);

  return (
    <AnimatePresence>
      <motion.div
        key="toast"
        className="fixed top-5 left-1/2 z-[99999] -translate-x-1/2"
        initial={{ y: -24, opacity: 0, scale: 0.94 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -20, opacity: 0, scale: 0.93 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
      >
        {/* Outer glow halo */}
        <div
          className="absolute inset-0 rounded-2xl blur-xl"
          style={{ background: cfg.glow, transform: "scale(1.15)" }}
        />

        {/* Card */}
        <div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: "linear-gradient(145deg, #0f1117ee, #141923ee)",
            border: `1px solid ${cfg.border}`,
            boxShadow: `0 24px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
            backdropFilter: "blur(20px)",
            minWidth: type === "progress" ? "300px" : "240px",
            maxWidth: "340px",
          }}
        >
          {/* Top accent line */}
          <div
            className={`absolute top-0 inset-x-0 h-px bg-gradient-to-r ${cfg.bar}`}
            style={{ opacity: 0.7 }}
          />

          <div className="px-4 py-3.5 space-y-2.5">

            {/* Header row */}
            <div className="flex items-center gap-2.5">
              {/* Icon */}
              <div
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg"
                style={{ background: `${cfg.accent}18` }}
              >
                {cfg.icon}
              </div>

              {/* Label */}
              <span
                className="text-[13px] font-semibold tracking-tight"
                style={{ color: cfg.accent }}
              >
                {cfg.label}
              </span>

              {/* Dismiss — only for non-progress */}
              {type !== "progress" && (
                <button
                  onClick={onClose}
                  className="ml-auto w-5 h-5 flex items-center justify-center rounded-md text-gray-600 hover:text-gray-400 hover:bg-white/5 transition-all"
                >
                  <svg viewBox="0 0 12 12" fill="none" className="w-2.5 h-2.5">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>

            {/* Message */}
            <p className="text-xs text-gray-400 leading-relaxed pl-[2.25rem]">
              {message}
            </p>

            {/* Progress bar */}
            {type === "progress" && (
              <div className="pl-[2.25rem]">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-[10px] text-gray-600 font-medium uppercase tracking-widest">Progress</span>
                  <span className="text-[11px] font-semibold" style={{ color: cfg.accent }}>
                    {progress}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full bg-gradient-to-r ${cfg.bar}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            )}

            {/* Accuracy */}
            {type === "success" && accuracy && (
              <div className="pl-[2.25rem] flex items-center gap-1.5">
                <span className="text-[10px] text-gray-600 uppercase tracking-widest">Accuracy</span>
                <span className="text-[12px] font-bold text-emerald-400">{accuracy}%</span>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}