// src/sections/ServiceSection.jsx
/*
  Services Section
  - Card-based layout
  - Icons + hover animations
*/

import { Element } from "react-scroll";

const services = [
  {
    title: "Weather Forecast",
    desc: "Accurate short-term and long-term weather predictions.",
    icon: "☁️",
  },
  {
    title: "Crop Recommendation",
    desc: "AI-driven crop suggestions based on climate & soil.",
    icon: "🌱",
  },
  {
    title: "Expert Insights",
    desc: "Actionable advice for maximizing yield and profit.",
    icon: "📊",
  },
];

const ServiceSection = () => {
  return (
    <Element name="services">
      <section className="py-24 bg-gray-900 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-white/70 mb-12">
            Powerful tools designed for modern agriculture
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((s, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-2 transition"
              >
                <div className="text-5xl mb-4">{s.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{s.title}</h3>
                <p className="text-white/70">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Element>
  );
};

export default ServiceSection;
