/* ═══════════════════════════════════════════════
   OTPModal.jsx
   src/components/auth/OTPModal.jsx
   Logic: unchanged (onVerify, onClose)
   Enhancement: 6-digit split inputs with auto-advance
═══════════════════════════════════════════════ */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { gsap } from "gsap";
import { Mail, X } from "lucide-react";

export default function OTPModal({ open, onClose, onVerify }) {
  const [digits, setDigits]   = useState(Array(6).fill(""));
  const inputRefs             = useRef([]);
  const contentRef            = useRef(null);

  /* ── GSAP digit boxes shake on wrong ── */
  const shakeInputs = () => {
    gsap.fromTo(
      ".otp-box",
      { x: 0 },
      { x: [-8, 8, -6, 6, -3, 3, 0], duration: 0.45, ease: "power2.out" }
    );
  };

  /* ── Handle digit input ── */
  const handleDigitChange = (i, val) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next  = [...digits];
    next[i]     = digit;
    setDigits(next);
    if (digit && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs.current[i - 1]?.focus();
    }
    /* Handle paste */
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) return;
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = () => {
    const otp = digits.join("");
    if (otp.length < 6) { shakeInputs(); return; }
    onVerify(otp); /* logic unchanged */
  };

  /* Reset on close */
  useEffect(() => {
    if (!open) setDigits(Array(6).fill(""));
    else setTimeout(() => inputRefs.current[0]?.focus(), 300);
  }, [open]);

  const otp = digits.join("");

  if (!open) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-99999 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/75 backdrop-blur-md" onClick={onClose} />

          {/* Card */}
          <motion.div
            ref={contentRef}
            initial={{ scale: 0.88, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
            className="relative z-10 w-full max-w-sm rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #0a1410, #060d09)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
            }}
          >
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-70" />

            {/* Close */}
            <button onClick={onClose} className="absolute top-3.5 right-3.5 w-7 h-7 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-600 hover:text-white transition-all">
              <X size={13} />
            </button>

            <div className="px-7 py-8 flex flex-col items-center gap-6">

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", boxShadow: "0 0 30px rgba(52,211,153,0.15)" }}
              >
                <Mail size={22} style={{ color: "#34d399" }} />
              </div>

              {/* Heading */}
              <div className="text-center">
                <h2 className="text-lg font-black text-white" style={{ fontFamily: "serif" }}>Verify your email</h2>
                <p className="text-xs mt-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                  We sent a 6-digit code to your email address.
                </p>
              </div>

              {/* OTP Inputs */}
              <div className="flex gap-2.5" onPaste={handlePaste}>
                {digits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (inputRefs.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className="otp-box w-11 h-13 text-center text-lg font-bold text-white rounded-xl outline-none transition-all duration-200"
                    style={{
                      width: "44px",
                      height: "52px",
                      background: d ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.04)",
                      border: `1.5px solid ${d ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)"}`,
                      boxShadow: d ? "0 0 12px rgba(52,211,153,0.1)" : "none",
                      caretColor: "#34d399",
                    }}
                    onFocus={(e) => { e.target.style.borderColor = "rgba(52,211,153,0.5)"; e.target.style.boxShadow = "0 0 0 3px rgba(52,211,153,0.08)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = d ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.1)"; e.target.style.boxShadow = d ? "0 0 12px rgba(52,211,153,0.1)" : "none"; }}
                  />
                ))}
              </div>

              {/* Verify button */}
              <button
                onClick={handleVerify}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.97]"
                style={{
                  background: otp.length === 6 ? "linear-gradient(135deg, #059669, #34d399)" : "rgba(255,255,255,0.06)",
                  color: otp.length === 6 ? "#fff" : "rgba(255,255,255,0.3)",
                  boxShadow: otp.length === 6 ? "0 8px 24px rgba(52,211,153,0.3)" : "none",
                  cursor: otp.length === 6 ? "pointer" : "default",
                }}
              >
                Verify Email
              </button>

              {/* Resend */}
              <button className="text-xs transition-colors duration-200" style={{ color: "rgba(255,255,255,0.25)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "#34d399"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
              >
                Didn't receive code? <span style={{ textDecoration: "underline" }}>Resend</span>
              </button>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}