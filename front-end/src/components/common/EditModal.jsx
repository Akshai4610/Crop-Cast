import { useState, useEffect, useMemo } from "react";

/*
=====================================================
EDIT MODAL (STABLE)
✔ Save enabled only if data actually changed
✔ Clean number conversion
✔ Parent handles API
=====================================================
*/

export default function EditModal({ isOpen, data, onClose, onSave }) {

  const [formData, setFormData] = useState({});
  const [originalData, setOriginalData] = useState({});

  /* Load data into state */
  useEffect(() => {
    if (data) {
      setFormData(data);
      setOriginalData(data);
    }
  }, [data]);

  /* Remove _id and normalize values */
  const normalize = (obj) => {
    if (!obj) return {};

    const clean = {};

    Object.keys(obj).forEach((key) => {
      if (key !== "_id") {
        clean[key] = String(obj[key] ?? "").trim();
      }
    });

    return clean;
  };

  /* Detect change */
  const isChanged = useMemo(() => {

    const a = JSON.stringify(normalize(formData));
    const b = JSON.stringify(normalize(originalData));

    return a !== b;

  }, [formData, originalData]);

  /* Handle input change */
  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

  };

  /* Save */
  const handleSave = () => {

    if (!isChanged) return;

    const cleanData = {};

    Object.keys(formData).forEach((key) => {

      if (key !== "_id") {

        cleanData[key] =
          key === "label"
            ? formData[key]
            : Number(formData[key]);

      }

    });

    onSave(cleanData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">

      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-xl p-6 max-h-[90vh] overflow-y-auto">

        <h2 className="text-lg font-semibold text-white mb-5">
          Edit Dataset
        </h2>

        {/* INPUTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          {Object.keys(formData).map((key) => {

            if (key === "_id") return null;

            return (
              <input
                key={key}
                name={key}
                value={formData[key] ?? ""}
                onChange={handleChange}
                className="p-2 rounded-lg bg-gray-800 text-white outline-none focus:ring-2 focus:ring-blue-500"
              />
            );

          })}

        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-sm"
          >
            Cancel
          </button>

          <button
            disabled={!isChanged}
            onClick={handleSave}
            className={`px-4 py-2 rounded-lg text-sm ${
              !isChanged
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Save
          </button>

        </div>

      </div>

    </div>
  );
}