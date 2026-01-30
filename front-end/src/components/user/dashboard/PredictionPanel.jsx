/*
  PURPOSE:
  - Acts as a container for prediction result UI
  - Keeps right-side layout clean
*/

import PredictionResult from "./PredictionResult";

const PredictionPanel = ({ crop, confidence, top3, loading }) => {
  if (loading) return <div className="glass-card">Predicting...</div>;
  if (!crop) return <div className="glass-card">Prediction appears here</div>;

  return (
    <div className="glass-card space-y-4">
      <h2 className="text-xl text-emerald-300">🌱 {crop}</h2>

      <p>
        <b>Confidence:</b> {confidence}%
      </p>
      <div className="h-2 bg-white/20 rounded">
        <div
          className="h-2 bg-emerald-400 rounded"
          style={{ width: `${confidence}%` }}
        />
      </div>

      <div>
        <h4 className="font-semibold">Top 3 Crop Predictions</h4>
        {top3.map((item, i) => (
          <div key={i} className="text-sm">
            {item.crop} — {item.probability}%
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionPanel;
