// src/layouts/UserLayout.jsx
/*
  UserLayout (FIXED ✅)
  --------------------------------
  ✔ Keeps your ORIGINAL navbar design
  ✔ Adds Profile Dropdown (Profile + History)
  ✔ Click outside to close
  ✔ Smooth minimal UI (no design break)
*/

import { Outlet, NavLink, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/common/Footer";
import LogoutModal from "../components/common/LogoutModal";
import PremiumLockedModal from "../components/common/PremiumLockedModal";
import { logoutUser, checkPremium } from "../services/api";
import { hasPremium } from "../utils/premium-registry";

const UserLayout = () => {
  const navigate = useNavigate();

  // Memoize user to prevent reference changes on every render
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch { return null; }
  }, []);

  const isGuest = localStorage.getItem("isGuest");

  // =============================
  // STATE
  // =============================
  const [openDropdown, setOpenDropdown] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    checkPremium().then(setIsPremium);
    
    // --- 🥂 ONE-TIME WELCOME LOGIC (TRUE PERSISTENCE) ---
    // We show it only ONCE ever for this account email.
    if (!user?.email) return;
    
    const persistentKey = `cropcast_welcome_v1_${user.email}`;
    const alreadyShown = localStorage.getItem(persistentKey);
    
    if (!alreadyShown) {
       // Mark as shown IMMEDIATELY
       localStorage.setItem(persistentKey, "true");
       
       const timer = setTimeout(() => {
         setShowWelcome(true);
       }, 1000);

       const dismissTimer = setTimeout(() => {
         setShowWelcome(false);
       }, 7500);
       
       return () => {
         clearTimeout(timer);
         clearTimeout(dismissTimer);
       };
    }
  }, [user?.email]);

  // =============================
  // CLOSE DROPDOWN ON OUTSIDE CLICK
  // =============================
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest(".profile-dropdown")) {
        setOpenDropdown(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // =============================
  // AUTH CHECK
  // =============================
  if (!user && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout sync failed", err);
    }
    // Clear only specific keys to maintain app state for next visits (like welcome shown)
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    localStorage.removeItem("fullname");
    localStorage.removeItem("premium_key");
    localStorage.removeItem("isGuest");
    
    sessionStorage.clear();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      
      {/* ================= NAVBAR ================= */}
      <nav className="bg-gray-900/90 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        
        {/* LOGO */}
        <h1 className="text-2xl font-bold text-emerald-400">
          CropCast
        </h1>

        {/* MENU */}
        <ul className="flex space-x-6 font-semibold items-center">

          {/* DASHBOARD */}
          <li>
            <NavLink to="/user/dashboard">Dashboard</NavLink>
          </li>

          {/* PROFILE DROPDOWN */}
          {!isGuest && (
            <>
              <li className="relative profile-dropdown">

                <button
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="flex items-center gap-1"
                >
                  Account
                  <span className={`text-xs transition ${openDropdown ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {/* DROPDOWN MENU */}
                {openDropdown && (
                  <div className="absolute left-0 mt-3 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden animate-fade-in">
                    
                    <button
                      onClick={() => {
                        setOpenDropdown(false);
                        navigate("/user/profile");
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >
                      👤 Profile
                    </button>

                    <button
                      onClick={() => {
                        setOpenDropdown(false);
                        navigate("/user/history");
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >
                      📜 History
                    </button>
                  </div>
                )}
              </li>

              {/* NEWS */}
              <li>
                <NavLink to="/user/news">News</NavLink>
              </li>

              {hasPremium && (
                <li>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <button 
                      onClick={() => isPremium ? navigate("/user/virtual-farm") : setIsLockedModalOpen(true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-2 hover:bg-emerald-500/20 transition-all shadow-[0_0_15px_rgba(52,211,153,0.1)] cursor-pointer"
                    >
                      <span className="text-sm">🌾 Virtual Farm</span>
                    </button>
                  </motion.div>
                </li>
              )}
            </>
          )}

          {/* LOGOUT */}
          <li>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="bg-emerald-400 px-3 py-1 rounded text-black font-bold hover:bg-emerald-300 transition-colors"
            >
              Logout
            </button>
          </li>

        </ul>
      </nav>

      {/* ================= CONTENT ================= */}
      <main className="grow p-6">
        <Outlet />
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

      {/* ================= MODALS ================= */}
      <LogoutModal 
        isOpen={isLogoutModalOpen} 
        onClose={() => setIsLogoutModalOpen(false)} 
        onConfirm={handleLogout} 
      />

      <PremiumLockedModal 
        isOpen={isLockedModalOpen}
        onClose={() => setIsLockedModalOpen(false)}
      />

      {/* --- 🥂 ONE-TIME WELCOME ONBOARDING --- */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-10 left-10 z-[100] max-w-sm pointer-events-auto"
          >
             <div className="p-6 rounded-[32px] bg-emerald-500 shadow-[0_20px_50px_rgba(16,185,129,0.3)] border border-emerald-400 relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/20 rounded-full blur-3xl opacity-50 transition-transform duration-700" />
                <div className="relative z-10 flex flex-col gap-3">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-xl shadow-inner">🌱</div>
                      <h4 className="text-xl font-black text-emerald-950 leading-tight">Welcome, {user?.fullname || "Farmer"}!</h4>
                   </div>
                   <p className="text-emerald-900/80 text-sm font-medium leading-relaxed pr-8">
                      Your smart farming journey starts here. Explore your dashboard to predict harvests and manage your crops.
                   </p>
                   <button 
                     onClick={() => setShowWelcome(false)}
                     className="mt-2 self-start px-5 py-2 rounded-xl bg-emerald-950 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-900 transition-colors shadow-lg"
                   >
                     Got it!
                   </button>
                </div>
                
                <motion.div 
                   initial={{ width: "100%" }}
                   animate={{ width: "0%" }}
                   transition={{ duration: 6.5, ease: "linear" }}
                   className="absolute bottom-0 left-0 h-1 bg-black/20"
                />
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserLayout;