import { useEffect, useState } from "react";
import { ToastProvider } from "../../context/ToastContext";

import ProfileDetails from "../../components/user/profile/ProfileDetails";
import ProfileModal from "../../components/user/profile/ProfileModal";
import SkeletonProfile from "../../components/common/SkeletonProfile";

const API = import.meta.env.VITE_API_URL;

const ProfilePage = () => {
  const email = localStorage.getItem("username");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const fetchProfile = async () => {
    if (!email) return;

    try {
      const res = await fetch(`${API}/profile/${email}`);

      if (res.status === 404) {
        setProfile(null);
      } else {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error("Fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (form) => {
    const { email: _removed, ...cleanForm } = form;

    await fetch(`${API}/profile/${email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cleanForm),
    });

    setProfile(form);
    setOpenModal(false);
  };

  return (
    <ToastProvider>
      <div className="p-4 md:p-6 text-white min-h-screen">
        {loading ? (
          <SkeletonProfile />
        ) : !profile ? (
          <div className="text-center mt-10">
            <h2 className="text-xl mb-4">Create Profile</h2>
            <button
              onClick={() => setOpenModal(true)}
              className="bg-emerald-500 px-6 py-2 rounded-xl"
            >
              Create
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <ProfileDetails
              profile={profile}
              onEdit={() => setOpenModal(true)}
            />
          </div>
        )}

        {openModal && (
          <ProfileModal
            profile={profile}
            onClose={() => setOpenModal(false)}
            onSave={handleSave}
          />
        )}
      </div>
    </ToastProvider>
  );
};

export default ProfilePage;
