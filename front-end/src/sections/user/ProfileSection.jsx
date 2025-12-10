/*
  ProfileSection Component
  ------------------------
  - Appears in User Mode (/user page)
  - Displays basic user profile details (placeholder for now)
  - Animated on scroll using Framer Motion
  - Uses TailwindCSS for modern UI
*/

import React from "react";
import { motion } from "framer-motion";

const ProfileSection = () => {
  return (
    <section
      id="profile"
      className="min-h-screen bg-white py-16 px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1 }}
        className="max-w-5xl mx-auto bg-gray-50 rounded-2xl shadow-lg p-10"
      >
        <h2 className="text-4xl font-bold text-green-700 mb-8 text-center">
          Your Profile
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Placeholder profile information */}
          <div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Name
            </h3>
            <p className="text-gray-600">John Doe (replace with real data later)</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Email
            </h3>
            <p className="text-gray-600">john@example.com (dynamic later)</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Account Type
            </h3>
            <p className="text-gray-600">Standard User</p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-green-900 mb-2">
              Joined On
            </h3>
            <p className="text-gray-600">Jan 2025</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProfileSection;
