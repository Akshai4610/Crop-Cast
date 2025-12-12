// src/pages/public/LoginPage.jsx
/*
  Login Page
  - Glassmorphism card design
  - Gradient buttons
  - Navbar & Footer visible
  - Smooth fade-in
  - Link to Signup page
*/

import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-green-900 flex flex-col">
      <Navbar />

      <main className="flex-grow flex items-center justify-center px-6 py-24">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-10 max-w-md w-full shadow-2xl animate-fade-in">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">Login to CropCast</h2>

          <form className="space-y-5">
            <div className="relative">
              <span className="absolute left-3 top-3 text-white text-lg">📧</span>
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-gray-600 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />
            </div>

            <div className="relative">
              <span className="absolute left-3 top-3 text-white text-lg">🔒</span>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-gray-600 focus:ring-2 focus:ring-emerald-400 outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-black font-semibold shadow-lg hover:scale-105 transition"
            >
              Login
            </button>
          </form>

          <p className="text-white/70 text-center mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-emerald-400 font-semibold hover:underline">
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
