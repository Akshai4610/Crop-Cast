/*
====================================================
DATASET FORM (ADMIN)
✔ Clean UI
✔ Backend duplicate validation
✔ Toast notifications
✔ Numeric conversion
✔ Mobile responsive
✔ Prevent double submit
====================================================
*/

import { useState } from "react";
import { addDatasetRow } from "../../../services/api";
import { useToast } from "../../../context/ToastContext";

/*
====================================================
INITIAL FORM STATE
====================================================
*/

const initialState = {
  N: "",
  P: "",
  K: "",
  temperature: "",
  humidity: "",
  ph: "",
  rainfall: "",
  label: "",
};

export default function DatasetForm({ refresh }) {

  const [row, setRow] = useState(initialState);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  /*
  ====================================================
  HANDLE INPUT CHANGE
  ====================================================
  */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setRow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /*
  ====================================================
  SUBMIT FORM
  ====================================================
  */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    /*
    ===============================================
    BASIC VALIDATION
    ===============================================
    */
    if (Object.values(row).some((v) => v === "")) {
      showToast("error", "All fields are required");
      return;
    }

    /*
    ===============================================
    CONVERT NUMERIC FIELDS
    ===============================================
    */
    const payload = {
      ...row,
      N: Number(row.N),
      P: Number(row.P),
      K: Number(row.K),
      temperature: Number(row.temperature),
      humidity: Number(row.humidity),
      ph: Number(row.ph),
      rainfall: Number(row.rainfall),
      label: row.label.trim().toLowerCase(),
    };

    setLoading(true);

    try {

      /*
      ===============================================
      API CALL
      Backend checks duplicates in:
      - crop_data.csv
      - admin_dataset.csv
      - MongoDB
      ===============================================
      */
      const res = await addDatasetRow(payload);

      showToast("success", res.message || "Dataset added successfully");

      /*
      ===============================================
      RESET FORM
      ===============================================
      */
      setRow(initialState);

      /*
      ===============================================
      REFRESH TABLE
      ===============================================
      */
      if (refresh) refresh();

    } catch (err) {

      /*
      ===============================================
      SHOW BACKEND ERROR
      ===============================================
      */
      const message =
        err?.response?.data?.detail ||
        err?.message ||
        "Failed to add dataset";

      showToast("error", message);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* TITLE */}
      <h2 className="text-xl font-semibold text-white">
        Add Training Data
      </h2>

      {/* INPUT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {Object.keys(row).map((key) => (

          <input
            key={key}
            name={key}
            value={row[key]}
            onChange={handleChange}
            placeholder={key}
            autoComplete="off"
            className="
              w-full
              px-3 py-2
              bg-gray-800
              border border-gray-700
              rounded-lg
              text-white
              text-sm
              focus:ring-2 focus:ring-emerald-500
              outline-none
              transition
            "
          />

        ))}

      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          bg-emerald-600
          hover:bg-emerald-700
          transition
          py-2.5
          rounded-lg
          font-semibold
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {loading ? "Adding Dataset..." : "Add Dataset"}
      </button>

    </form>
  );
}