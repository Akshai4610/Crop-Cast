import { useState } from "react";
import { addCropDetails } from "../../../services/api";

/**
 * Component to add crop details
 * Shown only when crop info is missing
 */
const AddCropDetails = ({ cropName, onSuccess }) => {
  const [form, setForm] = useState({
    growth_period: "",
    climate: "",
    soil: "",
    water: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await addCropDetails({
      crop_name: cropName,
      ...form,
    });
    onSuccess();
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
          onChange={handleChange}
          className="w-full p-2 rounded bg-white/20 text-white"
        />
      ))}

      <button
        onClick={handleSubmit}
        className="w-full py-2 bg-emerald-400 rounded text-black"
      >
        Save Crop Details
      </button>
    </div>
  );
};

export default AddCropDetails;
