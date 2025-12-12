// src/pages/public/SignupPage.jsx

import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { motion } from "framer-motion";

/*
  SignupPage Component
  - Pre-login page for new users
  - Contains form for name, email, password
  - Link to Login page
  - Navbar and Footer visible
*/
const SignupPage = () => {
  const handleSignup = (e) => {
    e.preventDefault();
    // TODO: Implement signup API integration
    alert("Signup functionality will be implemented in backend integration.");
  };

  return (
    <div className="relative">
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-green-50 mt-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white p-10 rounded shadow-lg w-full max-w-md"
        >
          <h2 className="text-3xl font-bold text-green-800 mb-6 text-center">
            Signup
          </h2>
          <form className="flex flex-col gap-4" onSubmit={handleSignup}>
            <input
              type="text"
              placeholder="Full Name"
              required
              className="border border-green-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              type="email"
              placeholder="Email"
              required
              className="border border-green-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <input
              type="password"
              placeholder="Password"
              required
              className="border border-green-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <button
              className="
                  w-full py-3 mt-4 font-bold rounded-xl
                  bg-gradient-to-r from-green-400 to-emerald-500
                  text-black shadow-lg
                  hover:scale-105 hover:shadow-2xl
                  active:scale-95 transition-all duration-300
                "
            >
              Signup
            </button>
          </form>
          <p className="mt-4 text-green-700 text-center">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-800 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
