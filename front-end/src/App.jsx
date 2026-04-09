import { Suspense } from "react";
/*
  App (FINAL SECURE VERSION)
  - JWT Protected Routing
  - Admin + User separation
*/

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Protected routes */
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import UserProtectedRoute from "./routes/UserProtectedRoute";

/* Public pages */
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import SignupPage from "./pages/public/SignupPage";
import { hasPremium, PremiumPlayground, PremiumVirtualFarm } from "./utils/premium-registry";

/* Admin pages */
import AdminCropManagementPage from "./pages/admin/CropManagementPage";
import AdminUserManagementPage from "./pages/admin/UserManagementPage";
import AdminNewsManagementPage from "./pages/admin/NewsManagementPage";

/* User layout + pages */
import UserLayout from "./layouts/UserLayout";
import DashboardPage from "./pages/user/DashBoardPage";
import ProfilePage from "./pages/user/ProfilePage";
import NewsPage from "./pages/user/NewsPage";
import HistoryPage from "./pages/user/HistoryPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        {hasPremium && (
          <Route path="/playground" element={
            <Suspense fallback={null}>
              <PremiumPlayground />
            </Suspense>
          } />
        )}

        {/* ================= ADMIN ================= */}
        <Route
          path="/admin/crops"
          element={
            <AdminProtectedRoute>
              <AdminCropManagementPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/dataset"
          element={
            <AdminProtectedRoute>
              <AdminCropManagementPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <AdminUserManagementPage />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/news"
          element={
            <AdminProtectedRoute>
              <AdminNewsManagementPage />
            </AdminProtectedRoute>
          }
        />

        {/* ================= USER ================= */}
        <Route
          path="/user"
          element={
            <UserProtectedRoute>
              <UserLayout />
            </UserProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="news" element={<NewsPage />} />
          {hasPremium && (
            <Route path="virtual-farm" element={
              <Suspense fallback={null}>
                <PremiumVirtualFarm />
              </Suspense>
            } />
          )}

          {/* default */}
          <Route index element={<DashboardPage />} />
        </Route>

        {/* ================= FALLBACK ================= */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
