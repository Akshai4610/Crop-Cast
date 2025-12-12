// src/pages/public/LoginPage.jsx
/*
  Login Page
  - Includes Navbar (improved) and Footer so header/footer are visible
  - On successful temporary login, navigates to /user/dashboard
  - Avoids '#'; uses navigate
  - Styled CTA buttons and centered card
*/

import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const LoginPage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: call backend auth, store token, then navigate
    navigate("/user/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> {/* Navbar always visible */}

      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome back</h2>
          <p className="text-sm text-gray-500 mb-6">Log in to access your dashboard</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input required name="email" type="email" placeholder="Email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-200" />
            <input required name="password" type="password" placeholder="Password" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-200" />

            <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-green-500 text-white font-semibold hover:brightness-105 transition cursor-pointer">
              Log in
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600 text-center">
            Don't have an account? <Link to="/signup" className="text-green-600 font-semibold">Create one</Link>
          </div>
        </div>
      </main>

      <Footer /> {/* Footer restored */}
    </div>
  );
};

export default LoginPage;
