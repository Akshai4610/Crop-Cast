import { useEffect, useState, useMemo } from "react";
import { useToast } from "../../../context/ToastContext";

const initialState = {
  N: "", P: "", K: "",
  temperature: "", humidity: "",
  ph: "", rainfall: "",
  label: "",
};

export default function DatasetForm({ initialData, onSave, onCancel }) {
  const [row, setRow] = useState(initialState);
  const [original, setOriginal] = useState(null);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  // ================= LOAD EDIT DATA =================
  useEffect(() => {
    if (initialData) {
      const { index, ...clean } = initialData; // remove index
      setRow(clean);
      setOriginal(clean);
    } else {
      setRow(initialState);
      setOriginal(null);
    }
  }, [initialData]);

  // ================= INPUT CHANGE =================
  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🔒 Prevent invalid numeric input
    if (name !== "label") {
      if (value === "" || /^-?\d*\.?\d*$/.test(value)) {
        setRow((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setRow((prev) => ({ ...prev, [name]: value }));
    }
  };

// ================= NORMALIZE =================
const normalize = (obj) => {
  const clean = {};

  Object.keys(obj).forEach((k) => {
    if (k === "label") {
      clean[k] = String(obj[k]).trim().toLowerCase();
    } else {
      const num = Number(obj[k]);
      clean[k] = Number.isNaN(num) ? "" : (Number.isInteger(num) ? num : num);
    }
  });

  return clean;
};

// ================= EMPTY CHECK =================
const isEmpty = useMemo(() => {
  return Object.values(row).some((v) => v === "");
}, [row]);

// ================= SAME CHECK =================
const isSame = useMemo(() => {
  if (!original) return false;

  return JSON.stringify(normalize(row)) === JSON.stringify(normalize(original));
}, [row, original]);

// ================= FINAL VALID =================
const isValid = useMemo(() => {
  // ADD MODE
  if (!initialData) {
    return !isEmpty;
  }

  // EDIT MODE
  return !isEmpty && !isSame;
}, [isEmpty, isSame, initialData]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid || loading) return;

    setLoading(true);

    try {
      await onSave(row);

      showToast("success", initialData ? "Updated successfully" : "Added successfully");

      setRow(initialState);
      setOriginal(null);
      onCancel?.();

    } catch (err) {
      showToast("error", err.message || "Something went wrong");
    }

    setLoading(false);
  };

  // ================= UI =================
  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      <h2 className="text-xl font-semibold text-white">
        {initialData ? "✏️ Edit Dataset" : "➕ Add Dataset"}
      </h2>

      <div className="grid grid-cols-2 gap-3">

        {Object.keys(row).map((key) => (
          <input
            key={key}
            name={key}
            value={row[key]}
            onChange={handleChange}
            placeholder={key}
            className="bg-gray-800 border border-gray-700 focus:border-green-500 focus:ring-1 focus:ring-green-500 p-2 rounded text-white outline-none transition"
          />
        ))}

      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="flex gap-3">

        <button
          type="submit"
          disabled={!isValid || loading}
          className={`px-4 py-2 rounded transition ${
            isValid
              ? "bg-green-600 hover:bg-green-500"
              : "bg-gray-700 cursor-not-allowed"
          }`}
        >
          {loading
            ? "Saving..."
            : initialData
            ? "Save Changes"
            : "Add Dataset"}
        </button>

        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded transition"
          >
            Cancel
          </button>
        )}

      </div>

      {/* ================= VALIDATION HINT ================= */}
      {!isValid && (
        <p className="text-sm text-gray-400">
          {isEmpty
            ? "⚠️ Fill all fields"
            : isSame
            ? "⚠️ No changes detected"
            : ""}
        </p>
      )}

    </form>
  );
}