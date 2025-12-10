import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import DashboardSection from "../../sections/user/DashboardSection";
import ProfileSection from "../../sections/user/ProfileSection";
import NewsSection from "../../sections/user/NewsSection.jsx";

/*
  UserPage Component
  - Post-login page for logged-in users
  - Navbar shows only user links
  - Sections: Dashboard, Profile, News
  - Footer included
*/
const UserPage = () => {
  return (
    <div className="relative">
      <Navbar userMode={true} /> {/* Pass prop to show user links only */}
      <main className="mt-16">
        <DashboardSection />
        <ProfileSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  );
};

export default UserPage;
