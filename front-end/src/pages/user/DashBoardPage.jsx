// DashboardPage.jsx
/*
  PURPOSE:
  - Coordinates WeatherForm & PredictionResult
  - Simulates ML prediction for now
*/

import { useState } from "react";
import WeatherForm from "../../components/user/dashboard/WeatherForm";
import PredictionResult from "../../components/user/dashboard/PredictionResult";

const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [crops, setCrops] = useState([]);

  // Simulated prediction
  const handlePredict = () => {
    setLoading(true);
    setCrops([]);

    setTimeout(() => {
      setCrops(["Rice", "Maize", "Cotton"]);
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="max-w-7xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
        Crop Recommendation Dashboard
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <WeatherForm onPredict={handlePredict} />
        <PredictionResult loading={loading} crops={crops} />
      </div>
    </section>
  );
};

export default DashboardPage;
