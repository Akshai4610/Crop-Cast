/*
========================================================
CropForm (FINAL PRODUCTION STABLE VERSION)
✔ Fix server error on update
✔ Upload + URL image modes
✔ Image preview + remove
✔ Clean update payload
✔ Prevent update without change
✔ Better UX
========================================================
*/

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { addCrop, updateCrop } from "../../../services/api";
import { useToast } from "../../../context/ToastContext";

export default function CropForm({ refresh, editData, setEditData }) {
  const { showToast } = useToast();

  /* ========================================================
     EMPTY FORM STRUCTURE (ONLY ALLOWED FIELDS)
  ======================================================== */
  const emptyForm = {
    name: "",
    description: "",
    growth_tips: "",
    climate: "",
    image_url: "",
  };

  const [form, setForm] = useState(emptyForm);
  const [originalData, setOriginalData] = useState(null);
  const [imageMode, setImageMode] = useState("upload"); // upload | url
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const editing = Boolean(editData);

  /* ========================================================
     LOAD EDIT DATA SAFELY (ONLY REQUIRED FIELDS)
  ======================================================== */
  useEffect(() => {
    if (editData) {
      const cleanData = {
        name: editData.name || "",
        description: editData.description || "",
        growth_tips: editData.growth_tips || "",
        climate: editData.climate || "",
        image_url: editData.image_url || "",
      };

      setForm(cleanData);
      setOriginalData(cleanData);

      // auto-detect image mode
      if (editData.image_url?.startsWith("data:")) {
        setImageMode("upload");
      } else {
        setImageMode("url");
      }
    } else {
      setForm(emptyForm);
      setOriginalData(null);
      setImageMode("upload");
    }
  }, [editData]);

  /* ========================================================
     CHECK IF FORM CHANGED
  ======================================================== */
  const isChanged = useMemo(() => {
    if (!editing || !originalData) return false;

    return (
      form.name !== originalData.name ||
      form.description !== originalData.description ||
      form.growth_tips !== originalData.growth_tips ||
      form.climate !== originalData.climate ||
      form.image_url !== originalData.image_url
    );
  }, [form, originalData, editing]);

  /* ========================================================
     SUBMIT LOGIC
  ======================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setError("Crop name is required");
      return;
    }

    if (editing && !isChanged) {
      showToast("error", "No changes detected");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ✅ CLEAN & SAFE PAYLOAD
      const payload = {};

      Object.keys(form).forEach((key) => {
        const value = form[key];

        // send only non-empty values
        if (value !== "" && value !== null && value !== undefined) {
          payload[key] = typeof value === "string" ? value.trim() : value;
        }
      });

      // Always ensure name is included
      payload.name = form.name.trim();

      if (editing) {
        await updateCrop(editData._id ?? editData.id, payload);
        showToast("success", "Crop updated successfully 🌾");
      } else {
        await addCrop(payload);
        showToast("success", "Crop added successfully 🌱");
      }

      await refresh?.();
      setForm(emptyForm);
      setEditData(null);
    } catch (error) {
      showToast(
        "error",
        error.response?.data?.detail || "Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditData(null);
    setForm(emptyForm);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700 max-w-md w-full mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <h3 className="text-xl font-bold text-emerald-400">
          {editing ? "Edit Crop 🌾" : "Add New Crop 🌱"}
        </h3>

        {error && (
          <p className="bg-red-500 text-white p-2 rounded-lg text-sm">
            {error}
          </p>
        )}

        {/* =========================================================
            BASIC FIELDS
        ========================================================= */}
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Crop Name"
          className="w-full p-3 rounded-xl bg-slate-700 text-white outline-none"
        />

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="w-full p-3 rounded-xl bg-slate-700 text-white outline-none"
        />

        <textarea
          value={form.growth_tips}
          onChange={(e) => setForm({ ...form, growth_tips: e.target.value })}
          placeholder="Growth Tips"
          className="w-full p-3 rounded-xl bg-slate-700 text-white outline-none"
        />

        <input
          value={form.climate}
          onChange={(e) => setForm({ ...form, climate: e.target.value })}
          placeholder="Climate"
          className="w-full p-3 rounded-xl bg-slate-700 text-white outline-none"
        />

        {/* =========================================================
            🖼 IMAGE SECTION (Compact & Stable)
        ========================================================= */}
        <div className="space-y-3">
          <p className="text-sm text-gray-300">Crop Image</p>

          {form.image_url ? (
            <div className="relative w-32 h-32">
              <img
                src={form.image_url}
                alt="preview"
                className="w-32 h-32 object-cover rounded-xl border border-emerald-400"
              />

              <button
                type="button"
                onClick={() => setForm({ ...form, image_url: "" })}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs 
                w-6 h-6 rounded-full flex items-center justify-center shadow-md"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              {/* Toggle Buttons */}
              <div className="flex gap-2 bg-slate-700 p-1 rounded-xl w-fit">
                <button
                  type="button"
                  onClick={() => setImageMode("upload")}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    imageMode === "upload"
                      ? "bg-emerald-400 text-black"
                      : "text-gray-300"
                  }`}
                >
                  Upload
                </button>

                <button
                  type="button"
                  onClick={() => setImageMode("url")}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    imageMode === "url"
                      ? "bg-emerald-400 text-black"
                      : "text-gray-300"
                  }`}
                >
                  URL
                </button>
              </div>

              {/* Upload Mode */}
              {imageMode === "upload" && (
                <label
                  className="flex items-center justify-center 
                  border border-emerald-400 text-emerald-400 
                  px-4 py-2 rounded-xl cursor-pointer text-sm 
                  hover:bg-emerald-400 hover:text-black transition w-fit"
                >
                  Select Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setForm({
                          ...form,
                          image_url: reader.result,
                        });

                      reader.readAsDataURL(file);
                    }}
                  />
                </label>
              )}

              {/* URL Mode */}
              {imageMode === "url" && (
                <input
                  type="text"
                  placeholder="Paste image URL..."
                  className="w-full p-2 rounded-xl bg-slate-700 text-white 
                  focus:ring-2 focus:ring-emerald-400 outline-none text-sm"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image_url: e.target.value,
                    })
                  }
                />
              )}
            </>
          )}
        </div>

        {/* SUBMIT BUTTON */}
        <button
          disabled={loading || (editing && !isChanged)}
          className={`w-full py-3 rounded-xl font-semibold transition ${
            editing && !isChanged
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-emerald-400 text-black hover:scale-[1.03]"
          }`}
        >
          {loading ? "Saving..." : editing ? "Update Crop" : "Add Crop"}
        </button>

        {editing && (
          <button
            type="button"
            onClick={cancelEdit}
            className="w-full py-2 rounded-xl bg-red-400 text-black"
          >
            Cancel Edit
          </button>
        )}
      </form>
    </motion.div>
  );
}
