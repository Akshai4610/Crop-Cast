/*
  UserLayout
  ----------
  - Wraps user pages with the user-mode Navbar and the Footer.
  - Uses react-router's Outlet to render nested user pages.
  - Keeps layout consistent across /user/* pages.
  - Place this file under src/pages/user/
*/

import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

const UserLayout = () => {
  return (
    <div className="relative min-h-screen">
      {/* Navbar in user mode (pass prop) */}
      <Navbar userMode={true} />

      {/* Page content: leave space for fixed navbar using mt-16 or similar */}
      <main className="mt-16">
        {/* Nested route content will render here */}
        <Outlet />
      </main>

      {/* Footer (sticky at bottom) */}
      <Footer />
    </div>
  );
};

export default UserLayout;