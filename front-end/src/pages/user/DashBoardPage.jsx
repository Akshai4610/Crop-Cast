import { useState } from "react";
import WeatherForm from "../../components/user/dashboard/WeatherForm";
import PredictionResult from "../../components/user/dashboard/PredictionResult";
import { getCropRecommendation } from "../../services/api";

const DashboardPage = () => {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);

  // Called by WeatherForm
  const handlePredict = async (payload) => {
    setLoading(true);
    try {
      const res = await getCropRecommendation(payload);

      // Normalize data shape for PredictionResult
      setPrediction({
        crops: [res.recommended_crop],
        confidence: res.confidence,
      });
    } catch (err) {
      console.error(err);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT */}
      <WeatherForm onPredict={handlePredict} loading={loading} />

      {/* RIGHT */}
      <PredictionResult
        crops={prediction?.crops}
        confidence={prediction?.confidence}
        loading={loading}
      />
    </div>
  );
};

export default DashboardPage;
