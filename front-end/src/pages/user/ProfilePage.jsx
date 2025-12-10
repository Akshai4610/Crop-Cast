/*
  ProfilePage
  -----------
  - User profile page (full page)
  - Reachable at /user/profile
  - Replace placeholders with real data later.
*/

import { motion } from "framer-motion";

const ProfilePage = () => {
  return (
    <section className="min-h-screen bg-white py-16 px-6" id="user-profile">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 shadow"
      >
        <h1 className="text-3xl font-bold text-green-800 mb-4">Profile</h1>
        <p className="text-green-700 mb-6">Manage your account details and preferences.</p>

        {/* Profile details (static placeholders) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <div className="mt-1 text-gray-800">John Doe</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="mt-1 text-gray-800">john@example.com</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Account Type</label>
            <div className="mt-1 text-gray-800">Standard User</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <div className="mt-1 text-gray-800">Jan 2025</div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default ProfilePage;
