// src/sections/AboutSection.jsx
/*
  About Section
  - Two-column layout
  - Professional explanation
*/

import { Element } from "react-scroll";

const AboutSection = () => {
  return (
    <Element name="about">
      <section className="py-24 bg-gray-950 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">About CropCast</h2>
            <p className="text-white/70 leading-relaxed">
              CropCast is a weather-based crop recommendation platform that helps
              farmers make informed decisions. By combining real-time climate
              data with machine learning models, CropCast improves productivity
              and reduces risk.
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-green-700 rounded-3xl h-64 shadow-xl flex items-center justify-center text-6xl">
            🌾
          </div>
        </div>
      </section>
    </Element>
  );
};

export default AboutSection;
