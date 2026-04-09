/* ═══════════════════════════════════════════════
   FloatingInput.jsx
   src/components/auth/FloatingInput.jsx
   Logic: unchanged
═══════════════════════════════════════════════ */

import { useState } from "react";

export default function FloatingInput({
  type = "text",
  name,
  label,
  value,
  onChange,
}) {
  const [focus, setFocus] = useState(false);
  const active = focus || (value && value !== "");

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(value !== "")}
        autoComplete="off"
        className="peer w-full px-4 pt-6 pb-2 rounded-xl text-sm text-white outline-none transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${focus ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.08)"}`,
          boxShadow: focus ? "0 0 0 3px rgba(52,211,153,0.07)" : "none",
        }}
      />
      <label
        className="absolute left-4 pointer-events-none transition-all duration-200"
        style={{
          top:        active ? "8px" : "50%",
          transform:  active ? "none" : "translateY(-50%)",
          fontSize:   active ? "10px" : "13px",
          fontWeight: active ? 600 : 400,
          color:      focus ? "#34d399" : "rgba(255,255,255,0.35)",
          letterSpacing: active ? "0.06em" : "0",
        }}
      >
        {label}
      </label>
    </div>
  );
}