/**
 * ProfilePage.jsx
 *
 * PURPOSE:
 * - Safely display user profile
 * - Allow profile update
 * - Handle backend failures gracefully
 */

import { useEffect, useState } from "react";

const ProfilePage = () => {
  // -----------------------------
  // STATE
  // -----------------------------
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", location: "" });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Get userId from localStorage (TEMP AUTH)
  const userId = localStorage.getItem("userId");

  // -----------------------------
  // FETCH USER
  // -----------------------------
  useEffect(() => {
    if (!userId) {
      setError("User not logged in");
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/users/${userId}`);

        if (!res.ok) {
          throw new Error("User not found");
        }

        const data = await res.json();
        setUser(data);
        setFormData({
          name: data.name || "",
          location: data.location || ""
        });
      } catch (err) {
        setError("Failed to load user profile. Is backend running?");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  // -----------------------------
  // INPUT HANDLER
  // -----------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // -----------------------------
  // UPDATE PROFILE
  // -----------------------------
  const handleUpdate = async () => {
    try {
      await fetch(`http://127.0.0.1:8000/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      setUser({ ...user, ...formData });
      setEditMode(false);
    } catch {
      alert("Update failed");
    }
  };

  // -----------------------------
  // UI STATES
  // -----------------------------
  if (loading) {
    return <CenterText text="Loading profile..." />;
  }

  if (error) {
    return <CenterText text={error} error />;
  }

  if (!user) {
    return <CenterText text="No user data available" error />;
  }

  // -----------------------------
  // MAIN UI
  // -----------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-6">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl p-8">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6">
          User Profile
        </h2>

        {!editMode ? (
          <>
            <ProfileItem label="Name" value={user.name} />
            <ProfileItem label="Email" value={user.email} />
            <ProfileItem label="Location" value={user.location || "Not set"} />

            <button
              onClick={() => setEditMode(true)}
              className="mt-6 w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white py-2 rounded-lg hover:scale-105 transition"
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
            <InputField label="Location" name="location" value={formData.location} onChange={handleChange} />

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:scale-105 transition"
              >
                Save
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="flex-1 bg-gray-300 py-2 rounded-lg hover:scale-105 transition"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

// -----------------------------
// REUSABLE COMPONENTS
// -----------------------------
const ProfileItem = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2 mb-2">
    <span className="text-gray-600">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const InputField = ({ label, name, value, onChange }) => (
  <div className="mb-3">
    <label className="block text-sm text-gray-600 mb-1">{label}</label>
    <input
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
    />
  </div>
);

const CenterText = ({ text, error }) => (
  <div className={`h-screen flex items-center justify-center text-lg font-semibold ${error ? "text-red-500" : "text-green-600"}`}>
    {text}
  </div>
);
