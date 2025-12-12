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
import UserLayout from "./layouts/UserLayout";
import DashboardPage from "./pages/user/DashBoardPage";
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
    </Router>
  );
}

export default App;
