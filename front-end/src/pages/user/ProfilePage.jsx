// src/pages/user/ProfilePage.jsx
/*
  User Profile Page
  - Shows user info with editable form
*/

const ProfilePage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <form className="max-w-lg bg-gray-900/70 p-6 rounded-2xl shadow-lg space-y-4 animate-fade-in">
        <div>
          <label className="block mb-1 font-semibold">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
        </div>

        <div>
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            placeholder="john@example.com"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:ring-2 focus:ring-emerald-400 outline-none"
          />
        </div>

        <button className="py-3 w-full rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-black font-semibold hover:scale-105 transition">
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default ProfilePage;
