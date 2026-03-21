import { motion, AnimatePresence } from "framer-motion";

export default function UserDetailsModal({ open, user, onClose }) {
  if (!open || !user) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-gray-900 text-white rounded-2xl p-8 w-96 space-y-4 border border-indigo-500/20"
        >
          <h2 className="text-lg font-semibold text-indigo-400">
            User Details
          </h2>

          <img
            src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.fullname}`}
            className="w-16 h-16 rounded-full"
          />

          <p>
            <strong>Name:</strong> {user.fullname}
          </p>

          <p>
            <strong>Email:</strong> {user.email}
          </p>

          <p>
            <strong>Status:</strong>{" "}
            {user.blocked ? (
              <span className="text-red-400">Blocked</span>
            ) : (
              <span className="text-green-400">Active</span>
            )}
          </p>

          <button
            onClick={onClose}
            className="w-full bg-indigo-500 py-2 rounded-xl"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}