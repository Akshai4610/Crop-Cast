/*
  PURPOSE:
  - Main prediction page
  - Left: WeatherForm
  - Right: PredictionPanel
*/

import { useState } from "react";
import WeatherForm from "../../components/user/dashboard/WeatherForm";
import PredictionPanel from "../../components/user/dashboard/PredictionPanel";
import { predictCrop } from "../../services/api";

const DashBoardPage = () => {
  const [loading, setLoading] = useState(false);
  const [crop, setCrops] = useState([]);
  const [confidence, setConfidence] = useState(0);
  const [top3, setTop3] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const handlePredict = async (inputData) => {
    try {
      setLoading(true);

      const res = await predictCrop({
        username: user.username,
        ...inputData,
      });

      // Expecting backend response:
      // { crop: "rice", confidence: 87 }
      setCrops([res.recommended_crop]);
      setConfidence(res.confidence);
      setTop3(res.top_3);

    } catch (err) {
      //console.error(err);
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
      />
    </div>
  );
};

export default DashBoardPage;
