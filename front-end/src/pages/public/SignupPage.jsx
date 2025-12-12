// src/pages/public/SignupPage.jsx
/*
  Signup Page
  - Includes Navbar + Footer
  - After signup (temporary) redirects to /user/dashboard
  - Well-styled form and CTA
*/

import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const SignupPage = () => {
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: call backend signup endpoint, handle validation
    navigate("/user/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center bg-gradient-to-b from-gray-50 to-white pt-16">
        <div className="max-w-md w-full p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create your account</h2>
          <p className="text-sm text-gray-500 mb-6">Sign up to get personalized recommendations</p>

          <form className="space-y-4" onSubmit={handleSignup}>
            <input required name="name" placeholder="Full name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-200" />
            <input required name="email" type="email" placeholder="Email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-200" />
            <input required name="password" type="password" placeholder="Password" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-emerald-200" />

            <button type="submit" className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-400 to-green-500 text-white font-semibold hover:brightness-105 transition cursor-pointer">
              Create account
            </button>
          </form>

          <div className="mt-4 text-sm text-gray-600 text-center">
            Already have an account? <Link to="/login" className="text-green-600 font-semibold">Login</Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SignupPage;
