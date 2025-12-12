// ProfilePage.jsx
/*
  PURPOSE:
  - Combines ProfileDetails and PredictionHistory
  - Clean page-level composition
*/

import ProfileDetails from "../../components/user/profile/ProfileDetails";
import PredictionHistory from "../../components/user/profile/PredictionHistory";

const ProfilePage = () => {
  return (
    <section className="max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
        User Profile
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <ProfileDetails />
        <PredictionHistory />
      </div>
    </section>
  );
};

export default ProfilePage;
