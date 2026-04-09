/*
======================================================
🔐 User Protected Route
✔ Requires login (JWT token)
✔ Works for both user & admin
======================================================
*/

import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // ❌ Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ✅ Logged in
  return children;
};

export default UserProtectedRoute;