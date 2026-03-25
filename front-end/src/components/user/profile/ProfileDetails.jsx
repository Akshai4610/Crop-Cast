/*
========================================================
PROFILE DETAILS (ULTRA PREMIUM)
✔ Cover + overlay gradient
✔ Profile glow hover
✔ FIXED animated ring
✔ Image URL fix using ENV
========================================================
*/

import { motion } from "framer-motion";

  // ✅ DEFAULT IMAGES (from ENV)
  const defaultProfile = import.meta.env.VITE_DEFAULT_PROFILE;
  const defaultCover = import.meta.env.VITE_DEFAULT_COVER;

const ProfileDetails = ({ profile, onEdit }) => {
  const fields = ["fullname", "age", "location", "phone", "profile_pic"];
  const filled = fields.filter((f) => profile[f]).length;
  const percent = Math.round((filled / fields.length) * 100);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden bg-white/10 backdrop-blur-xl shadow-2xl">
      {/* COVER */}
      <div className="h-48 relative">
        <img
          src={profile.cover_pic || defaultCover}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* PROFILE SECTION */}
      <div className="flex items-center gap-6 p-6 -mt-16 relative">
        {/* RING + AVATAR */}
        <div className="relative">
          <svg width="115" height="115" className="absolute -top-3 -left-3">
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#2d2d2d"
              strokeWidth="6"
              fill="none"
            />

            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              stroke="#10B981"
              strokeWidth="6"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1 }}
            />
          </svg>

          <img
            src={profile.profile_pic || defaultProfile}
            className="w-24 h-24 rounded-full border-4 border-white shadow-xl 
            hover:shadow-emerald-400/40 transition"
          />
        </div>

        {/* INFO */}
        <div>
          <h2 className="text-2xl font-bold">{profile.fullname}</h2>
          <p className="text-gray-300">{profile.email}</p>
          <p className="text-emerald-400 text-sm mt-1">
            {percent}% Profile Complete
          </p>
        </div>
      </div>

      {/* DETAILS */}
      <div className="p-6 space-y-3 text-gray-200">
        <p>📍 {profile.location || "Not set"}</p>
        <p>📞 {profile.phone || "Not set"}</p>
        <p>🎂 {profile.age || "Not set"}</p>

        <button
          onClick={onEdit}
          className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-black font-semibold shadow-lg hover:scale-105 transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileDetails;
