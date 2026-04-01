import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCropDetails, checkPremium } from "../../../services/api";
import { getCropEmoji } from "../../../utils/croeX";

const normalizeCrop = (name) =>
  name?.toLowerCase().replace(/\s+/g, "").trim();

export default function HistoryViewModal({ data, onClose }) {
  const [details, setDetails] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [particles, setParticles] = useState([]);

  const [ui, setUI] = useState({
    getGradientBorder: () => "",
    cardBase: "bg-slate-800 rounded-xl p-5",
    getGlowStyle: () => ({}),
    pulseAnimation: {},
  });

  const [getGlow, setGetGlow] = useState(() => () => ({
    glow: "rgba(16,185,129,0.3)",
    border: "from-emerald-400 to-cyan-400",
    intensity: 0.5,
  }));

  // 🔥 INIT
  useEffect(() => {
    const init = async () => {
      try {
        const premium = await checkPremium();
        setIsPremium(premium);

        const glowModule = await import("../../../utils/cropGlow");
        setGetGlow(() => glowModule.getCropGlow);

        if (premium) {
          const uiModule = await import("../../../utils/uiEngine");

          setUI({
            getGradientBorder: uiModule.getGradientBorder,
            cardBase: uiModule.cardBase,
            getGlowStyle: uiModule.getGlowStyle,
            pulseAnimation: uiModule.pulseAnimation,
          });

          setParticles(uiModule.generateParticles(25));
        }
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, []);

  // 🌾 FETCH DETAILS
  useEffect(() => {
    if (!data?.predicted_crop) return;

    const fetchData = async () => {
      setDetails(null);

      try {
        const normalized = normalizeCrop(data.predicted_crop);
        const res = await getCropDetails(normalized);
        setDetails(res || false);
      } catch {
        setDetails(false);
      }
    };

    fetchData();
  }, [data]);

  const percent = ((data?.confidence || 0) * 100).toFixed(2);
  const glow = getGlow(data?.predicted_crop, data?.confidence);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-3">

      {/* ✨ PARTICLES */}
      {isPremium && (
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p) => (
            <span
              key={p.id}
              className="absolute bg-white/30 rounded-full animate-ping"
              style={{
                width: p.size,
                height: p.size,
                top: `${p.top}%`,
                left: `${p.left}%`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* 📦 MODAL */}
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-[95%] sm:w-[480px] max-h-[90vh]"
      >
        {/* 🌈 BORDER */}
        {isPremium && (
          <div className={ui.getGradientBorder(glow.border)} />
        )}

        {/* 🍎 CARD */}
        <motion.div
          {...(isPremium ? ui.pulseAnimation : {})}
          style={isPremium ? ui.getGlowStyle(glow) : {}}
          className={`${ui.cardBase} overflow-y-auto`}
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">
                {getCropEmoji(data.predicted_crop)}
              </span>
              {data.predicted_crop}
            </h2>

            <span className="text-xs sm:text-sm text-gray-300">
              {percent}%
            </span>
          </div>

          {/* BAR */}
          <div className="h-2 bg-white/20 rounded mb-4 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              className={`h-full bg-gradient-to-r ${glow.border}`}
            />
          </div>

          {/* DETAILS */}
          {details === null ? (
            <p className="text-gray-400">Loading crop details...</p>
          ) : details === false ? (
            <p className="text-red-400">No details available</p>
          ) : (
            <>
              {details.image_url && (
                <img
                  src={details.image_url}
                  className="w-full h-36 sm:h-40 object-cover rounded-xl mb-4"
                />
              )}

              <div className="space-y-2 text-sm text-gray-200">
                <p>{details.description}</p>

                <p>
                  <b className="text-white">Climate:</b> {details.climate}
                </p>

                <p>
                  <b className="text-white">Growth Tips:</b>{" "}
                  {details.growth_tips}
                </p>
              </div>
            </>
          )}

          {/* INPUT */}
          <div className="mt-4 text-xs text-gray-400 bg-black/30 p-2 rounded overflow-x-auto">
            <pre>{JSON.stringify(data.input_data, null, 2)}</pre>
          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="mt-5 w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}