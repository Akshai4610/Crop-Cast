// front-end/src/components/common/DeleteHistoryModal.jsx

import { useState } from "react";
import { motion } from "framer-motion";
import Toast from "./Toast";

const ranges = [
  { label: "One by one", value: "selcted history" },
  { label: "Last hour", value: "1h" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 4 weeks", value: "4w" },
  { label: "All time", value: "all" },
];

const DeleteHistoryModal = ({ historyData = [], onConfirm, onClose }) => {
  const [range, setRange] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const [toast, setToast] = useState(null);

  // ✅ Checkbox toggle
  const handleCheckbox = (timestamp) => {
    setSelectedItems((prev) => ({
      ...prev,
      [timestamp]: !prev[timestamp],
    }));
  };

  // ✅ DELETE HANDLER (FULL FIX)
  const handleDelete = async () => {
    try {
      // ❌ No history
      if (historyData.length === 0) {
        setToast({ type: "error", message: "No history to delete!" });
        return;
      }

      // ❌ No range selected
      if (!range) {
        setToast({ type: "error", message: "Please select a delete option!" });
        return;
      }

      // ✅ ONE BY ONE DELETE
      if (range === "selcted history") {
        const itemsToDelete = Object.keys(selectedItems).filter(
          (t) => selectedItems[t]
        );

        if (itemsToDelete.length === 0) {
          setToast({ type: "error", message: "Select at least one item!" });
          return;
        }

        await onConfirm({ timestamps: itemsToDelete });
      }

      // ✅ RANGE DELETE
      else {
        await onConfirm({ range });
      }

      // ✅ SUCCESS
      setToast({ type: "success", message: "Deleted successfully!" });

      // auto close after short delay
      setTimeout(() => {
        onClose();
      }, 500);

    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Delete failed!" });
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-slate-900 p-6 rounded-xl w-96 max-w-full"
        >
          <h2 className="text-lg font-bold text-red-400 mb-4">
            Delete History
          </h2>

          {/* 🔥 DROPDOWN RANGE SELECTOR */}
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="w-full mb-4 bg-gray-800 text-white p-2 rounded"
          >
            <option value="">Select delete option</option>
            {ranges.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>

          {/* 🔥 ONE-BY-ONE CHECKBOX LIST */}
          {range === "selcted history" && (
            <div className="max-h-52 overflow-y-auto mb-4 border border-gray-700 p-2 rounded">
              {historyData.length > 0 ? (
                historyData.map((item) => (
                  <label
                    key={item.timestamp}
                    className="flex items-center gap-2 p-2 hover:bg-gray-800 rounded transition"
                  >
                    <input
                      type="checkbox"
                      checked={!!selectedItems[item.timestamp]}
                      onChange={() => handleCheckbox(item.timestamp)}
                      className="accent-emerald-500 scale-110 transition-transform duration-200"
                    />

                    <span className="text-xs">
                      {item.predicted_crop} -{" "}
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </label>
                ))
              ) : (
                <p className="text-gray-400 text-sm">
                  No history available
                </p>
              )}
            </div>
          )}

          {/* 🔘 ACTION BUTTONS */}
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="bg-gray-600 px-3 py-1 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>

            <button
              onClick={handleDelete}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Clear Now
            </button>
          </div>
        </motion.div>
      </div>

      {/* 🔔 TOAST */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default DeleteHistoryModal;