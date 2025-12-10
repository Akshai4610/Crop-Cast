// - Central global state for login/logout.
// - Stores user role (public/user/admin).
// - Switches UI between public and user mode.

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  // isAuthenticated → true after login
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // userRole → "public" | "user" | "admin"
  const [userRole, setUserRole] = useState("public");

  // Handles login
  const login = (role) => {
    setIsAuthenticated(true);
    setUserRole(role); // dynamically switch UI mode
  };

  // Handles logout
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole("public");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to access auth state anywhere
export const useAuth = () => useContext(AuthContext);