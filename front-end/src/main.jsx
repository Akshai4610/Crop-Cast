// PURPOSE: Renders the main App component into the DOM.
// Only contains React DOM rendering logic—kept intentionally minimal.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";               // Main app component
import { AuthProvider } from "./context/AuthContext"; // Global authentication state provider
import "./styles/globals.css";        // Tailwind global styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Wrapping the entire application in AuthProvider so login state is available everywhere */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
