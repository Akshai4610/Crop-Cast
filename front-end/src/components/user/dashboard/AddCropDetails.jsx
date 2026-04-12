import { useState } from "react";
import { addCropDetails } from "../../../services/api";

/**
 * Component: AddCropDetails
 * ------------------------
 * - Allows ADMIN to add missing crop details
 * - Shown only when crop info does not exist
 * - On success, parent component refreshes crop data
 */

const AddCropDetails = ({ cropName, onSuccess }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // 🔐 Security: only admin can add crop details
  if (!user || user.role !== "admin") {
    return (
      <div className="glass-card text-white/60">
        Crop details not available.
      </div>
    );
  }

  const [form, setForm] = useState({
    growth_period: "",
    climate: "",
    soil: "",
    water: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit crop details
  const handleSubmit = async () => {
    // Basic validation
    for (let key in form) {
      if (!form[key]) {
        setError("Please fill all fields");
        return;
      }
    }

    try {
      setLoading(true);
      setError("");

      await addCropDetails({
        crop_name: cropName,
        ...form,
      });

      onSuccess(); // 🔁 refresh crop info in parent

    } catch (err) {
      setError("Failed to save crop details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card space-y-3">
      <h3 className="text-emerald-300 font-semibold">
        Add Details for {cropName}
      </h3>

      {Object.keys(form).map((key) => (
        <input
          key={key}
          name={key}
          placeholder={key.replace("_", " ")}
          value={form[key]}
          onChange={handleChange}
          className="w-full p-2 rounded bg-white/20 text-white placeholder-white/60"
        />
      ))}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2 bg-emerald-400 rounded text-black font-semibold disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Crop Details"}
      </button>
    </div>
  );
};

export default AddCropDetails;
