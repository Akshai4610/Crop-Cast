/*
  COMPONENT: PredictionResult
  ---------------------------
  PURPOSE:
  - Display predicted crop on right-side panel
  - Visualize prediction confidence
  - Fetch and show crop details from backend
  - Handle loading & empty states gracefully
*/

import { useEffect, useState } from "react";
import { getCropDetails } from "../../../services/api";

const PredictionResult = ({ crops = [], confidence = 0, loading }) => {
  const [cropInfo, setCropInfo] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // =========================
  // Derived values
  // =========================

  // Take top predicted crop (first element)
  const crop = crops.length > 0 ? crops[0] : null;

  // Normalize confidence (supports 0–1 or 0–100)
  const confidenceValue =
    confidence > 1
      ? Math.round(confidence)
      : Math.round(confidence * 100);

  // =========================
  // Fetch crop details
  // =========================
  useEffect(() => {
    if (!crop) {
      setCropInfo(null);
      return;
    }

    const fetchCropDetails = async () => {
      try {
        setDetailsLoading(true);
        const res = await getCropDetails(crop);

        // Backend returns: { exists: boolean, data: {...} }
        setCropInfo(res?.exists ? res.data : null);
      } catch (error) {
        console.error("Error fetching crop details:", error);
        setCropInfo(null);
      } finally {
        setDetailsLoading(false);
      }
    };

    fetchCropDetails();
  }, [crop]);

  // =========================
  // UI STATES
  // =========================

  // Prediction loading (ML running)
  if (loading) {
    return (
      <div className="glass-card animate-pulse text-white/70">
        Predicting crop...
      </div>
    );
  }

  // No prediction yet
  if (!crop) {
    return (
      <div className="glass-card text-white/60">
        Prediction results will appear here.
      </div>
    );
  }

  // =========================
  // RESULT VIEW
  // =========================
  return (
    <div className="glass-card space-y-4">
      
      {/* Predicted Crop */}
      <h3 className="text-emerald-300 text-xl font-semibold">
        🌱 {crop}
      </h3>

      {/* Confidence Visualization */}
      <div>
        <p className="text-sm">
          <b>Confidence:</b> {confidenceValue}%
        </p>

        <div className="h-2 bg-white/20 rounded mt-1 overflow-hidden">
          <div
            className="h-2 bg-emerald-400 rounded transition-all duration-500"
            style={{ width: `${confidenceValue}%` }}
          />
        </div>
      </div>

      {/* Crop Details */}
      {detailsLoading ? (
        <p className="text-white/60 text-sm">
          Loading crop information...
        </p>
      ) : cropInfo ? (
        <div className="space-y-1 text-sm">
          <p><b>Growth Period:</b> {cropInfo.growth_period}</p>
          <p><b>Climate:</b> {cropInfo.climate}</p>
          <p><b>Soil Type:</b> {cropInfo.soil}</p>
          <p><b>Water Requirement:</b> {cropInfo.water}</p>

          {cropInfo.description && (
            <p className="text-white/70 mt-2">
              {cropInfo.description}
            </p>
          )}
        </div>
      ) : (
        <p className="text-white/60 text-sm">
          No additional information available for this crop.
        </p>
      )}
    </div>
  );
};

export default PredictionResult;
