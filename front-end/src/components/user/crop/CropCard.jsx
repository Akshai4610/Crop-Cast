// CropCard.jsx — Premium redesign, logic unchanged
import { useRef } from "react";
import { gsap } from "gsap";
import { Droplets, Sun, Layers, Leaf } from "lucide-react";

/* ── per-crop accent colours ── */
const CROP_ACCENTS = {
  rice:    { color: "#34d399", glow: "rgba(52,211,153,0.25)",  icon: "🌾" },
  maize:   { color: "#fbbf24", glow: "rgba(251,191,36,0.25)",  icon: "🌽" },
  cotton:  { color: "#e2e8f0", glow: "rgba(226,232,240,0.2)",  icon: "🌿" },
  wheat:   { color: "#f59e0b", glow: "rgba(245,158,11,0.25)",  icon: "🌾" },
  mango:   { color: "#fb923c", glow: "rgba(251,146,60,0.25)",  icon: "🥭" },
  banana:  { color: "#fde047", glow: "rgba(253,224,71,0.25)",  icon: "🍌" },
  default: { color: "#34d399", glow: "rgba(52,211,153,0.2)",   icon: "🌱" },
};

function getAccent(name = "") {
  const key = name.toLowerCase();
  return Object.entries(CROP_ACCENTS).find(([k]) => key.includes(k))?.[1]
    || CROP_ACCENTS.default;
}

const WATER_CONFIG = {
  High:     { label: "High",     bars: 3, color: "#38bdf8" },
  Moderate: { label: "Moderate", bars: 2, color: "#34d399" },
  Low:      { label: "Low",      bars: 1, color: "#fbbf24" },
};

const CropCard = ({ name, season, water, soil }) => {
  const cardRef = useRef(null);
  const accent  = getAccent(name);
  const waterCfg = WATER_CONFIG[water] || WATER_CONFIG["Moderate"];

  /* 3-D tilt on hover */
  const onMouseMove = (e) => {
    const el   = cardRef.current;
    const rect = el.getBoundingClientRect();
    const dx   = ((e.clientX - rect.left) / rect.width  - 0.5) * 2;
    const dy   = ((e.clientY - rect.top)  / rect.height - 0.5) * 2;
    gsap.to(el, { rotateY: dx * 8, rotateX: -dy * 8, duration: 0.3, ease: "power1.out", transformPerspective: 900 });
  };

  const onMouseLeave = () => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power3.out" });
  };

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl overflow-hidden cursor-default"
      style={{ willChange: "transform" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Card body */}
      <div
        className="relative p-6 flex flex-col gap-4 h-full transition-all duration-300"
        style={{
          background: "linear-gradient(145deg, rgba(8,20,14,0.95), rgba(4,12,8,0.98))",
          border: `1px solid ${accent.color}22`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5)`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.6), 0 0 40px ${accent.glow}`;
          e.currentTarget.style.borderColor = `${accent.color}50`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)";
          e.currentTarget.style.borderColor = `${accent.color}22`;
        }}
      >
        {/* Top shimmer line */}
        <div
          className="absolute inset-x-0 top-0 h-px opacity-60 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: `linear-gradient(90deg, transparent, ${accent.color}, transparent)` }}
        />

        {/* Corner glow */}
        <div
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `radial-gradient(circle, ${accent.glow} 0%, transparent 70%)`, filter: "blur(16px)" }}
        />

        {/* Icon + name */}
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: `${accent.color}15`, border: `1px solid ${accent.color}25` }}
          >
            {getAccent(name).icon}
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: `${accent.color}80` }}>
              Crop Profile
            </p>
            {/* Logic unchanged: name prop */}
            <h3 className="text-xl font-black leading-none text-white" style={{ fontFamily: "serif", letterSpacing: "-0.02em" }}>
              {name}
            </h3>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "rgba(255,255,255,0.05)" }} />

        {/* Info rows */}
        <div className="space-y-3">
          <InfoRow icon={<Sun size={13} />} label="Season" value={season} accent={accent.color} />

          {/* Water — visual bars */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(56,189,248,0.1)", color: "#38bdf8" }}>
              <Droplets size={13} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">Water</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[1,2,3].map((i) => (
                    <div
                      key={i}
                      className="w-5 h-1.5 rounded-full transition-colors duration-300"
                      style={{
                        background: i <= waterCfg.bars ? waterCfg.color : "rgba(255,255,255,0.07)",
                        boxShadow: i <= waterCfg.bars ? `0 0 6px ${waterCfg.color}60` : "none",
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-400">{water}</span>
              </div>
            </div>
          </div>

          <InfoRow icon={<Layers size={13} />} label="Soil" value={soil} accent={accent.color} />
        </div>

        {/* Bottom tag */}
        <div className="mt-auto pt-2">
          <span
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
            style={{
              background: `${accent.color}12`,
              color: accent.color,
              border: `1px solid ${accent.color}25`,
            }}
          >
            <Leaf size={9} />
            Premium Insight
          </span>
        </div>
      </div>
    </div>
  );
};

function InfoRow({ icon, label, value, accent }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: `${accent}10`, color: accent }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest">{label}</p>
        <p className="text-sm text-gray-300 font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

export default CropCard;