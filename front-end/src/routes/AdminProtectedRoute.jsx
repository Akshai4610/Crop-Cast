/*
======================================================
🔐 Admin Protected Route (FINAL)
✔ Checks JWT token
✔ Allows only admin
✔ Redirects safely
======================================================
*/

import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ❌ Not admin
  if (role !== "admin") {
    return <Navigate to="/user/dashboard" replace />;
  }

  // ✅ Admin allowed
  return children;
};

export default AdminProtectedRoute;