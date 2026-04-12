import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getCropDetails, checkPremium } from "../../../services/api";


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
    modalMotionProps: {},
    historyBarProps: () => ({})
  });

  const [getGlow, setGetGlow] = useState(() => () => ({
    glow: "rgba(16,185,129,0.3)",
    border: "from-emerald-400 to-cyan-400",
    intensity: 0.5,
  }));
  const [getEmoji, setGetEmoji] = useState(() => () => "🌱");

  // 🔥 INIT
  useEffect(() => {
    const init = async () => {
      try {
        const premium = await checkPremium();
        setIsPremium(premium);

        const mods = import.meta.glob('../../../utils/*.js');

        if (mods['../../../utils/cropGlow.js']) {
          try { const m = await mods['../../../utils/cropGlow.js'](); if (m.getCropGlow) setGetGlow(() => m.getCropGlow); } catch(e){}
        }

        if (premium) {
          if (mods['../../../utils/uiEngine.js']) {
            try {
              const m = await mods['../../../utils/uiEngine.js']();
              if (m.getGradientBorder) {
                setUI({
                  getGradientBorder: m.getGradientBorder,
                  cardBase: m.cardBase,
                  getGlowStyle: m.getGlowStyle,
                  pulseAnimation: m.pulseAnimation,
                  modalMotionProps: m.modalMotionProps || {},
                  historyBarProps: m.historyBarProps || (() => ({}))
                });
                if (m.generateParticles) setParticles(m.generateParticles(25));
              }
            } catch(e){}
          }
          if (mods['../../../utils/croeX.js']) {
             try { const m = await mods['../../../utils/croeX.js'](); if (m.getCropEmoji) setGetEmoji(() => m.getCropEmoji); } catch(e){}
          }
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
          className={`${ui.cardBase} max-h-[85vh] flex flex-col`}
        >
          <div className="overflow-y-auto pr-2 custom-scrollbar">
          {/* HEADER */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span className="text-2xl sm:text-3xl">
                {isPremium ? getEmoji(data.predicted_crop) : "🌱"}
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
                <div className="w-full h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden shadow-lg mb-4 bg-white/5">
                  <img
                    src={details.image_url}
                    className="w-full h-full object-contain bg-black/20"
                    alt={data.predicted_crop}
                  />
                </div>
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

          </div>

          {/* CLOSE */}
          <button
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all border border-white/5 active:scale-[0.98] shrink-0"
          >
            Close
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}