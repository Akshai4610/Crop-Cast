/*
  PURPOSE:
  - Display predicted crop
  - Fetch and show crop details
  - Show confidence score
*/

import { useEffect, useState } from "react";
import { getCropDetails } from "../../../services/api";

const PredictionResult = ({ crops, confidence, loading }) => {
  const [cropInfo, setCropInfo] = useState(null);

  const crop = crops?.[0];

  useEffect(() => {
    if (!crop) return;

    const fetchData = async () => {
      try {
        const res = await getCropDetails(crop);
        setCropInfo(res.exists ? res.data : null);
      } catch (err) {
        console.error(err);
        setCropInfo(null);
      }
    };

    fetchData();
  }, [crop]);

  if (loading)
    return <div className="glass-card">Predicting crop...</div>;

  if (!crop)
    return <div className="glass-card">Prediction results appear here</div>;

  return (
    <div className="glass-card space-y-3">
      <h3 className="text-emerald-300 text-xl">🌱 {crop}</h3>

      {/* Confidence */}
      <p>
        <b>Confidence:</b> {confidence}%
      </p>
      <div className="h-2 bg-white/20 rounded">
        <div
          className="h-2 bg-emerald-400 rounded"
          style={{ width: `${confidence}%` }}
        />
      </div>

      {/* Crop details */}
      {cropInfo ? (
        <>
          <p><b>Growth:</b> {cropInfo.growth_period}</p>
          <p><b>Climate:</b> {cropInfo.climate}</p>
          <p><b>Soil:</b> {cropInfo.soil}</p>
          <p><b>Water:</b> {cropInfo.water}</p>
          <p className="text-white/70">{cropInfo.description}</p>
        </>
      ) : (
        <p className="text-white/60">
          No details available for this crop.
        </p>
      )}
    </div>
  );
};

export default PredictionResult;
