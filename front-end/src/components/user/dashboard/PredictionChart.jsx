import { motion } from "framer-motion";

const PredictionChart = ({ top3 = [] }) => {
  if (!top3.length) return null;

  const max = Math.max(...top3.map((c) => c.probability));

  return (
    <div className="glass-card space-y-3">
      <h4 className="text-white font-semibold">📊 Prediction Analysis</h4>

      {top3.map((item, i) => {
        const width = (item.probability / max) * 100;

        return (
          <div key={i}>
            <div className="flex justify-between text-sm text-white">
              <span>{item.crop}</span>
              <span>{item.probability}%</span>
            </div>

            <div className="h-2 bg-white/20 rounded mt-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ duration: 0.6 }}
                className="h-2 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PredictionChart;