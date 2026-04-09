// PredictionPanel.jsx — Premium redesign, ALL logic unchanged
import { useEffect, useState, useRef, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Zap, TrendingUp, Leaf, Lock, Box, Sparkles } from "lucide-react";

import PredictionChart from "./PredictionChart";
import { checkPremium, getWeather } from "../../../services/api";
import { PremiumCrop3D } from "../../../utils/premium-registry";

/* ── crop accent helper ── */
function cropColor(name = "") {
  const map = {
    rice: "#34d399", wheat: "#fbbf24", maize: "#fb923c",
    cotton: "#e2e8f0", mango: "#fb923c", banana: "#fde047",
    default: "#34d399",
  };
  const key = Object.keys(map).find((k) => name.toLowerCase().includes(k));
  return map[key] || map.default;
}

const PredictionPanel = ({ crops, confidence, top3, loading, inputData }) => {
  /* ── Logic unchanged ── */
  const panelRef = useRef(null);
  const [isPremium, setIsPremium] = useState(false);
  const [weather,   setWeather]   = useState(null);
  const [show3D,    setShow3D]    = useState(false);
  /* ── dynamic utils state ── */
  const [utils, setUtils] = useState({
    explainCrop: () => "",
    getWeatherHint: () => "",
    getCropEmoji: () => "🌱",
    getCropGlow: () => ({ glow: "rgba(16,185,129,0.3)", border: "from-emerald-400 to-cyan-400", intensity: 0.5 }),
    runGSAPReveal: () => {},
    panelMotionProps: {},
    barMotionProps: () => ({})
  });

  const crop    = crops?.[0];
  const percent = Math.round(confidence * 100);
  const color   = cropColor(crop);
  const glow    = utils.getCropGlow(crop, confidence);

  /* Logic unchanged */
  useEffect(() => {
    checkPremium().then(async (premium) => {
      setIsPremium(premium);
      let newUtils = {};
      const mods = import.meta.glob('../../../utils/*.js');

      if (mods['../../../utils/cropGlow.js']) {
        try { const m = await mods['../../../utils/cropGlow.js'](); if (m.getCropGlow) newUtils.getCropGlow = m.getCropGlow; } catch(e){}
      }
      if (premium) {
        if (mods['../../../utils/cropExplain.js']) {
          try { const m = await mods['../../../utils/cropExplain.js'](); if (m.explainCrop) newUtils.explainCrop = m.explainCrop; } catch(e){}
        }
        if (mods['../../../utils/weatherHint.js']) {
          try { const m = await mods['../../../utils/weatherHint.js'](); if (m.getWeatherHint) newUtils.getWeatherHint = m.getWeatherHint; } catch(e){}
        }
        if (mods['../../../utils/croeX.js']) {
          try { const m = await mods['../../../utils/croeX.js'](); if (m.getCropEmoji) newUtils.getCropEmoji = m.getCropEmoji; } catch(e){}
        }
        if (mods['../../../utils/uiEngine.js']) {
          try {
             const m = await mods['../../../utils/uiEngine.js']();
             if (m.runGSAPReveal) newUtils.runGSAPReveal = m.runGSAPReveal;
             if (m.panelMotionProps) newUtils.panelMotionProps = m.panelMotionProps;
             if (m.barMotionProps) newUtils.barMotionProps = m.barMotionProps;
          } catch(e){}
        }
      }
      setUtils(u => ({ ...u, ...newUtils }));
    });
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const data = await getWeather(pos.coords.latitude, pos.coords.longitude);
        setWeather(data);
      } catch {}
    });
  }, []);

  /* GSAP reveal when result arrives */
  /* GSAP reveal when result arrives */
  useEffect(() => {
    if (crop && panelRef.current && isPremium) {
      utils.runGSAPReveal(panelRef.current);
    }
  }, [crop, isPremium, utils]);

  /* ── Loading state — logic unchanged ── */
  if (loading) return (
    <div
      className={`rounded-2xl p-8 flex flex-col items-center justify-center gap-4 min-h-[320px] ${isPremium ? '' : 'bg-slate-900 border border-slate-800'}`}
      style={isPremium ? { background: "linear-gradient(160deg, #071409, #040e07)", border: "1px solid rgba(52,211,153,0.1)" } : {}}
    >
      <div
        className="w-14 h-14 rounded-full border-2 animate-spin"
        style={{ borderColor: "rgba(52,211,153,0.2)", borderTopColor: "#34d399" }}
      />
      <p className="text-sm font-medium text-gray-500">Analyzing your inputs...</p>
    </div>
  );

  /* ── Empty state — logic unchanged ── */
  if (!crop) return (
    <div
      className={`rounded-2xl p-8 flex flex-col items-center justify-center gap-5 min-h-[320px] ${isPremium ? '' : 'bg-slate-900 border border-slate-800'}`}
      style={isPremium ? { background: "linear-gradient(160deg, #071409, #040e07)", border: "1px solid rgba(52,211,153,0.08)" } : {}}
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}
      >
        <Leaf size={28} style={{ color: "#34d399", opacity: 0.6 }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-gray-400">Prediction appears here</p>
        <p className={`text-xs mt-1 ${isPremium ? "text-emerald-500/60" : "text-gray-700"}`}>Fill in your soil &amp; weather parameters to begin</p>
      </div>
    </div>
  );

  return (
    <motion.div
      ref={panelRef}
      {...(isPremium ? utils.panelMotionProps : {})}
      className={`relative rounded-2xl overflow-hidden ${isPremium ? '' : 'bg-slate-900 border border-slate-800'}`}
      style={isPremium ? {
        background: "linear-gradient(160deg, #071409, #040e07)",
        border: `1px solid ${color}20`,
        boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 60px ${glow.glow}40`,
      } : {}}
    >
      {/* Top accent */}
      {isPremium && <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }} />}

      {/* Premium crown badge */}
      {isPremium && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full"
          style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)" }}>
          <Crown size={10} style={{ color: "#fbbf24" }} />
          <span className="text-[9px] font-bold uppercase tracking-widest text-yellow-400">Premium</span>
        </div>
      )}

      <div className="p-6 space-y-5">

        {/* ── MAIN RESULT — logic unchanged ── */}
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{
              background: `${color}12`,
              border: `1px solid ${color}25`,
              boxShadow: `0 0 24px ${color}20`,
            }}
          >
            {/* getCropEmoji only for premium — logic unchanged */}
            {isPremium ? utils.getCropEmoji(crop) : "🌱"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: `${color}80` }}>
              Top Prediction
            </p>
            {/* crop name — logic unchanged */}
            <h2
              className="text-2xl font-black text-white leading-none"
              style={{ fontFamily: "serif", letterSpacing: "-0.02em", color }}
            >
              {crop}
            </h2>
          </div>

          {/* New See in 3D Button (Premium Only) */}
          {isPremium && (
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShow3D(true)}
              className="ml-auto px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2 hover:bg-emerald-500/20 transition-all text-xs font-bold"
            >
              <Box size={14} /> See in 3D <Sparkles size={12} className="opacity-60" />
            </motion.button>
          )}
        </div>

        {/* ── CONFIDENCE — logic unchanged ── */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <TrendingUp size={12} style={{ color }} />
              <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                Confidence
              </span>
            </div>
            <span className="text-base font-black" style={{ color }}>{percent}%</span>
          </div>
          <div className="h-2 w-full rounded-full" style={{ background: "rgba(255,255,255,0.05)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: `0 0 12px ${color}50` }}
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* ── WEATHER HINT (premium only) — logic unchanged ── */}
        {isPremium && (
          <div
            className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl"
            style={{ background: "rgba(56,189,248,0.06)", border: "1px solid rgba(56,189,248,0.15)" }}
          >
            <Zap size={13} className="flex-shrink-0 mt-0.5" style={{ color: "#38bdf8" }} />
            <p className="text-xs leading-relaxed" style={{ color: "#93c5fd" }}>
              {/* getWeatherHint — logic unchanged */}
              {utils.getWeatherHint(weather, crop)}
            </p>
          </div>
        )}

        {/* ── EXPLANATION (premium only) — logic unchanged ── */}
        {isPremium && (
          <div
            className="px-4 py-3 rounded-xl space-y-1"
            style={{ background: "rgba(52,211,153,0.04)", border: "1px solid rgba(52,211,153,0.1)" }}
          >
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isPremium ? "text-emerald-400" : "text-emerald-600"}`}>
              AI Analysis
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              {/* explainCrop — logic unchanged */}
              {utils.explainCrop(inputData, crop)}
            </p>
          </div>
        )}

        {/* ── CHART (premium only) — logic unchanged ── */}
        {isPremium && (
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${isPremium ? "text-white/40" : "text-gray-600"}`}>
              Top 3 Predictions
            </p>
            <PredictionChart top3={top3} />
          </div>
        )}

        {/* ── FALLBACK top3 list (non-premium) — logic unchanged ── */}
        {!isPremium && (
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">All Predictions</p>
              {/* Upsell chip */}
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.2)" }}>
                <Lock size={9} style={{ color: "#fbbf24" }} />
                <span className="text-[9px] font-bold text-yellow-400 uppercase tracking-widest">Charts unlocked in Premium</span>
              </div>
            </div>
            {top3?.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-3 py-2 rounded-xl"
                style={{ background: i === 0 ? `${color}08` : "rgba(255,255,255,0.02)", border: `1px solid ${i === 0 ? `${color}20` : "rgba(255,255,255,0.04)"}` }}
              >
                <span className="text-sm font-semibold" style={{ color: i === 0 ? color : "rgba(255,255,255,0.5)" }}>
                  {item.crop}
                </span>
                <span className="text-xs font-bold" style={{ color: i === 0 ? color : "rgba(255,255,255,0.25)" }}>
                  {item.probability}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 3D CROP DETAIL VIEW (Suspense for Pluggable Architecture) */}
      {show3D && isPremium && (
        <Suspense fallback={null}>
           <PremiumCrop3D 
              cropName={crop}
              confidence={percent}
              weather={weather}
              onClose={() => setShow3D(false)}
           />
        </Suspense>
      )}
    </motion.div>
  );
};

export default PredictionPanel;
