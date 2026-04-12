import { useEffect, useState } from "react";
import { useToast } from "../../../context/ToastContext";
import { motion } from "framer-motion";

const ProfileModal = ({ profile, onClose, onSave }) => {
  const { showToast } = useToast();

  // ✅ DEFAULT IMAGES (from ENV)
  const defaultProfile = import.meta.env.VITE_DEFAULT_PROFILE;
  const defaultCover = import.meta.env.VITE_DEFAULT_COVER;

  // ✅ FORM STATE
  const [form, setForm] = useState({
    fullname: "",
    email: localStorage.getItem("username"),
    age: "",
    location: "",
    phone: "",
    profile_pic: "",
    cover_pic: "",
  });

  const [original, setOriginal] = useState({});
  const [imageMode, setImageMode] = useState("upload");

  // ✅ LOAD PROFILE
  useEffect(() => {
    if (profile) {
      setForm(profile);
      setOriginal(profile);
    }
  }, [profile]);

  // ✅ AUTO LOCATION
  useEffect(() => {
    if (!profile && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setForm((prev) => ({
            ...prev,
            location: `Kerala (${pos.coords.latitude.toFixed(
              2,
            )}, ${pos.coords.longitude.toFixed(2)})`,
          }));
        },
        () => {
          setForm((prev) => ({ ...prev, location: "Kerala" }));
        },
      );
    }
  }, [profile]);

  // ✅ IMAGE UPLOAD (FAST + SAFE)
  const handleImage = (file, field) => {
    if (!file) return;

    // 🚫 LIMIT SIZE
    if (file.size > 1000000) {
      showToast("error", "Max image size 1000KB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        [field]: reader.result,
      }));
    };

    reader.readAsDataURL(file);
  };

  // ✅ REMOVE IMAGE (CLEAN FIX)
  const removeImage = (field) => {
    setForm((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  // ✅ CHANGE DETECT
  const isChanged = JSON.stringify(form) !== JSON.stringify(original);

  const handleSave = () => {
    if (!isChanged) return;

    onSave({
      ...form,
      profile_pic: form.profile_pic || "",
      cover_pic: form.cover_pic || "",
    });

    showToast("success", "Profile saved 🚀");
  };

  // ✅ SAFE IMAGE DISPLAY
  const isValidImage = (img) => {
    return img && img !== "" && img !== "null" && img !== "undefined";
  };

  const profileImage = isValidImage(form.profile_pic)
    ? form.profile_pic
    : defaultProfile;

  const coverImage = isValidImage(form.cover_pic)
    ? form.cover_pic
    : defaultCover;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
      {/* MODAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="
        w-full max-w-2xl
        max-h-[90vh] overflow-y-auto
        bg-white/10 backdrop-blur-2xl
        border border-white/20
        rounded-3xl p-6 md:p-8
        shadow-[0_0_60px_rgba(16,185,129,0.35)]
      "
      >
        {/* TITLE */}
        <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">
          {profile ? "Edit Profile" : "Create Profile"}
        </h2>

        {/* ================= COVER ================= */}
        <div className="mb-6">
          <p className="text-sm text-gray-300 mb-2">Cover Image</p>

          <div className="relative group">
            <img
              src={coverImage}
              className="w-full h-40 object-cover rounded-xl transition duration-300"
            />

            {/* REMOVE */}
            {form.cover_pic && (
              <button
                onClick={() => removeImage("cover_pic")}
                className="absolute top-2 right-2 bg-red-500 w-7 h-7 rounded-full text-white shadow"
              >
                ✕
              </button>
            )}
          </div>

          {/* UPLOAD */}
          <label
            className="
            mt-3 inline-block
            px-4 py-2 rounded-xl cursor-pointer
            border border-emerald-400 text-emerald-400
            hover:bg-emerald-400 hover:text-black transition
          "
          >
            Upload Cover
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={(e) => handleImage(e.target.files[0], "cover_pic")}
            />
          </label>
        </div>

        {/* ================= PROFILE ================= */}
        <div className="mb-6">
          <p className="text-sm text-gray-300 mb-2">Profile Image</p>

          {form.profile_pic ? (
            <div className="relative w-28 h-28">
              <img
                src={profileImage}
                className="w-28 h-28 rounded-full object-cover border-2 border-emerald-400 shadow-lg"
              />

              <button
                onClick={() => removeImage("profile_pic")}
                className="absolute top-1 right-1 bg-red-500 w-6 h-6 rounded-full text-white"
              >
                ✕
              </button>
            </div>
          ) : (
            <label
              className="
              inline-block px-4 py-2 rounded-xl cursor-pointer
              border border-emerald-400 text-emerald-400
              hover:bg-emerald-400 hover:text-black transition
            "
            >
              Upload Profile
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => handleImage(e.target.files[0], "profile_pic")}
              />
            </label>
          )}
        </div>

        {/* ================= FORM ================= */}
        <div className="grid gap-4">
          <input
            placeholder="Full Name"
            value={form.fullname}
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            className="input"
          />

          <input value={form.email} disabled className="input opacity-60" />

          <input
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="input"
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="input"
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input"
          />
        </div>

        {/* ================= ACTION ================= */}
        <div className="flex gap-3 mt-6">
          <button
            disabled={!isChanged}
            onClick={handleSave}
            className={`flex-1 py-3 rounded-xl font-semibold transition ${
              isChanged
                ? "bg-emerald-400 text-black hover:scale-105"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Save
          </button>

          <button
            onClick={onClose}
            className="flex-1 bg-gray-700 py-3 rounded-xl hover:bg-gray-600 transition"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileModal;
