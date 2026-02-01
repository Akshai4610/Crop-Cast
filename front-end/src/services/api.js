// ======================================================
// services/api.js
// Central place for ALL backend API calls
// ======================================================

import axios from "axios";

// ======================================================
// Axios instance
// baseURL already contains /api
// NEVER add /api again in routes
// ======================================================
const API = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});


// ======================================================
// 🔹 Predict Crop + Save to DB
// ======================================================
export const predictCrop = async (formData) => {
  try {

    // ------------------------------------------
    // Backend expects email + values
    // email = logged user (stored during login)
    // ------------------------------------------
    const payload = {
      email: localStorage.getItem("username"), // or email

      N: Number(formData.N),
      P: Number(formData.P),
      K: Number(formData.K),
      temperature: Number(formData.temperature),
      humidity: Number(formData.humidity),
      ph: Number(formData.ph),
      rainfall: Number(formData.rainfall),
    };

    // POST → /api/predictions
    const response = await API.post("/predictions", payload);

    return response.data;

  } catch (error) {
    console.error("Prediction error:", error.response?.data || error.message);
    throw error;
  }
};


// ======================================================
// 🔹 Get Prediction History
// ======================================================
export const getPredictionHistory = async (email) => {
  const res = await API.get(`/predictions/${email}`);
  return res.data;
};


// ======================================================
// 🔹 Crop details
// ======================================================
export const getCropDetails = async (cropName) => {
  const res = await API.get(`/crop/${cropName}`);
  return res.data;
};

export const addCropDetails = async (data) => {
  const res = await API.post("/crop/add", data);
  return res.data;
};
