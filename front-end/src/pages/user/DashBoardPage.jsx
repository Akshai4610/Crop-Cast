/*
  PURPOSE:
  - Main prediction page
  - Left: WeatherForm
  - Right: PredictionPanel
  - Fixed: formData undefined bug
  - Added: stable state handling
*/

import { useState } from "react";
import WeatherForm from "../../components/user/dashboard/WeatherForm";
import PredictionPanel from "../../components/user/dashboard/PredictionPanel";
import WeatherWidget from "../../components/common/WeatherWidget";
import { predictCrop } from "../../services/api";

const DashBoardPage = () => {
  const [loading, setLoading] = useState(false);

  const [crop, setCrops] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const [top3, setTop3] = useState([]);

  // ✅ FIX: store input data (for premium explanation + weather hint)
  const [inputData, setInputData] = useState(null);

  const handlePredict = async (formData) => {
    try {
      setLoading(true);

      // ✅ SAVE INPUT (IMPORTANT FIX)
      setInputData(formData);

      const res = await predictCrop(formData);
      console.log("Dashboard got =>", res);

      // ✅ SAFE HANDLING (avoid crashes)
      if (!res || !res.top_3) {
        alert("Invalid prediction response");
        return;
      }

      setCrops(res.top_3.map((x) => x.crop));
      setConfidence(res.confidence || 0);
      setTop3(res.top_3 || []);

    } catch (err) {
      console.error("Prediction error:", err);
      alert("Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* LEFT SIDE — INPUT FORM */}
      <WeatherForm onPredict={handlePredict} loading={loading} />

      {/* RIGHT SIDE — RESULT PANEL */}
      <PredictionPanel
        crops={crop}
        confidence={confidence}
        top3={top3}
        loading={loading}
        inputData={inputData}   // ✅ FIXED
      />

      {/* WEATHER WIDGET */}
      <WeatherWidget />
    </div>
  );
};

export default DashBoardPage;