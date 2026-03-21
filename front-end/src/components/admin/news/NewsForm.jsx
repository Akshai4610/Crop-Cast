/*
====================================================
🔥 FINAL PREMIUM NEWS FORM (BUG-FIXED ONLY)
✔ Image preview fixed
✔ Remove image fully resets
✔ File input reset FIXED
✔ Edit mode image works
✔ Base64 ready
✔ Text styling LIVE (FIXED)
✔ Alignment FIXED
✔ NO UI CHANGES
====================================================
*/

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { addNews, updateNews } from "../../../services/api";

// =========================================
// FONT SWITCH COMPONENT (FIXED ALIGNMENT)
// =========================================
function FontSwitcher({ form, setForm }) {
  const [useCustom, setUseCustom] = useState(false);

  return (
    <div className="space-y-4">
      <label className="text-sm text-gray-400">Text Styling</label>

      {/* TOGGLE */}
      <button
        type="button"
        onClick={() => setUseCustom(!useCustom)}
        className="px-3 py-2 bg-emerald-400 text-black rounded-lg text-sm"
      >
        {useCustom ? "Use Default Fonts" : "Use Custom Font URL"}
      </button>

      {/* FONT SELECT / URL */}
      <motion.div
        key={useCustom ? "custom" : "default"}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-3"
      >
        {!useCustom ? (
          <select
            value={form.fontFamily}
            onChange={(e) =>
              setForm({ ...form, fontFamily: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl"
          >
            <option value="sans-serif">Default</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
            <option value="Courier New">Courier New</option>
            <option value="cursive">Cursive</option>
            <option value="fantasy">Fantasy</option>
            <option value="Garamond">Garamond</option>
            <option value="Georgia">Georgia</option>
            <option value="Impact">Impact</option>
            <option value="Lucida Console">Lucida Console</option>
            <option value="monospace">Monospace</option>
            <option value="serif">Serif</option>
            <option value="Trebuchet MS">Trebuchet MS</option>
          </select>
        ) : (
          <input
            type="text"
            placeholder="Custom Font URL"
            value={form.fontUrl}
            onChange={(e) =>
              setForm({ ...form, fontUrl: e.target.value })
            }
            className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl"
          />
        )}
      </motion.div>

      {/* EXTRA CONTROLS */}
      <div className="grid grid-cols-3 gap-3 items-center">
        {/* FONT SIZE */}
        <input
          type="number"
          min="12"
          max="40"
          placeholder="Size"
          value={form.fontSize || ""}
          onChange={(e) =>
            setForm({ ...form, fontSize: e.target.value })
          }
          className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-xl text-sm w-full"
        />

        {/* FONT WEIGHT */}
        <select
          value={form.fontWeight || "normal"}
          onChange={(e) =>
            setForm({ ...form, fontWeight: e.target.value })
          }
          className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-xl text-sm w-full"
        >
          <option value="normal">Normal</option>
          <option value="bold">Bold</option>
          <option value="lighter">Light</option>
        </select>

        {/* COLOR */}
        <input
          type="color"
          value={form.color || "#ffffff"}
          onChange={(e) =>
            setForm({ ...form, color: e.target.value })
          }
          className="h-10 w-full rounded-xl border border-gray-600 bg-gray-800"
        />
      </div>

      {/* TEXT ALIGN */}
      <div className="flex gap-2">
        {["left", "center", "right"].map((align) => (
          <button
            key={align}
            type="button"
            onClick={() => setForm({ ...form, textAlign: align })}
            className={`px-3 py-1 rounded-lg text-sm ${
              form.textAlign === align
                ? "bg-emerald-400 text-black"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {align}
          </button>
        ))}
      </div>
    </div>
  );
}

// =========================================
// MAIN COMPONENT
// =========================================
export default function NewsForm({ news, onClose, refresh }) {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    title: news?.title || "",
    content: news?.content || "",
    category: news?.category || "general",
    fontFamily: news?.fontFamily || "sans-serif",
    fontUrl: news?.fontUrl || "",
    textAlign: news?.textAlign || "left",
    fontSize: news?.fontSize || 16, // ✅ FIX: number
    fontWeight: news?.fontWeight || "normal",
    color: news?.color || "#ffffff",
  });

  const [imageMode, setImageMode] = useState("upload");
  const [imageURL, setImageURL] = useState(news?.image || "");
  const [preview, setPreview] = useState(news?.image || "");

  // IMAGE UPLOAD
  const handleImageUpload = (file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
      setImageURL(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleImageURL = (url) => {
    setImageURL(url);
    setPreview(url);
  };

  const removeImage = () => {
    setPreview("");
    setImageURL("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      if (imageURL) {
        formData.append("image_url", imageURL);
      }

      if (news) {
        await updateNews(news._id, formData);
      } else {
        await addNews(formData);
      }

      refresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save news");
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-700 rounded-2xl shadow-xl p-6"
        >
          <h2 className="text-2xl font-bold text-emerald-400 mb-6">
            {news ? "Edit News" : "Create News"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">

              {/* LEFT */}
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl"
                  style={{
                    fontFamily: form.fontFamily,
                    fontSize: `${form.fontSize}px`,
                    fontWeight: form.fontWeight,
                    color: form.color,
                    textAlign: form.textAlign, // ✅ FIX
                  }}
                />

                <textarea
                  rows="8"
                  placeholder="Write content..."
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl"
                  style={{
                    fontFamily: form.fontFamily,
                    fontSize: `${form.fontSize}px`,
                    fontWeight: form.fontWeight,
                    color: form.color,
                    textAlign: form.textAlign, // ✅ FIX
                  }}
                />

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl"
                >
                  <option value="crop">🌱 Crop</option>
                  <option value="weather">🌦 Weather</option>
                  <option value="general">📰 General</option>
                </select>
              </div>

              {/* RIGHT */}
              <div className="space-y-5">
                {/* IMAGE */}
                <div className="space-y-3">
                  <div className="flex gap-2 bg-slate-700 p-1 rounded-xl w-fit">
                    <button
                      type="button"
                      onClick={() => setImageMode("upload")}
                      className={`px-3 py-1 rounded-lg ${
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
                      className={`px-3 py-1 rounded-lg ${
                        imageMode === "url"
                          ? "bg-emerald-400 text-black"
                          : "text-gray-300"
                      }`}
                    >
                      URL
                    </button>
                  </div>

                  {imageMode === "upload" && (
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageUpload(e.target.files[0])
                      }
                    />
                  )}

                  {imageMode === "url" && (
                    <input
                      type="text"
                      placeholder="Paste image URL"
                      value={imageURL}
                      onChange={(e) =>
                        handleImageURL(e.target.value)
                      }
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-xl"
                    />
                  )}

                  {preview && (
                    <div className="relative">
                      <img
                        src={preview}
                        className="rounded-xl max-h-48 object-cover w-full"
                      />

                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-black/60 px-2 rounded text-white"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                <FontSwitcher form={form} setForm={setForm} />
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 bg-gray-600 rounded-xl"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2 bg-emerald-400 text-black font-semibold rounded-xl"
              >
                Save News
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}