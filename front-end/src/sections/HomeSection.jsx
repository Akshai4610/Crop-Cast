// src/sections/HomeSection.jsx
/*
  Hero / Landing Section
  - Dark gradient background
  - Strong headline
  - CTA button
*/

import { Element } from "react-scroll";

const HomeSection = () => {
  return (
    <Element name="home">
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-emerald-900 to-green-900 pt-20 px-6">
        <div className="max-w-4xl text-center animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
            Smart Crop Decisions<br />
            <span className="text-emerald-400">Powered by Weather & AI</span>
          </h1>

          <p className="text-lg md:text-xl text-white/80 mb-10">
            CropCast helps farmers choose the best crops using real-time weather
            insights and machine learning predictions.
          </p>

          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 text-lg font-semibold text-black shadow-lg hover:scale-105 transition">
            Explore Features
          </button>
        </div>
      </section>
    </Element>
  );
};

export default HomeSection;
