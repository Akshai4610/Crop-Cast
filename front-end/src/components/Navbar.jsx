import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar({ isLoggedIn }) {
  // isLoggedIn = boolean from parent (App.jsx)
  // It changes menu items based on login status

  return (
    <nav className="w-full border-b border-gray-200 bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      
      {/* Brand Logo */}
      <Link to="/" className="text-xl font-bold">
        Vazhikkati
      </Link>

      {/* Menu Items */}
      <div className="flex items-center gap-6">
        
        {/* Public links always visible */}
        <NavItem label="Home" to="/" />
        <NavItem label="Places" to="/places" />

        {/* If the user is logged in show user menu, else show login */}
        {isLoggedIn ? (
          <>
            <NavItem label="Dashboard" to="/user/dashboard" />
            <NavItem label="Logout" to="/logout" />
          </>
        ) : (
          <NavItem label="Login" to="/login" />
        )}
      </div>
    </nav>
  );
}

// Reusable nav item component with hover animation
function NavItem({ label, to }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }}>
      <Link 
        to={to}
        className="text-gray-700 hover:text-black transition-colors duration-200"
      >
        {label}
      </Link>
    </motion.div>
  );
}
