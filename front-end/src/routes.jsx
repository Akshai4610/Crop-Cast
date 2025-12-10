// - Defines all routes for public, user, and admin sections.
// - Uses auth context to determine which set of pages to show.
// - Keeps App.jsx clean and minimal.

import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// PUBLIC PAGES
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import SignupPage from "./pages/public/SignupPage";

// USER PAGES
import DashboardPage from "./pages/user/DashboardPage";
import ProfilePage from "./pages/user/ProfilePage";
import NewsPage from "./pages/user/NewsPage";

// ADMIN PAGES
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

export default function AppRoutes() {
  const { isAuthenticated, userRole } = useAuth(); 
  // isAuthenticated → true/false
  // userRole → "user" | "admin"

  return (
    <Routes>

      {/* PUBLIC ROUTES - only shown when NOT logged in */}
      {!isAuthenticated && (
        <>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </>
      )}

      {/* USER ROUTES */}
      {isAuthenticated && userRole === "user" && (
        <>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/news" element={<NewsPage />} />
        </>
      )}

      {/* ADMIN ROUTES */}
      {isAuthenticated && userRole === "admin" && (
        <>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </>
      )}

      {/* IF NO MATCH → REDIRECT TO HOME */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}