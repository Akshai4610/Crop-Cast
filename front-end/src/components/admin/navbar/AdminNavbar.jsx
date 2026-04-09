/*
====================================================
Admin Navbar (Premium UI)
✔ Glass effect
✔ Smooth animations (Framer Motion)
✔ Active route highlight
✔ Avatar dropdown (clean)
✔ Micro interactions
====================================================
*/

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logoutUser } from "../../../services/api";

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdowns on route change
  useEffect(() => {
    setOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  // Logout
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Admin logout sync failed", err);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  // Active route helper
  const isActive = (path) => location.pathname.includes(path);

  const username = localStorage.getItem("username") || "A";
  const letter = username.charAt(0).toUpperCase();

  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/70 border-b border-gray-800 px-6 py-3 flex justify-between items-center">

      {/* LOGO */}
      <motion.h1
        whileHover={{ scale: 1.05 }}
        className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-emerald-400 to-green-300 bg-clip-text text-transparent cursor-pointer"
        onClick={() => navigate("/admin")}
      >
        Admin Panel
      </motion.h1>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* ================= CROP DROPDOWN ================= */}
        <div className="relative">

          <motion.button
            whileHover={{ y: -2 }}
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-1 transition ${
              isActive("crops") || isActive("dataset")
                ? "text-emerald-400"
                : "hover:text-emerald-400"
            }`}
          >
            🌾 Crop Management
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              className="text-xs"
            >
              ▼
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-3 bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-xl shadow-xl p-3 w-50 z-50"
              >
                <Link
                  to="/admin/crops"
                  className="block py-1 px-2 rounded hover:bg-gray-700 transition"
                >
                  🌾 Crop Details
                </Link>

                <Link
                  to="/admin/dataset"
                  className="block py-1 px-2 rounded hover:bg-gray-700 transition"
                >
                  🔬 Dataset Manager
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* USERS */}
        <motion.div whileHover={{ y: -2 }}>
          <Link
            to="/admin/users"
            className={`transition ${
              isActive("users")
                ? "text-emerald-400"
                : "hover:text-emerald-400"
            }`}
          >
            👥 Users Management
          </Link>
        </motion.div>

        {/* NEWS */}
        <motion.div whileHover={{ y: -2 }}>
          <Link
            to="/admin/news"
            className={`transition ${
              isActive("news")
                ? "text-emerald-400"
                : "hover:text-emerald-400"
            }`}
          >
            📰 News Management
          </Link>
        </motion.div>

        {/* ================= AVATAR ================= */}
        <div className="relative">

          {/* Avatar Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-black font-bold shadow-lg"
          >
            {letter}
          </motion.button>

          {/* Dropdown */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute right-0 mt-3 bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-xl shadow-xl p-2 w-32 z-50"
              >
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-red-400 hover:text-red-500 px-2 py-1 transition"
                >
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>
    </div>
  );
}