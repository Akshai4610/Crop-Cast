/*
======================================================
🔐 Login Page — Premium Redesign
  ✔ All logic unchanged (handleLogin, error states, role redirect)
  ✔ GSAP entrance animations
  ✔ Split-screen layout: visual left / form right
  ✔ Fully responsive (stacks on mobile)
======================================================
*/

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, Leaf, ArrowRight, AlertCircle } from "lucide-react";
import { gsap } from "gsap";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import Toast from "../../components/common/Toast";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [showPass, setShowPass] = useState(false);
  const [toast,    setToast]    = useState(null);

  const cardRef  = useRef(null);
  const leftRef  = useRef(null);

  /* ── Signup message — logic unchanged ── */
  useEffect(() => {
    if (location.state?.fromSignup) {
      setToast({ type: "success", message: "Signup successful! Please login." });
    }
  }, [location]);

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

  /* ── Login handler — logic unchanged ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const email    = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    if (!email || !password) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data = {};
      try { data = await res.json(); } catch { data = {}; }

      if (res.status === 401) { setError("Invalid email or password"); return; }
      if (res.status === 403) { setError("🚫 Your account has been banned by admin"); return; }
      if (!res.ok)            { setError(data?.detail || "Login failed"); return; }

      localStorage.setItem("user",     JSON.stringify(data));
      localStorage.setItem("role",     data.role);
      localStorage.setItem("username", data.email);
      localStorage.setItem("fullname", data.fullname || "User");
      localStorage.setItem("token",    data.access_token);
      if (data.premium_key) {
        localStorage.setItem("premium_key", data.premium_key);
      } else {
        localStorage.removeItem("premium_key");
      }

      window.dispatchEvent(new Event("userChanged"));

      if (data.role === "admin") navigate("/admin/crops");
      else                       navigate("/user/dashboard");

    } catch {
      setError("Server not reachable. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "linear-gradient(180deg, #020c08, #030f0a)" }}
    >
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-5 py-24 sm:py-28">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">

          {/* ── LEFT: Visual panel ── */}
          <div
            ref={leftRef}
            className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
            style={{
              background: "linear-gradient(145deg, #04180e, #052d1a)",
              borderRight: "1px solid rgba(52,211,153,0.1)",
            }}
          >
            {/* Grid */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(52,211,153,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Glow orb */}
            <div
              className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(5,150,105,0.2) 0%, transparent 70%)", filter: "blur(40px)" }}
            />

            {/* Top logo */}
            <div className="relative flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #059669, #34d399)", boxShadow: "0 0 24px rgba(52,211,153,0.3)" }}
              >
                <Leaf size={18} className="text-white" />
              </div>
              <span className="font-black text-xl text-white" style={{ fontFamily: "serif" }}>
                Crop<span style={{ color: "#34d399" }}>Cast</span>
              </span>
            </div>

            {/* Center content */}
            <div className="relative">
              <h2
                className="text-3xl font-black text-white mb-4 leading-tight"
                style={{ fontFamily: "serif", letterSpacing: "-0.02em" }}
              >
                Grow smarter<br />with AI 🌾
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Join thousands of farmers using CropCast to make data-driven decisions
                every growing season.
              </p>

              {/* Testimonial */}
              <div
                className="mt-8 p-4 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <p className="text-xs italic" style={{ color: "rgba(255,255,255,0.5)" }}>
                  "CropCast increased our rice yield by 18% in one season. The predictions are remarkably accurate."
                </p>
                <p className="text-[11px] font-semibold text-emerald-400 mt-2">— Rajan M., Punjab Farmer</p>
              </div>
            </div>

            {/* Stats */}
            <div className="relative flex gap-6">
              {[["94%","Accuracy"], ["22+","Crops"], ["10K+","Users"]].map(([v, l]) => (
                <div key={l}>
                  <p className="text-xl font-black" style={{ color: "#34d399", fontFamily: "serif" }}>{v}</p>
                  <p className="text-[10px] text-gray-600 uppercase tracking-widest">{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Form ── */}
          <div
            ref={cardRef}
            className="flex flex-col justify-center p-8 sm:p-10"
            style={{
              background: "linear-gradient(145deg, #0a1410, #060d09)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {/* Header */}
            <div className="form-item mb-8">
              <h2
                className="text-2xl sm:text-3xl font-black text-white"
                style={{ fontFamily: "serif", letterSpacing: "-0.02em" }}
              >
                Welcome back
              </h2>
              <p className="text-sm mt-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                Sign in to your CropCast account
              </p>
            </div>

            {/* Error */}
            {error && (
              <div
                className="form-item flex items-center gap-2.5 px-4 py-3 rounded-xl mb-5 text-sm"
                style={{
                  background: "rgba(248,113,113,0.08)",
                  border: "1px solid rgba(248,113,113,0.2)",
                  color: "#fca5a5",
                }}
              >
                <AlertCircle size={15} />
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleLogin}>

              {/* Email */}
              <div className="form-item">
                <PremiumInput type="email" name="email" label="Email address" />
              </div>

              {/* Password */}
              <div className="form-item relative">
                <PremiumInput
                  type={showPass ? "text" : "password"}
                  name="password"
                  label="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                  style={{ color: showPass ? "#34d399" : "rgba(255,255,255,0.3)" }}
                >
                  {showPass ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {/* Forgot */}
              <div className="form-item flex justify-end">
                <button type="button" className="text-xs transition-colors duration-200" style={{ color: "rgba(52,211,153,0.7)" }}>
                  Forgot password?
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="form-item w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.98]"
                style={{
                  background: loading ? "rgba(52,211,153,0.2)" : "linear-gradient(135deg, #059669, #34d399)",
                  boxShadow: loading ? "none" : "0 8px 24px rgba(52,211,153,0.3)",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            {/* Sign up link */}
            <p className="form-item text-center mt-6 text-sm" style={{ color: "rgba(255,255,255,0.35)" }}>
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold transition-colors duration-200 hover:text-emerald-300" style={{ color: "#34d399" }}>
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  );
};

/* ── Reusable premium input (no floating label, clean focused style) ── */
function PremiumInput({ type, name, label }) {
  const [focused, setFocused] = useState(false);

  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-widest"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        {label}
      </label>
      <input
        type={type}
        name={name}
        required
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: `1px solid ${focused ? "rgba(52,211,153,0.4)" : "rgba(255,255,255,0.08)"}`,
          boxShadow: focused ? "0 0 0 3px rgba(52,211,153,0.07)" : "none",
        }}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
    </div>
  );
}

export default LoginPage;