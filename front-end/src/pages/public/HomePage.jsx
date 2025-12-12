// src/pages/public/HomePage.jsx
/*
  Public Home Page
  - Composes all sections
  - Handles scroll-to-section logic from Navbar (location.state.scrollTo)
  - Navbar and Footer always visible
*/

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { scroller } from "react-scroll";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

import HomeSection from "../../sections/HomeSection";
import ServiceSection from "../../sections/ServiceSection";
import AboutSection from "../../sections/AboutSection";
import ContactSection from "../../sections/ContactSection";

const HomePage = () => {
  const location = useLocation();

  // Scroll to section when navigated from login/signup
  useEffect(() => {
    if (location.state?.scrollTo) {
      scroller.scrollTo(location.state.scrollTo, {
        duration: 700,
        smooth: "easeInOutQuart",
        offset: -80,
      });
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar />

      {/* Sections */}
      <HomeSection />
      <AboutSection />
      <ServiceSection />
      <ContactSection />

      <Footer />
    </div>
  );
};

export default HomePage;
