// services/api.js
import axios from "axios";

// Base API URL
const API = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ML Prediction API (alias for clarity in dashboard)
export const predictCrop = async (formData) => {
  try {

    // Ensure numbers are sent (not strings)
    const payload = {
      nitrogen: Number(formData.nitrogen),
      phosphorus: Number(formData.phosphorus),
      potassium: Number(formData.potassium),
      temperature: Number(formData.temperature),
      humidity: Number(formData.humidity),
      ph: Number(formData.ph),
      rainfall: Number(formData.rainfall),
    };

    const response = await API.post("/predict", payload);
    return response.data;
  } catch (error) {
    console.error("Prediction error:", error.response?.data || error.message);
    throw error;
  }
};


// Crop Recommendation API
export const getCropRecommendation = async (cropData) => {
  try {
    const response = await API.post("/predict", cropData);
    return response.data; // { recommended_crop: "Wheat" }
  } catch (error) {
    console.error("Error fetching crop recommendation:", error);
    throw error;
  }
};

// Fetch crop details
export const getCropDetails = async (cropName) => {
  const res = await API.get(`/crop/${cropName}`);
  return res.data;
};

// Add crop details
export const addCropDetails = async (data) => {
  const res = await API.post("/crop/add", data);
  return res.data;
};
