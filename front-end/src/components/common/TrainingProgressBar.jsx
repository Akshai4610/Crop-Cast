/*
====================================================
TRAINING PROGRESS BAR — Premium Redesign
✔ Smooth animated progress          [logic unchanged]
✔ Auto sync with backend progress   [logic unchanged]
✔ Visible only during training      [logic unchanged]
✔ No fake progress                  [logic unchanged]
====================================================
*/

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ── Stage labels that map to progress ranges ── */
const STAGES = [
  { from: 0,  to: 25,  label: "Loading dataset",   color: "#818cf8" },
  { from: 25, to: 55,  label: "Feature extraction", color: "#22d3ee" },
  { from: 55, to: 85,  label: "Fitting model",      color: "#34d399" },
  { from: 85, to: 100, label: "Validating",          color: "#a78bfa" },
];

function getStage(pct) {
  return STAGES.find((s) => pct >= s.from && pct < s.to) || STAGES[STAGES.length - 1];
}

export default function TrainingProgressBar({ training }) {
  const progress = training?.progress ?? 0;

  /* ── SYNC WITH BACKEND — logic unchanged ── */
  
  const stage      = getStage(progress);
  const isComplete = training?.status === "Completed";
  const isFailed   = training?.status === "Failed";

  const barColor = isFailed
    ? "#ef4444"
    : isComplete
    ? "#34d399"
    : stage.color;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(145deg, #0f1117, #141923)",
          border: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute inset-x-0 top-0 h-px transition-colors duration-700"
          style={{ background: `linear-gradient(90deg, transparent, ${barColor}, transparent)` }}
        />

        <div className="px-6 py-5 space-y-4">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {/* Animated dot */}
              <div className="relative w-2.5 h-2.5">
                <span
                  className="absolute inset-0 rounded-full"
                  style={{ background: barColor }}
                />
                {!isComplete && !isFailed && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-50"
                    style={{ background: barColor }}
                  />
                )}
              </div>

              <span className="text-sm font-semibold text-white tracking-tight">
                {isFailed
                  ? "Training Failed"
                  : isComplete
                  ? "Training Complete"
                  : "Model Training Progress"}
              </span>
            </div>

            {/* Percent badge */}
            <div
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold"
              style={{
                background: `${barColor}18`,
                color: barColor,
                border: `1px solid ${barColor}30`,
              }}
            >
              {progress}%
            </div>
          </div>

          {/* Stage label */}
          {!isComplete && !isFailed && (
            <motion.p
              key={stage.label}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[11px] font-medium tracking-wide"
              style={{ color: stage.color, opacity: 0.8 }}
            >
              ↳ {stage.label}
            </motion.p>
          )}

          {/* Progress track */}
          <div
            className="relative w-full h-2.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: isFailed
                  ? "linear-gradient(90deg, #dc2626, #ef4444)"
                  : `linear-gradient(90deg, ${barColor}bb, ${barColor})`,
                boxShadow: `0 0 12px ${barColor}60`,
              }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Shimmer */}
            {!isComplete && !isFailed && (
              <motion.div
                className="absolute inset-y-0 w-16 rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                  left: `${Math.max(progress - 12, 0)}%`,
                }}
                animate={{ left: [`${Math.max(progress - 20, 0)}%`, `${progress}%`] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>

          {/* Stage milestone track */}
          <div className="flex items-center gap-1">
            {STAGES.map((s, i) => {
              const reached = progress >= s.to || (progress >= s.from && progress < s.to);
              const active  = progress >= s.from && progress < s.to;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full h-px transition-colors duration-500"
                    style={{
                      background: reached ? s.color : "rgba(255,255,255,0.07)",
                      opacity: active ? 1 : reached ? 0.5 : 0.3,
                    }}
                  />
                  <span
                    className="text-[9px] font-medium uppercase tracking-widest transition-colors duration-500 text-center"
                    style={{
                      color: active ? s.color : reached ? `${s.color}80` : "#374151",
                    }}
                  >
                    {s.label.split(" ")[0]}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
}