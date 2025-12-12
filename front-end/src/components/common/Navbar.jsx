// src/components/Navbar.jsx
/*
  Navbar (refined)
  - Dark translucent horizontal navbar so text is always visible
  - Gradient accent, glass blur effect, hover underline animation
  - Uses react-router navigate + react-scroll scroller to support:
      - clicking section links when already on Home -> scroll without navigation
      - clicking section links when on Login/Signup -> navigate to Home and scroll there
  - Mobile hamburger included
  - No href="#" anchors to avoid '#'
  - Important: HomePage must read location.state?.scrollTo and perform scrolling (already implemented)
*/

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import { Menu, X } from "lucide-react"; // optional lucide icons (if you installed lucide-react)

const Navbar = ({ userMode = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false); // mobile menu
  const [scrolled, setScrolled] = useState(false);

  // listen to scroll to add drop shadow / blur when page is scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // helper to navigate to home and set scroll state for HomePage to scroll
  const goHomeAndScroll = (sectionId) => {
    // if already on home, directly scroll using scroller
    if (location.pathname === "/") {
      scroller.scrollTo(sectionId, { duration: 700, smooth: "easeInOutQuart", offset: -80 });
      return;
    }
    // otherwise, navigate to / and pass scroll target via state
    navigate("/", { state: { scrollTo: sectionId } });
  };

  // user navigation (page-based)
  const goUserPage = (path) => {
    navigate(path);
  };

  // logout: simple client-side for now (clear auth later)
  const handleLogout = () => {
    // TODO: clear auth tokens/context
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-md bg-black/40 shadow-lg" : "bg-black/30"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Branding */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            {/* Gradient badge */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 via-lime-400 to-green-500 flex items-center justify-center shadow">
              <span className="text-white font-bold">CC</span>
            </div>

            {/* Brand name and tagline */}
            <div className="leading-tight">
              <div className="text-white font-extrabold text-lg">CropCast</div>
              <div className="text-xs text-white/70 -mt-1">Smart Crop Recommendations</div>
            </div>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {!userMode ? (
              <>
                <button
                  onClick={() => goHomeAndScroll("home")}
                  className="text-white text-sm font-medium relative group cursor-pointer"
                >
                  Home
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-emerald-300 to-green-400 transition-all group-hover:w-full"></span>
                </button>

                <button
                  onClick={() => goHomeAndScroll("about")}
                  className="text-white text-sm font-medium relative group cursor-pointer"
                >
                  About
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-emerald-300 to-green-400 transition-all group-hover:w-full"></span>
                </button>

                <button
                  onClick={() => goHomeAndScroll("services")}
                  className="text-white text-sm font-medium relative group cursor-pointer"
                >
                  Services
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-emerald-300 to-green-400 transition-all group-hover:w-full"></span>
                </button>

                <button
                  onClick={() => goHomeAndScroll("contact")}
                  className="text-white text-sm font-medium relative group cursor-pointer"
                >
                  Contact
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-emerald-300 to-green-400 transition-all group-hover:w-full"></span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => goUserPage("/user/dashboard")}
                  className="text-white text-sm font-medium relative group cursor-pointer"
                >
                  Dashboard
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-emerald-300 to-green-400 transition-all group-hover:w-full"></span>
                </button>

                <button
                  onClick={() => goUserPage("/user/profile")}
                  className="text-white text-sm font-medium relative group cursor-pointer"
                >
                  Profile
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-emerald-300 to-green-400 transition-all group-hover:w-full"></span>
                </button>

                <button
                  onClick={() => goUserPage("/user/news")}
                  className="text-white text-sm font-medium relative group cursor-pointer"
                >
                  News
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-gradient-to-r from-emerald-300 to-green-400 transition-all group-hover:w-full"></span>
                </button>
              </>
            )}
          </nav>

          {/* Actions (right side) */}
          <div className="hidden md:flex items-center gap-3">
            {!userMode ? (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-medium px-4 py-2 rounded-lg bg-white text-green-700 hover:scale-105 transition-shadow shadow-sm cursor-pointer"
                >
                  Login
                </button>

                <button
                  onClick={() => navigate("/signup")}
                  className="text-sm font-medium px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-md hover:brightness-105 transition cursor-pointer"
                >
                  Signup
                </button>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen((s) => !s)}
              className="p-2 rounded-md text-white hover:bg-white/10 transition"
              aria-label="Open menu"
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {open && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-black/30 backdrop-blur-md">
          {!userMode ? (
            <>
              <button className="w-full text-left text-white py-2" onClick={() => { setOpen(false); goHomeAndScroll("home"); }}>
                Home
              </button>
              <button className="w-full text-left text-white py-2" onClick={() => { setOpen(false); goHomeAndScroll("about"); }}>
                About
              </button>
              <button className="w-full text-left text-white py-2" onClick={() => { setOpen(false); goHomeAndScroll("services"); }}>
                Services
              </button>
              <button className="w-full text-left text-white py-2" onClick={() => { setOpen(false); goHomeAndScroll("contact"); }}>
                Contact
              </button>

              <div className="pt-2 border-t border-white/10">
                <button onClick={() => { setOpen(false); navigate("/login"); }} className="w-full text-center bg-white text-green-700 py-2 rounded-lg mb-2">Login</button>
                <button onClick={() => { setOpen(false); navigate("/signup"); }} className="w-full text-center bg-gradient-to-r from-emerald-400 to-green-500 text-white py-2 rounded-lg">Signup</button>
              </div>
            </>
          ) : (
            <>
              <button className="w-full text-left text-white py-2" onClick={() => { setOpen(false); goUserPage("/user/dashboard"); }}>Dashboard</button>
              <button className="w-full text-left text-white py-2" onClick={() => { setOpen(false); goUserPage("/user/profile"); }}>Profile</button>
              <button className="w-full text-left text-white py-2" onClick={() => { setOpen(false); goUserPage("/user/news"); }}>News</button>
              <div className="pt-2 border-t border-white/10">
                <button onClick={() => { setOpen(false); handleLogout(); }} className="w-full text-center bg-red-500 text-white py-2 rounded-lg">Logout</button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
