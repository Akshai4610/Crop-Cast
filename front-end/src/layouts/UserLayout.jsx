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
import { useState, useEffect } from "react";
import Footer from "../components/common/Footer";

const UserLayout = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isGuest = localStorage.getItem("isGuest");

  // =============================
  // STATE (Dropdown)
  // =============================
  const [openDropdown, setOpenDropdown] = useState(false);

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

  const handleLogout = () => {
    localStorage.clear();
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
            </>
          )}

          {/* LOGOUT */}
          <li>
            <button
              onClick={handleLogout}
              className="bg-emerald-400 px-3 py-1 rounded text-black"
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
    </div>
  );
};

export default UserLayout;