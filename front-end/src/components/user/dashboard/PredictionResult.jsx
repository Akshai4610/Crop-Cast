// PredictionResult.jsx
/*
  PURPOSE:
  - Display predicted crops
  - Show loading shimmer when predicting
*/

const PredictionResult = ({ loading, crops }) => {
  if (loading) {
    return (
      <div className="glass-card animate-pulse">
        <div className="h-4 bg-white/30 rounded mb-3"></div>
        <div className="h-4 bg-white/30 rounded mb-3"></div>
        <div className="h-4 bg-white/30 rounded"></div>
      </div>
    );
  }

  if (!crops.length) {
    return (
      <div className="glass-card text-white/60">
        Prediction results will appear here.
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h3 className="text-xl font-semibold text-emerald-300 mb-4">
        Recommended Crops
      </h3>

      <div className="grid sm:grid-cols-2 gap-4">
        {crops.map((crop, index) => (
          <div
            key={index}
            className="p-4 rounded-xl bg-white/20 hover:bg-white/30 transition hover:scale-105"
          >
            🌱 {crop}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionResult;
