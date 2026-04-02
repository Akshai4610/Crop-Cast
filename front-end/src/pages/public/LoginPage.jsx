/*
======================================================
🔐 Login Page (Optimized + Bug Fixed)

✔ Uses safe JSON parsing (no crash)
✔ Handles 401 (invalid credentials)
✔ Clean error handling (no console spam)
✔ Loading state + spinner
✔ Password show/hide toggle 👁️
✔ Keeps existing UI style intact
======================================================
*/

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ============================
  // 🔹 STATE MANAGEMENT
  // ============================
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  // ============================
  // 🔹 SHOW MESSAGE AFTER SIGNUP
  // ============================
  useEffect(() => {
    if (location.state?.fromSignup) {
      alert("Signup successful! Please login.");
    }
  }, [location]);

  // ============================
  // 🔐 LOGIN HANDLER
  // ============================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // reset previous error

    const email = e.target.email.value.trim();
    const password = e.target.password.value.trim();

    // 🔒 Basic validation
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

      // ✅ SAFE JSON PARSE (prevents crash if response is empty)
      let data = {};
      try {
        data = await res.json();
      } catch {
        data = {};
      }

      // 🔐 Invalid credentials
      if (res.status === 401) {
        setError("Invalid email or password");
        return;
      }

      // 🚫 Banning
      if (res.status === 403) {
        setError("🚫 Your account has been banned by admin");
        return;
      }

      // ❌ Other server errors
      if (!res.ok) {
        setError(data?.detail || "Login failed");
        return;
      }

      // ✅ SAVE USER DATA (NO TOKEN YET — backend doesn't send it)
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.email);

      // 🔀 ROLE-BASED REDIRECT
      if (data.role === "admin") {
        navigate("/admin/crop-management");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      // 🌐 Network / server unreachable
      setError("Server not reachable. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-emerald-900 to-green-900 flex flex-col">
      <Navbar />

      <main className="grow flex items-center justify-center px-6 py-24">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 max-w-md w-full shadow-2xl animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Login to CropCast
          </h2>

          {/* ============================
              🔴 ERROR MESSAGE UI
          ============================ */}
          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* ============================
                👤 EMAIL INPUT
            ============================ */}
            <div className="relative">
              <span className="absolute left-3 top-3 text-white text-lg">
                👤
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-gray-600 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />
            </div>

            {/* ============================
                🔒 PASSWORD INPUT + EYE
            ============================ */}
            <div className="relative">
              <span className="absolute left-3 top-3 text-white text-lg">
                🔒
              </span>

              <input
                type={showPass ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-gray-600 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />

              {/* 👁️ SHOW/HIDE PASSWORD */}
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-3 cursor-pointer text-white hover:text-emerald-400 transition transform hover:scale-110"
              >
                {showPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>

            {/* ============================
                🚀 LOGIN BUTTON
            ============================ */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold shadow-lg transition
                ${
                  loading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-linear-to-r from-emerald-400 to-green-500 hover:scale-105"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* ============================
              🔗 SIGNUP LINK
          ============================ */}
          <p className="text-white/70 text-center mt-4">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-emerald-400 font-semibold hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LoginPage;
