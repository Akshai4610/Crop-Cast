/*
  Navbar Component (Public + User modes)
  - Props:
  // userMode (boolean) -> if true, render user links (dashboard/profile/news/logout).
  - Uses react-router's navigate to go to pages (no section scrolling in user mode).
  - Keeps minimal inline logic; visually identical to previous Tailwind style.
  - Replace existing Navbar with this file content.
*/

import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = ({ userMode = false }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Handler for clicking public section links (keeps previous scroll fallback behavior)
  const handlePublicNav = (target) => {
    // If already at home, use hash navigation to let scroller in HomePage pick up
    if (location.pathname === "/") {
      // we change location state instead of full reload; HomePage handles scroll state
      navigate("/", { state: { scrollTo: target } });
      return;
    }
    // if not on home page, navigate to home and pass state to scroll after navigation
    navigate("/", { state: { scrollTo: target } });
  };

  // Handler for user-mode navigation to pages
  const handleUserNav = (path) => {
    // Navigate to the user page path, e.g. /user/dashboard
    navigate(path);
  };

  // Logout handler (temporary client-side)
  const handleLogout = () => {
    // TODO: replace with real auth sign-out logic (clear tokens, context, etc.)
    navigate("/");
  };

  return (
    <nav className="fixed w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Brand / Logo */}
        <div
          role="button"
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-green-600 cursor-pointer select-none"
        >
          CropCast
        </div>

        {/* Links */}
        <ul className="flex space-x-4 items-center">
          {!userMode ? (
            // PUBLIC NAV LINKS
            <>
              <li>
                <button
                  onClick={() => handlePublicNav("home")}
                  className="text-sm font-medium text-gray-700 hover:text-green-800 transition-colors duration-200"
                >
                  Home
                </button>
              </li>

              <li>
                <button
                  onClick={() => handlePublicNav("services")}
                  className="text-sm font-medium text-gray-700 hover:text-green-800 transition-colors duration-200"
                >
                  Services
                </button>
              </li>

              <li>
                <button
                  onClick={() => handlePublicNav("about")}
                  className="text-sm font-medium text-gray-700 hover:text-green-800 transition-colors duration-200"
                >
                  About
                </button>
              </li>

              <li>
                <button
                  onClick={() => handlePublicNav("contact")}
                  className="text-sm font-medium text-gray-700 hover:text-green-800 transition-colors duration-200"
                >
                  Contact
                </button>
              </li>

              <li>
                <Link
                  to="/login"
                  className="text-sm font-medium bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors duration-200"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/signup"
                  className="text-sm font-medium border border-green-600 text-green-600 px-3 py-1 rounded hover:bg-green-50 transition-colors duration-200"
                >
                  Signup
                </Link>
              </li>
            </>
          ) : (
            // USER NAV LINKS -> PAGE-BASED
            <>
              <li>
                <button
                  onClick={() => handleUserNav("/user/dashboard")}
                  className="text-sm font-medium text-gray-700 hover:text-green-800 transition-colors duration-200"
                >
                  Dashboard
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleUserNav("/user/profile")}
                  className="text-sm font-medium text-gray-700 hover:text-green-800 transition-colors duration-200"
                >
                  Profile
                </button>
              </li>

              <li>
                <button
                  onClick={() => handleUserNav("/user/news")}
                  className="text-sm font-medium text-gray-700 hover:text-green-800 transition-colors duration-200"
                >
                  News
                </button>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors duration-200"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
