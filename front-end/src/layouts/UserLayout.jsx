// src/layouts/UserLayout.jsx
/*
  UserLayout
  - Wraps all user pages (Dashboard, Profile, News)
  - Contains horizontal navbar with: Dashboard, Profile, News, Logout
  - Sticky Footer
*/

import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";

const UserLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user auth info here (if using context or localStorage)
    navigate("/"); // redirect to public home page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900/90 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-emerald-400">CropCast</h1>
        <ul className="flex space-x-6 text-white font-semibold">
          <li>
            <NavLink
              to="/user/dashboard"
              className={({ isActive }) =>
                isActive ? "border-b-2 border-emerald-400" : "hover:border-b-2 hover:border-white"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/profile"
              className={({ isActive }) =>
                isActive ? "border-b-2 border-emerald-400" : "hover:border-b-2 hover:border-white"
              }
            >
              Profile
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/user/news"
              className={({ isActive }) =>
                isActive ? "border-b-2 border-emerald-400" : "hover:border-b-2 hover:border-white"
              }
            >
              News
            </NavLink>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-emerald-400/80 hover:bg-emerald-400 px-3 py-1 rounded transition font-semibold text-black"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Page Content */}
      <main className="flex-grow p-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
