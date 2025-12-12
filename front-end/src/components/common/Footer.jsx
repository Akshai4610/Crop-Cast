// src/components/Footer.jsx
/*
  Footer
  - Working quick links (scroll)
  - Real contact actions
  - Visible on all pages
*/

import { Link, useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Scroll handler (works from any page)
  const goToSection = (section) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: section } });
    } else {
      scroller.scrollTo(section, {
        smooth: true,
        duration: 600,
        offset: -80,
      });
    }
  };

  return (
    <footer className="bg-gray-950 border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            CropCast
          </h2>
          <p className="text-white/70 mt-4 text-sm leading-relaxed">
            Smart crop recommendation platform using weather intelligence and AI
            for better agricultural decisions.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-3 text-white/70">
            <li>
              <button onClick={() => goToSection("home")} className="hover:text-emerald-400 transition">
                Home
              </button>
            </li>
            <li>
              <button onClick={() => goToSection("about")} className="hover:text-emerald-400 transition">
                About
              </button>
            </li>
            <li>
              <button onClick={() => goToSection("services")} className="hover:text-emerald-400 transition">
                Services
              </button>
            </li>
            <li>
              <button onClick={() => goToSection("contact")} className="hover:text-emerald-400 transition">
                Contact
              </button>
            </li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <ul className="space-y-3 text-white/70">
            <li>
              📍{" "}
              <a
                href="https://www.google.com/maps/search/India"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-400 transition"
              >
                Kerala, India
              </a>
            </li>
            <li>
              📧{" "}
              <a
                href="mailto:support@cropcast.ai"
                className="hover:text-emerald-400 transition"
              >
                support@cropcast.ai
              </a>
            </li>
            <li>
              📞{" "}
              <a
                href="tel:+919876543210"
                className="hover:text-emerald-400 transition"
              >
                +91 98765 43210
              </a>
            </li>
          </ul>
        </div>

        {/* AUTH */}
        <div>
          <h3 className="font-semibold mb-4">Account</h3>
          <div className="flex flex-col gap-4">
            <Link
              to="/login"
              className="text-center px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-black font-semibold hover:scale-105 transition"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-center px-5 py-3 rounded-xl border border-emerald-400 text-emerald-400 hover:bg-emerald-400 hover:text-black transition rounded-xl"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="text-center py-6 border-t border-white/10 text-white/50 text-sm">
        © {new Date().getFullYear()} CropCast. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
