// CropInsightsPage.jsx
/*
  PURPOSE:
  - Displays detailed crop information
  - Used to explain ML prediction results
  - High academic & practical value
*/

import CropCard from "../../components/user/crop/CropCard";

const CropInsightsPage = () => {
  // Dummy crop data (later comes from ML/backend)
  const crops = [
    {
      name: "Rice",
      season: "Kharif",
      water: "High",
      soil: "Clayey soil",
    },
    {
      name: "Maize",
      season: "Kharif / Rabi",
      water: "Moderate",
      soil: "Loamy soil",
    },
    {
      name: "Cotton",
      season: "Kharif",
      water: "Moderate",
      soil: "Black soil",
    },
  ];

  return (
    <section className="max-w-7xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
        Crop Insights
      </h1>

      <p className="text-white/70 mb-8 max-w-3xl">
        Detailed information about crops recommended by the machine learning
        model based on weather conditions.
      </p>

      <div className="grid md:grid-cols-3 gap-8">
        {crops.map((crop, index) => (
          <CropCard key={index} {...crop} />
        ))}
      </div>
    </section>
  );
};

export default CropInsightsPage;
