// ======================================================
// Central place for ALL backend API calls
// ======================================================

import axios from "axios";

// ======================================================
// Axios instance
// baseURL already contains /api
// NEVER add /api again in routes
// ======================================================
const API = axios.create({
  baseURL: "http://localhost:8000",
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

// ======================================================
// 🔹 ADMIN → Crop CRUD
// ======================================================

// GET all crops
export const getAllCrops = async () => {
  const res = await API.get("/admin/crops/");
  return res.data;
};

// DELETE crop
export const deleteCrop = async (name) => {
  const res = await API.delete(`/admin/crops/${name}`);
  return res.data;
};

// ADD crop
export const addCrop = async (data) => {
  const res = await API.post("/admin/crops/", data);
  return res.data;
};

// UPDATE crop
export const updateCrop = async (name, data) => {
  const res = await API.put(`/admin/crops/${name}`, data);
  return res.data;
};

// ======================================================
// 🔹 ADMIN → Dataset rows (ML training data)
// ======================================================

export const addDatasetRow = async (data) => {
  const res = await API.post("/admin/dataset/", data);
  return res.data;
};

export const getDatasetRows = async () => {
  const res = await API.get("/admin/dataset/");
  return res.data;
};
