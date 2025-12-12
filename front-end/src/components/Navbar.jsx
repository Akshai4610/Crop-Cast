// src/components/Navbar.jsx
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="
        fixed top-0 left-0 w-full z-50
        backdrop-blur-md bg-white/10
        shadow-lg border-b border-white/20
    ">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-extrabold tracking-wide 
            bg-gradient-to-r from-green-400 via-lime-300 to-emerald-400 
            bg-clip-text text-transparent
        ">
          CropCast
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8 text-white font-medium">

          <NavLink
            to="/"
            className={({ isActive }) =>
              `relative group transition 
              ${isActive ? "text-lime-300" : "text-white"}`
            }
          >
            Home
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-lime-400 
                group-hover:w-full transition-all duration-300"></span>
          </NavLink>

          <NavLink
            to="/services"
            className="relative group text-white transition"
          >
            Services
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-lime-400
                group-hover:w-full transition-all duration-300"></span>
          </NavLink>

          <NavLink
            to="/about"
            className="relative group text-white transition"
          >
            About
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-lime-400
                group-hover:w-full transition-all duration-300"></span>
          </NavLink>

          <NavLink
            to="/contact"
            className="relative group text-white transition"
          >
            Contact
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-lime-400
                group-hover:w-full transition-all duration-300"></span>
          </NavLink>

          <Link
            to="/login"
            className="px-4 py-2 rounded-xl bg-gradient-to-r
              from-green-500 to-emerald-500 shadow-md shadow-green-700/40
              hover:scale-105 transition transform"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
