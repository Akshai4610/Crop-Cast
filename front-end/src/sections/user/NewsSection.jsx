/*
  NewsSection Component
  ---------------------
  - Contains weather updates or agricultural news
  - Will later fetch real-time data from backend API
  - Animated with Framer Motion
  - TailwindCSS for UI
*/

import React from "react";
import { motion } from "framer-motion";

const NewsSection = () => {
  return (
    <section
      id="news"
      className="min-h-screen bg-green-50 py-16 px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-4xl font-bold text-green-800 mb-6 text-center">
          Latest Agriculture News
        </h2>

        {/* Placeholder cards - replace with API data later */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {["Monsoon updates", "New government schemes", "Farming tips"].map(
            (item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="p-6 bg-white shadow-lg rounded-xl border border-green-200"
              >
                <h3 className="text-xl font-semibold text-green-700 mb-2">
                  {item}
                </h3>
                <p className="text-gray-600 text-sm">
                  Dummy text for news item. This will later be replaced with backend data.
                </p>
              </motion.div>
            )
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default NewsSection;
