/*
  - Handles authentication
  - Gracefully handles 401 (invalid credentials)
  - Avoids console error spam
*/

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  // Show message if redirected from signup
  useEffect(() => {
    if (location.state?.fromSignup) {
      alert("Signup successful! Please login.");
    }
  }, [location]);

  // 🔐 Login handler
  const handleLogin = async (e) => {
    e.preventDefault(); // VERY IMPORTANT
    setLoading(true);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      // 🔐 Invalid credentials → expected case
      if (res.status === 401) {
        alert("Invalid email or password");
        setLoading(false);
        return; // ⛔ STOP here (no console error)
      }

      if (!res.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      const data = await res.json();

      // ✅ Save full user info (token, role, username)
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("username", data.username);

      // 🔀 Role-based redirect
      if (data.role === "admin") {
        navigate("/admin/crop-management");
      } else {
        navigate("/user/dashboard");
      }
    } catch (err) {
      alert("Server not reachable. Is backend running?");
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

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Username */}
            <div className="relative">
              <span className="absolute left-3 top-3 text-white text-lg">
                👤
              </span>
              <input
                type="email"
                name="email" // ✅ FIXED
                placeholder="Username"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-gray-600 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <span className="absolute left-3 top-3 text-white text-lg">
                🔒
              </span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-gray-600 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-linear-to-r from-emerald-400 to-green-500 text-black font-semibold shadow-lg hover:scale-105 transition"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

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
