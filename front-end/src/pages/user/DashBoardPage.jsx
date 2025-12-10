/*
  DashboardPage
  -------------
  - Displays the user's dashboard content as a full page.
  - This is a page (not a section) and will be reachable at /user/dashboard.
  - Uses Tailwind + Framer Motion for visuals (optional).
*/

import React from "react";
import { motion } from "framer-motion";

const DashboardPage = () => {
  return (
    <section className="min-h-screen bg-green-50 py-16 px-6" id="user-dashboard">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">Dashboard</h1>
        <p className="text-green-700 mb-6">
          Welcome to your dashboard. Here you'll see crop recommendations, recent predictions,
          and quick actions.
        </p>

        {/* Placeholder content - replace with real widgets/components later */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border border-green-100">
            <h3 className="font-semibold text-green-800">Latest Recommendation</h3>
            <p className="text-gray-600 text-sm mt-2">No recommendations yet.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-green-100">
            <h3 className="font-semibold text-green-800">Weather Snapshot</h3>
            <p className="text-gray-600 text-sm mt-2">Local weather will be shown here.</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border border-green-100">
            <h3 className="font-semibold text-green-800">Quick Actions</h3>
            <p className="text-gray-600 text-sm mt-2">Predict | Upload data | View logs</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default DashboardPage;
