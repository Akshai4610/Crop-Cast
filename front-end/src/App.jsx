/*
  App (minimal)
  - Keeps routing minimal
  - Registers public routes and nested /user/* routes using UserLayout
  - Do not add logic here; keep providers or auth elsewhere when ready
*/

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

/* Public pages */
import HomePage from "./pages/public/HomePage";
import LoginPage from "./pages/public/LoginPage";
import SignupPage from "./pages/public/SignupPage";

/* User layout + pages */
import UserLayout from "./pages/user/UserLayout";
import DashboardPage from "./pages/user/DashboardPage";
import ProfilePage from "./pages/user/ProfilePage";
import NewsPage from "./pages/user/NewsPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public area */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* User area (nested) */}
        <Route path="/user" element={<UserLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="news" element={<NewsPage />} />

          {/* Default /user -> redirect to /user/dashboard (simple fallback) */}
          <Route index element={<DashboardPage />} />
        </Route>

        {/* Fallback to home for all unmatched routes */}
        <Route path="*" element={<HomePage />} />
      </Routes>
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-6 right-6 p-4 bg-lime-400 text-black font-bold rounded-full shadow-xl
             hover:scale-110 transition-all z-50"
      >
        ↑
      </button>
    </Router>
  );
}

export default App;
