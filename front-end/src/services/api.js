// services/api.js
import axios from "axios";

// Base API URL
const API = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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
