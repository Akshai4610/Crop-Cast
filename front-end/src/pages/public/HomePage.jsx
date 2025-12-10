import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import HomeSection from "../../sections/HomeSection";
import ServicesSection from "../../sections/ServiceSection";
import AboutSection from "../../sections/AboutSection";
import ContactSection from "../../sections/ContactSection";

/*
  HomePage Component
  - Combines Navbar, all public sections, and Footer
  - Fully functional pre-login landing page
*/
const HomePage = () => {
  return (
    <div className="relative">
      <Navbar />
      <main className="mt-16">
        <HomeSection />
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
