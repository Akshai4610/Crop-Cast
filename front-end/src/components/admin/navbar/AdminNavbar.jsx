/*
====================================================
Admin Navbar
- Dropdown navigation
- Reusable for all admin pages
- Dark theme
====================================================
*/

import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Close dropdown when route changes
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">
      <h1
        className="text-2xl font-bold text-emerald-400 cursor-pointer"
        onClick={() => navigate("/admin")}
      >
        Admin Panel
      </h1>

      <div className="flex gap-8 items-center">
        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="hover:text-emerald-400 flex items-center gap-2"
          >
            Crop Management
            <span className={`text-xs transition ${open ? "rotate-180" : ""}`}>
                    ▼
                  </span>
          </button>

          {open && (
            <div className="absolute top-8 bg-gray-800 rounded-xl shadow-lg p-3 space-y-2 w-48 z-50 overflow-hidden animate-fade-in">
              <Link to="/admin/crops" className="block hover:text-emerald-400">
                🌾Crop Details
              </Link>

              <Link
                to="/admin/dataset"
                className="block hover:text-emerald-400"
              >
               🔬 Dataset Manager
              </Link>
            </div>
          )}
        </div>

        <Link to="/admin/users" className="hover:text-emerald-400">
          User Management
        </Link>

        <Link to="/admin/news" className="hover:text-emerald-400">
          News Management
        </Link>
      </div>
    </div>
  );
}
