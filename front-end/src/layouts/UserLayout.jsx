// src/layouts/UserLayout.jsx
/*
  UserLayout
  - Wraps all user pages (Dashboard, Profile, News)
  - Contains horizontal navbar with: Dashboard, Profile, News, Logout
  - Sticky Footer
*/

import { Outlet, NavLink, Navigate, useNavigate } from "react-router-dom";
import Footer from "../components/common/Footer";

const UserLayout = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const isGuest = localStorage.getItem("isGuest");

  // ✅ Allow logged-in users OR guest users
  if (!user && !isGuest) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    // Clear user auth info here (if using context or localStorage)
    localStorage.clear();
    navigate("/"); // redirect to public home page
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="bg-gray-900/90 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <h1 className="text-2xl font-bold text-emerald-400">CropCast</h1>

        <ul className="flex space-x-6 font-semibold">
          <li>
            <NavLink to="/user/dashboard">Dashboard</NavLink>
          </li>

          {/* ❌ Hide for guest */}
          {!isGuest && (
            <>
              <li>
                <NavLink to="/user/profile">Profile</NavLink>
              </li>
              <li>
                <NavLink to="/user/news">News</NavLink>
              </li>
            </>
          )}

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

      <main className="grow p-6">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default UserLayout;
