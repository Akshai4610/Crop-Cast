// src/pages/public/SignupPage.jsx
/*
  Signup Page
  - Glassmorphism card design
  - Gradient buttons
  - Navbar & Footer visible
  - Smooth fade-in
  - Link to Login page
*/

import { Link, useNavigate } from "react-router-dom";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";

const SignupPage = () => {
  const navigate = useNavigate();

  // Update form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    //API call to signup user
    const payload = {
      fullname: e.target.fullname.value,
      email: e.target.email.value,
      password: e.target.password.value,
    };

    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Signup failed");
        return;
      }

      // Redirect to login page
      navigate("/login", { state: { fromSignup: true } });
      
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
    
    // Simulate signup success
    console.log("Signup success");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-emerald-900 to-green-900 flex flex-col">
      <Navbar />

      <main className="grow flex items-center justify-center px-6 py-24">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 max-w-md w-full shadow-2xl animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Create an Account
          </h2>

          <form className="space-y-5" onSubmit={handleSignup}>
            <div className="relative">
              <span className="absolute left-3 top-3 text-white text-lg">
                👤
              </span>
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-gray-600 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-3 text-white text-lg">
                📧
              </span>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-gray-600 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-3 text-white text-lg">
                🔒
              </span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-gray-600 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-linear-to-r from-emerald-400 to-green-500 text-black font-semibold shadow-lg hover:scale-105 transition"
            >
              Sign Up
            </button>
          </form>

          <p className="text-white/70 text-center mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-emerald-400 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignupPage;
