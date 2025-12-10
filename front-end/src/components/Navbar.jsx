// src/components/Navbar.jsx
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (id) => {
    if (location.pathname === "/") {
      scroller.scrollTo(id, {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
      });
    } else {
      // Navigate to home first, then scroll
      navigate("/", { state: { scrollTo: id } });
    }
  };

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-bold text-green-600 cursor-pointer">
          CropCast
        </div>
        <ul className="flex space-x-6">
          <li>
            <button
              onClick={() => scrollToSection("home")}
              className="hover:text-green-800 transition-colors duration-300"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("services")}
              className="hover:text-green-800 transition-colors duration-300"
            >
              Services
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-green-800 transition-colors duration-300"
            >
              About
            </button>
          </li>
          <li>
            <button
              onClick={() => scrollToSection("contact")}
              className="hover:text-green-800 transition-colors duration-300"
            >
              Contact
            </button>
          </li>
          <li>
            <Link
              to="/login"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors duration-300"
            >
              Login
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className="bg-white border border-green-600 text-green-600 px-4 py-2 rounded hover:bg-green-100 transition-colors duration-300"
            >
              Signup
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
