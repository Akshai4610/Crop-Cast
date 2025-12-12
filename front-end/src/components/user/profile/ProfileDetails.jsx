// ProfileDetails.jsx
/*
  PURPOSE:
  - Display user basic information
  - Editable form (UI-only for now)
  - Clean separation from page logic
*/

const ProfileDetails = () => {
  return (
    <div className="glass-card animate-fade-in">
      <h3 className="text-xl font-semibold text-emerald-300 mb-4">
        User Information
      </h3>

      <form className="grid md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="p-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="p-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <input
          type="text"
          placeholder="Location"
          className="p-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <input
          type="number"
          placeholder="Phone Number"
          className="p-3 rounded-xl bg-white/20 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-emerald-400"
        />

        <button
          type="button"
          className="md:col-span-2 py-3 rounded-xl bg-gradient-to-r from-emerald-400 to-lime-400 text-black font-semibold hover:scale-105 transition"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfileDetails;
