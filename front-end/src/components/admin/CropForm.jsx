/*
========================================================
CropForm
- Add crop
- Edit crop
- Same form reused
- Image preview
- Professional styling
========================================================
*/

import { useState, useEffect } from "react";
import { addCrop, updateCrop } from "../../services/api";

export default function CropForm({ refresh, editData, setEditData }) {
  // =====================================================
  // Form state
  // =====================================================
  const [form, setForm] = useState({
    name: "",
    description: "",
    growth_tips: "",
    climate: "",
    image_url: "", // stores BOTH url or base64
  });

  const editing = !!editData;

  // =====================================================
  // Load edit data into form
  // =====================================================
  useEffect(() => {
    if (editData) setForm(editData);
  }, [editData]);

  // =====================================================
  // Handle input change
  // =====================================================
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // =====================================================
  // Handle file upload
  // Convert image -> base64 -> save in image_url
  // =====================================================
  const handleFileUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({
        ...form,
        image_url: reader.result, // base64 string
      });
    };

    reader.readAsDataURL(file);
  };

  // =====================================================
  // Submit form
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editing) {
        await updateCrop(form.name, form);
        alert("Crop updated successfully");
      } else {
        await addCrop(form);
        alert("Crop added successfully");
      }

      refresh(); // reload table

      // reset form
      setForm({
        name: "",
        description: "",
        growth_tips: "",
        climate: "",
        image_url: "",
      });

      setEditData(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-emerald-300">
        {editing ? "Update Crop" : "Add Crop"}
      </h3>

      {/* Crop name */}
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Crop Name"
        className="w-full p-3 rounded-xl bg-white/20"
        required
      />

      {/* Description */}
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="w-full p-3 rounded-xl bg-white/20"
      />

      {/* Growth tips */}
      <textarea
        name="growth_tips"
        value={form.growth_tips}
        onChange={handleChange}
        placeholder="Growth Tips"
        className="w-full p-3 rounded-xl bg-white/20"
      />

      {/* Climate */}
      <input
        name="climate"
        value={form.climate}
        onChange={handleChange}
        placeholder="Climate"
        className="w-full p-3 rounded-xl bg-white/20"
      />

      {/* ================= IMAGE URL ================= */}
      <input
        name="image_url"
        value={form.image_url.startsWith("data:") ? "" : form.image_url}
        onChange={handleChange}
        placeholder="Paste Image URL (optional)"
        className="w-full p-3 rounded-xl bg-white/20"
      />

      {/* ================= FILE UPLOAD ================= */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="w-full text-sm text-gray-300"
      />

      {/* ================= PREVIEW ================= */}
      {form.image_url && (
        <img
          src={form.image_url}
          alt="preview"
          className="w-40 h-40 object-cover rounded-xl border border-gray-600"
        />
      )}

      <button className="w-full bg-emerald-400 text-black py-2 rounded-xl">
        {editing ? "Update Crop" : "Add Crop"}
      </button>
    </form>
  );
}
