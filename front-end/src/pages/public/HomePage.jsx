// src/pages/public/HomePage.jsx
import React, { useEffect } from "react";
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

  useEffect(() => {
    if (location.state?.scrollTo) {
      scroller.scrollTo(location.state.scrollTo, {
        duration: 800,
        delay: 0,
        smooth: "easeInOutQuart",
      });
    }
  }, [location.state]);

  return (
    <div className ="pt-24">
      <Navbar />
      <main className="mt-16">
        <HomeSection />
        <ServiceSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
