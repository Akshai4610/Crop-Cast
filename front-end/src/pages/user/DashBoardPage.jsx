// src/pages/user/DashboardPage.jsx
/*
  User Dashboard Page
  - Card-based layout
  - Fade-in animations
  - Example crop recommendation / stats
*/

import { Element } from "react-scroll";

const cards = [
  { title: "Recommended Crops", value: "Wheat, Maize, Rice", icon: "🌾" },
  { title: "Weather Today", value: "Sunny, 30°C", icon: "☀️" },
  { title: "Yield Prediction", value: "1200 kg/acre", icon: "📊" },
];

const DashboardPage = () => {
  return (
    <Element name="dashboard">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-gray-900/70 rounded-2xl p-6 shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition animate-fade-in"
          >
            <div className="text-4xl mb-3">{card.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{card.title}</h2>
            <p className="text-white/80">{card.value}</p>
          </div>
        ))}
      </div>
    </Element>
  );
};

export default DashboardPage;
