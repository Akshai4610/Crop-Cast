// front-end/src/components/user/history/HistoryToolbar.jsx

import { useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";
import DeleteHistoryModal from "../../common/DeleteHistoryModal";

const HistoryToolbar = ({ onFilter, historyData, onDelete }) => {
  const [dateFilter, setDateFilter] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleDate = (value) => {
    setDateFilter(value);
    onFilter(value);
  };

  return (
    <>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-wrap gap-3 justify-between items-center mb-6
        bg-gray-900 p-4 rounded-xl border border-gray-700"
      >
        {/* LEFT: DATE */}
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => handleDate(e.target.value)}
          className="bg-gray-800 px-3 py-2 rounded-lg text-sm text-white"
        />

        {/* RIGHT: BIN */}
        <button
          onClick={() => setShowModal(true)}
          className="bg-red-500/90 hover:bg-red-600 p-2 rounded-xl shadow-md transition"
        >
          <FiTrash2 className="text-white text-lg" />
        </button>
      </motion.div>

      {/* MODAL */}
      {showModal && (
        <DeleteHistoryModal
          historyData={historyData}
          onConfirm={onDelete}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default HistoryToolbar;