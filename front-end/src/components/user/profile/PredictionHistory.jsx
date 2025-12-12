// PredictionHistory.jsx
/*
  PURPOSE:
  - Display previous crop prediction history
  - UI-only dummy data
*/

const PredictionHistory = () => {
  const history = [
    { date: "2025-12-10", crop: "Rice", temp: "28°C", rain: "120mm" },
    { date: "2025-12-08", crop: "Maize", temp: "30°C", rain: "80mm" },
  ];

  return (
    <div className="glass-card animate-fade-in">
      <h3 className="text-xl font-semibold text-emerald-300 mb-4">
        Prediction History
      </h3>

      <div className="space-y-3">
        {history.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-4 rounded-xl bg-white/20 hover:bg-white/30 transition"
          >
            <div>
              <p className="font-semibold">{item.crop}</p>
              <p className="text-sm text-white/60">
                Temp: {item.temp} | Rain: {item.rain}
              </p>
            </div>
            <span className="text-sm text-white/60">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PredictionHistory;
