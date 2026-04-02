/*
  PURPOSE:
  - Collect weather-related inputs from user
  - Trigger prediction (UI-only for now)
  - Controlled form using React state
*/

import { useState } from "react";

const WeatherForm = ({ onPredict, loading }) => {

  // Form state
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      N: Number(formData.N),
      P: Number(formData.P),
      K: Number(formData.K),
      temperature: Number(formData.temperature),
      humidity: Number(formData.humidity),
      ph: Number(formData.ph),
      rainfall: Number(formData.rainfall),
    };

    onPredict(payload); // 🔥 send data UP
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card space-y-4 animate-fade-in"
    >
      <h3 className="text-xl font-semibold text-emerald-300">
        Soil & Weather Parameters
      </h3>

      {["N", "P", "K", "temperature", "humidity", "ph", "rainfall"].map(
        (field) => (
          <input
            id={field}
            key={field}
            name={field}
            type="number"
            placeholder={field.toUpperCase()}
            value={formData[field]}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-emerald-400"
          />
        ),
      )}

      <button
        id="predict-btn"
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-linear-to-r from-emerald-400 to-lime-400 text-black font-semibold hover:scale-105 transition disabled:opacity-60"
      >
        {loading ? "Predicting..." : "Predict Crop"}
      </button>
    </form>
  );
};

export default WeatherForm;
