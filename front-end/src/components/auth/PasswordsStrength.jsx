/* ═══════════════════════════════════════════════
   PasswordStrength.jsx
   src/components/auth/PasswordsStrength.jsx
   Logic: unchanged (score, levels)
═══════════════════════════════════════════════ */

import { motion } from "framer-motion";

export default function PasswordStrength({ password }) {

  const getStrength = () => {
    let score = 0;
    if (password.length >= 6)        score++;
    if (/[A-Z]/.test(password))      score++;
    if (/[0-9]/.test(password))      score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();

  const levels = [
    { label: "Very Weak", color: "#ef4444", glow: "rgba(239,68,68,0.35)"   },
    { label: "Weak",      color: "#f97316", glow: "rgba(249,115,22,0.35)"  },
    { label: "Good",      color: "#eab308", glow: "rgba(234,179,8,0.35)"   },
    { label: "Strong",    color: "#22c55e", glow: "rgba(34,197,94,0.35)"   },
  ];

  const current = levels[strength - 1];

  if (!password) return null;

  return (
    <div className="mt-3 space-y-2">
      {/* Bars */}
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((i) => {
          const active = i <= strength;
          return (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <motion.div
                className="h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: active ? "100%" : "0%" }}
                transition={{ duration: 0.35, delay: (i - 1) * 0.06, ease: "easeOut" }}
                style={{
                  background: active ? current?.color : "transparent",
                  boxShadow: active ? `0 0 6px ${current?.glow}` : "none",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Label */}
      <p
        className="text-[11px] font-semibold transition-colors duration-300"
        style={{ color: current?.color || "rgba(255,255,255,0.3)" }}
      >
        {current?.label || "Very Weak"}
      </p>
    </div>
  );
}