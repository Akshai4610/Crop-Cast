/* ═══════════════════════════════════════════════════════
   PREMIUM SIGNUP PAGE
   File: src/pages/public/SignupPage.jsx
   Logic: 100% unchanged
═══════════════════════════════════════════════════════ */

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Leaf, ArrowRight, CheckCircle2 } from "lucide-react";
import { gsap } from "gsap";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import FloatingInput from "../../components/auth/FloatingInput";
import PasswordStrength from "../../components/auth/PasswordsStrength";
import OTPModal from "../../components/auth/OTPModal";
import Toast from "../../components/common/Toast";
import { registerUser } from "../../services/api";

export function SignupPage() {
  const navigate = useNavigate();
  const cardRef  = useRef(null);
  const leftRef  = useRef(null);

  const [form, setForm] = useState({ fullname: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [otpOpen,  setOtpOpen]  = useState(false);
  const [toast,    setToast]    = useState(null);

  /* ── GSAP entrance ── */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(leftRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 }
      );
      gsap.fromTo(cardRef.current,
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.15 }
      );
      gsap.fromTo(cardRef.current.querySelectorAll(".form-item"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.09, duration: 0.5, ease: "power2.out", delay: 0.4 }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleChange  = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  /* ── Signup handler — logic unchanged ── */
  const handleSignup  = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await registerUser(form);
      setOtpOpen(true);
    } catch (err) {
      setToast({ type: "error", message: err?.response?.data?.detail || "Signup failed" });
    }
    setLoading(false);
  };

  const handleVerifyOTP = (otp) => {
    console.log("OTP:", otp);
    setOtpOpen(false);
    setToast({ type: "success", message: "🎉 Email verified successfully!" });
    setTimeout(() => navigate("/login"), 2000);
  };

  const isFormValid = form.fullname.trim() !== "" && 
                     form.email.includes("@") && 
                     form.password.length >= 6;

  // 🖱️ CUSTOM SLIDE COMPONENT
  const SlideToSignup = ({ onComplete, loading, disabled }) => {
    const [isComplete, setIsComplete] = useState(false);
    const x = useMotionValue(0);
    
    // 🔥 TRANSFORM X TO FILL WIDTH
    // 280 is the max drag. We map 0-280 to 0%-100%
    const width = useTransform(x, [0, 240], ["0%", "100%"]);
    const opacity = useTransform(x, [0, 50], [0, 1]);

    return (
      <div className={`relative w-full h-14 rounded-2xl p-1 transition-all duration-300 border overflow-hidden ${
        disabled 
          ? "bg-white/5 border-white/5 opacity-50 cursor-not-allowed" 
          : "bg-emerald-400/5 border-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.05)]"
      }`}>
        {/* Progress Fill Indicator */}
        <motion.div 
          style={{ width, opacity }}
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500/20 to-emerald-400/40 border-r border-emerald-400/30"
        />

        {/* Background Text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className={`text-xs font-bold uppercase tracking-[0.2em] transition-opacity duration-300 ${
            disabled ? "text-white/20" : "text-emerald-400/40 animate-pulse"
          }`}>
            {loading ? "Creating Account..." : isComplete ? "Success!" : "Slide to Signup"}
          </span>
        </div>

        {/* Draggable Handle */}
        <motion.div
          style={{ x }}
          drag={!disabled && !loading && !isComplete ? "x" : false}
          dragConstraints={{ left: 0, right: 280 }} 
          dragElastic={0}
          dragSnapToOrigin={!isComplete}
          onDragEnd={(e, info) => {
            if (info.offset.x > 200) {
              setIsComplete(true);
              onComplete();
            }
          }}
          className={`relative z-10 w-12 h-12 rounded-[14px] flex items-center justify-center cursor-grab active:cursor-grabbing transition-colors duration-300 shadow-xl ${
            disabled 
              ? "bg-white/10 text-white/30" 
              : isComplete ? "bg-white text-emerald-600" : "bg-emerald-400 text-black"
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          ) : isComplete ? (
            <CheckCircle2 size={24} />
          ) : (
            <ArrowRight size={20} className={disabled ? "" : "animate-bounce-x"} />
          )}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "linear-gradient(180deg, #020c08, #030f0a)" }}>
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-5 py-24 sm:py-28">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">

          {/* LEFT */}
          <div
            ref={leftRef}
            className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
            style={{ background: "linear-gradient(145deg, #04180e, #052d1a)", borderRight: "1px solid rgba(52,211,153,0.1)" }}
          >
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(52,211,153,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full" style={{ background: "radial-gradient(circle, rgba(5,150,105,0.18) 0%, transparent 70%)", filter: "blur(40px)" }} />

            <div className="relative flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #059669, #34d399)", boxShadow: "0 0 24px rgba(52,211,153,0.3)" }}>
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-black text-xl text-white" style={{ fontFamily: "serif" }}>Crop<span style={{ color: "#34d399" }}>Cast</span></span>
            </div>

            <div className="relative">
              <h2 className="text-3xl font-black text-white mb-4 leading-tight" style={{ fontFamily: "serif", letterSpacing: "-0.02em" }}>
                Start your<br />free journey 🌱
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Create your account in seconds and get instant access to AI-powered crop recommendations.
              </p>
              <div className="mt-8 space-y-3">
                {["Free forever, no credit card", "Access 22+ crop models", "Real-time weather insights"].map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative flex gap-6">
              {[["94%","Accuracy"], ["22+","Crops"], ["10K+","Users"]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-xl font-black" style={{ color: "#34d399", fontFamily: "serif" }}>{v}</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Form */}
          <div
            ref={cardRef}
            className="flex flex-col justify-center p-8 sm:p-10"
            style={{ background: "linear-gradient(145deg, #0a1410, #060d09)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="form-item mb-8">
              <h2 className="text-2xl sm:text-3xl font-black text-white" style={{ fontFamily: "serif", letterSpacing: "-0.02em" }}>Create account</h2>
              <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>Join thousands of farmers on CropCast</p>
            </div>

            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="form-item"><FloatingInput name="fullname" label="Full Name"  value={form.fullname} onChange={handleChange} /></div>
              <div className="form-item"><FloatingInput name="email"    label="Email"      value={form.email}    onChange={handleChange} /></div>

              <div className="form-item relative">
                <FloatingInput
                  type={showPass ? "text" : "password"}
                  name="password"
                  label="Password"
                  value={form.password}
                  onChange={handleChange}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-4 transition-colors duration-200"
                  style={{ color: showPass ? "#34d399" : "rgba(255,255,255,0.3)" }}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
                <PasswordStrength password={form.password} />
              </div>

              <div className="form-item pt-2">
                <SlideToSignup 
                  disabled={!isFormValid} 
                  loading={loading}
                  onComplete={() => handleSignup({ preventDefault: () => {} })} 
                />
              </div>
            </form>

            <p className="form-item text-center mt-6 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Already have an account?{" "}
              <a href="/login" className="font-semibold" style={{ color: "#34d399" }}>Sign in</a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
      <OTPModal open={otpOpen} onClose={() => setOtpOpen(false)} onVerify={handleVerifyOTP} />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
}

export default SignupPage;