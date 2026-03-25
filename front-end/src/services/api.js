// ======================================================
// 🌐 CENTRAL API SERVICE (FINAL FIXED)
// ======================================================

import axios from "axios";

// ======================================================
// AXIOS INSTANCE
// ======================================================
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ======================================================
// 🔐 AUTH
// ======================================================

export const registerUser = async (data) => {
  try {
    const res = await API.post("/auth/register", data);
    return res.data;
  } catch (error) {
    console.error("Register Error:", error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (data) => {
  try {
    const res = await API.post("/auth/login", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// ======================
// 👤 PROFILE
// ======================

export const getProfile = async (email) => {
  const res = await API.get(`/auth/profile/${email}`);
  return res.data;
};

export const updateProfile = async (email, data) => {
  const res = await API.put(`/auth/profile/${email}`, data);
  return res.data;
};

// ======================================================
// 🌱 CROP PREDICTION
// ======================================================

export const predictCrop = async (formData) => {
  try {
    const payload = {
      email: localStorage.getItem("username"),

      N: Number(formData.N),
      P: Number(formData.P),
      K: Number(formData.K),
      temperature: Number(formData.temperature),
      humidity: Number(formData.humidity),
      ph: Number(formData.ph),
      rainfall: Number(formData.rainfall),
    };

    const response = await API.post("/predictions", payload);
    return response.data;

  } catch (error) {
    console.error("Prediction error:", error.response?.data || error.message);
    throw error;
  }
};

// ======================================================
// 📜 HISTORY
// ======================================================

export const getPredictionHistory = async (email) => {
  const res = await API.get(`/predictions/${email}`);
  return res.data;
};

// ======================================================
// 🌾 CROPS
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
// 🧑‍🌾 ADMIN CROPS
// ======================================================

export const getAllCrops = async () => {
  const res = await API.get("/admin/crops/");
  return res.data;
};

export const addCrop = async (data) => {
  const res = await API.post("/admin/crops/", data);
  return res.data;
};

export const updateCrop = async (id, data) => {
  return await API.put(`/admin/crops/${id}/`, data);
};

export const deleteCrop = async (id) => {
  return await API.delete(`/admin/crops/${id}/`);
};

// ======================================================
// 📊 DATASET
// ======================================================

export const getDatasetRows = async (params) => {
  const res = await API.get("/admin/dataset/", { params });
  return res.data;
};

export const addDatasetRow = async (data) => {
  try {
    const res = await API.post("/admin/dataset/", data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || "Server error");
  }
};

export const updateDatasetRow = async (id, data) => {
  const res = await API.put(`/admin/dataset/${id}`, data);
  return res.data;
};

export const deleteDatasetRow = async (id) => {
  const res = await API.delete(`/admin/dataset/${id}`);
  return res.data;
};

export const retrainModel = async () => {
  const res = await API.post("/admin/dataset/retrain");
  return res.data;
};

export const getModelMetrics = async () => {
  const res = await API.get("/admin/dataset/model-metrics");
  return res.data;
};

export const getTrainingStatus = async () => {
  const res = await API.get("/admin/dataset/training-status");
  return res.data;
};

// ======================================================
// 👤 USERS
// ======================================================

export const getUsers = async (page = 1, search = "", sort = "az") => {
  const res = await API.get("/admin/users", {
    params: { page, search, sort }
  });
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await API.delete(`/admin/users/${id}`);
  return res.data;
};

export const blockUser = async (id) => {
  const res = await API.put(`/admin/users/block/${id}`);
  return res.data;
};

// ======================================================
// 📰 NEWS (FIXED 🔥)
// ======================================================

// GET NEWS
export const getNews = async (category = "") => {
  try {
    const res = await API.get("/news/", {
      params: category ? { category } : {},
    });
    return res.data;
  } catch (err) {
    console.error("Get News Error:", err.response?.data || err.message);
    throw err;
  }
};

// ADD NEWS (✅ FIXED)
export const addNews = async (formData) => {
  try {
    // 🚨 REMOVE WRONG FIELD IF EXISTS
    formData.delete("image");

    const res = await API.post("/news/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;

  } catch (error) {
    console.error("Add News Error:", error.response?.data || error.message);
    throw error;
  }
};

// UPDATE NEWS (✅ FIXED)
export const updateNews = async (id, formData) => {
  try {
    formData.delete("image"); // 🚨 IMPORTANT

    const res = await API.put(`/news/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;

  } catch (error) {
    console.error("Update News Error:", error.response?.data || error.message);
    throw error;
  }
};

// DELETE
export const deleteNews = async (id) => {
  return await API.delete(`/news/${id}`);
};

// ======================
// LIKE (FIXED ✅)
// ======================
export const likeNews = async (id) => {
  try {
    const email = localStorage.getItem("username");

    const formData = new FormData();
    formData.append("email", email);

    const res = await API.post(`/news/${id}/like`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;

  } catch (error) {
    console.error("Like Error:", error.response?.data || error.message);
    throw error;
  }
};


// ======================
// DISLIKE (FIXED ✅)
// ======================
export const dislikeNews = async (id) => {
  try {
    const email = localStorage.getItem("username");

    const formData = new FormData();
    formData.append("email", email);

    const res = await API.post(`/news/${id}/dislike`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;

  } catch (error) {
    console.error("Dislike Error:", error.response?.data || error.message);
    throw error;
  }
};

// ======================
// Comments
// ======================
export const addComment = async (id, text) => {
  const email = localStorage.getItem("username");

  const formData = new FormData();
  formData.append("email", email);
  formData.append("text", text);

  return await API.post(`/news/${id}/comments`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getComments = async (id) => {
  const res = await API.get(`/news/${id}/comments`);
  return res.data;
};

export const deleteComment = async (id, text) => {
  try {
    const email = localStorage.getItem("username");

    const res = await API.delete(`/news/${id}/comments`, {
      data: {
        email,
        text,
      },
    });

    return res.data;

  } catch (error) {
    console.error("Delete comment error:", error);
    throw error;
  }
};

// ======================================================
// 🌦 FREE WEATHER API (NO LOGIN 🔥)
// Source: open-meteo.com
// ======================================================

const WEATHER_API = axios.create({
  baseURL: import.meta.env.VITE_WEATHER_API_URL,
});

// Get current weather by coordinates
export const getWeather = async (lat, lon) => {
  try {
    const res = await WEATHER_API.get("/forecast", {
      params: {
        latitude: lat,
        longitude: lon,
        current_weather: true,
      },
    });

    return res.data.current_weather;

  } catch (error) {
    console.error("Weather API Error:", error.message);
    throw error;
  }
};

// Example for Kochi 🌴
export const getKochiWeather = () => getWeather(9.9312, 76.2673);