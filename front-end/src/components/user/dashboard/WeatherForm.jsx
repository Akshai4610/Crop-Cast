// WeatherForm.jsx
/*
  PURPOSE:
  - Collect weather-related inputs from user
  - Trigger prediction (UI-only for now)
  - Controlled form using React state
*/

import { useState } from "react";

const WeatherForm = ({ onPredict }) => {
  // Local form state
  const [formData, setFormData] = useState({
    temperature: "",
    humidity: "",
    rainfall: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict(formData); // pass data to parent
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card space-y-4 animate-fade-in"
    >
      <h3 className="text-xl font-semibold text-emerald-300">
        Weather Parameters
      </h3>

      <input
        name="temperature"
        type="number"
        placeholder="Temperature (°C)"
        value={formData.temperature}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-emerald-400"
      />

      <input
        name="humidity"
        type="number"
        placeholder="Humidity (%)"
        value={formData.humidity}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-emerald-400"
      />

      <input
        name="rainfall"
        type="number"
        placeholder="Rainfall (mm)"
        value={formData.rainfall}
        onChange={handleChange}
        className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-emerald-400"
      />

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-lime-400 text-black font-semibold hover:scale-105 transition"
      >
        Predict Crop
      </button>
    </form>
  );
};

export default WeatherForm;
