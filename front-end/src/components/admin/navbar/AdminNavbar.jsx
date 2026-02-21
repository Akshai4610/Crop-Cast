/*
====================================================
Admin Navbar
- Dropdown navigation
- Reusable for all admin pages
- Same style as public navbar (dark theme)
====================================================
*/

import { Link } from "react-router-dom";
import { useState } from "react";

export default function AdminNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-gray-900 border-b border-gray-800 px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-emerald-400">Admin Panel</h1>

      <div className="flex gap-8 items-center">
        
        {/* Crop Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="hover:text-emerald-400"
          >
            Crop Management ▼
          </button>

          {open && (
            <div className="absolute top-8  bg-gray-800 rounded-xl shadow-lg p-3 space-y-2 w-48 z-50">
              {/* Crop CRUD */}
              <Link to="/admin/crops" className="block hover:text-emerald-400">
                Crop Details
              </Link>

              {/* Dataset */}
              <Link
                to="/admin/dataset"
                className="block hover:text-emerald-400"
              >
                Dataset Manager
              </Link>
            </div>
          )}
        </div>

        <Link to="/admin/users" className="hover:text-emerald-400">
          Users
        </Link>

        <Link to="/admin/news" className="hover:text-emerald-400">
          News
        </Link>
      </div>
    </div>
  );
}
