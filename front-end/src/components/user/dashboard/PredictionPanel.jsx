import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PredictionChart from "./PredictionChart";
import { explainCrop } from "../../../utils/cropExplain";
import { getWeatherHint } from "../../../utils/weatherHint";
import { getCropEmoji } from "../../../utils/croeX";

import { checkPremium, getWeather } from "../../../services/api";

const PredictionPanel = ({ crops, confidence, top3, loading, inputData }) => {
  const [isPremium, setIsPremium] = useState(false);
  const [weather, setWeather] = useState(null);

  const crop = crops?.[0];
  const percent = Math.round(confidence * 100);

  useEffect(() => {
    checkPremium().then(setIsPremium);

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const data = await getWeather(
          pos.coords.latitude,
          pos.coords.longitude
        );
        setWeather(data);
      } catch {}
    });
  }, []);

  if (loading) return <div className="glass-card">Predicting...</div>;
  if (!crop) return <div className="glass-card">Prediction appears here</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card space-y-4"
    >
      {/* 🌱 MAIN RESULT */}
      <h2 className="text-2xl text-emerald-300 font-bold flex items-center gap-2">
        {isPremium && <span>{getCropEmoji(crop)}</span>}
        {crop}
      </h2>

      {/* CONFIDENCE */}
      <div>
        <p className="text-sm">{percent}% Confidence</p>

        <div className="h-2 bg-white/20 rounded mt-1">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            className="h-2 bg-emerald-400 rounded"
          />
        </div>
      </div>

      {/* 🌦 WEATHER */}
      {isPremium && (
        <p className="text-xs text-cyan-300">
          {getWeatherHint(weather, crop)}
        </p>
      )}

      {/* 🧠 EXPLANATION */}
      {isPremium && (
        <div className="text-sm text-white/80">
          {explainCrop(inputData, crop)}
        </div>
      )}

      {/* 📊 CHART */}
      {isPremium && <PredictionChart top3={top3} />}

      {/* FALLBACK */}
      {!isPremium && (
        <div>
          {top3?.map((item, i) => (
            <div key={i} className="text-sm">
              {item.crop} — {item.probability}%
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PredictionPanel;