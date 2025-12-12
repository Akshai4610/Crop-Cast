// src/pages/user/UserLayout.jsx
/*
  Layout wrapper for all user pages
  - Fixed top navbar (Dashboard / Profile / News / Logout)
  - Footer always visible
  - Wraps child content via `props.children`
*/

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Footer from "../../components/Footer";

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");

  const handleLogout = () => {
    // Add actual logout logic here (e.g., remove token)
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* User Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-gray-900/80 backdrop-blur-md shadow-md fixed w-full top-0 z-50">
        <div className="text-2xl font-bold text-emerald-400 cursor-pointer">CropCast</div>

        <ul className="flex space-x-6">
          {["dashboard", "profile", "news"].map((item) => (
            <li
              key={item}
              onClick={() => setActive(item)}
              className={`cursor-pointer hover:text-emerald-400 transition font-semibold ${
                active === item ? "text-emerald-400 underline" : "text-white/80"
              }`}
            >
              <Link to={`/${item}`}>{item.charAt(0).toUpperCase() + item.slice(1)}</Link>
            </li>
          ))}

          <li>
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-emerald-400 to-green-500 text-black px-4 py-2 rounded-xl font-semibold hover:scale-105 transition"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-20" />

      {/* Page Content */}
      <main className="flex-grow px-8 py-6">{children}</main>

      <Footer />
    </div>
  );
};

export default UserLayout;
