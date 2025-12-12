import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-black/40 shadow-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-lime-300 via-green-400 to-emerald-400 
          bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,100,0.4)]"
        >
          CropCast
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-10">
          <a
            href="#home"
            className="text-white font-semibold hover:text-lime-300 transition-all relative 
            after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-lime-300 
            hover:after:w-full after:transition-all"
          >
            Home
          </a>

          <a
            href="#about"
            className="text-white font-semibold hover:text-lime-300 transition-all relative 
            after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-lime-300 
            hover:after:w-full after:transition-all"
          >
            About
          </a>

          <a
            href="#services"
            className="text-white font-semibold hover:text-lime-300 transition-all relative 
            after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-lime-300 
            hover:after:w-full after:transition-all"
          >
            Services
          </a>

          <a
            href="#contact"
            className="text-white font-semibold hover:text-lime-300 transition-all relative 
            after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-lime-300 
            hover:after:w-full after:transition-all"
          >
            Contact
          </a>
        </div>

        {/* Login Button */}
        <Link
          to="/login"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-lime-400 
          text-black font-bold shadow-lg hover:shadow-green-400/50 
          hover:scale-105 transition-all"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
