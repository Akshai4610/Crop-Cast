// WeatherForm.jsx — Premium redesign, ALL logic unchanged
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { FlaskConical, Thermometer, Droplets, CloudRain, Sprout, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

/* ── field metadata ── */
const FIELDS = [
  { name: "N",           label: "Nitrogen (N)",     icon: <FlaskConical size={14} />,  unit: "mg/kg", accent: "#34d399", hint: "0–200"  },
  { name: "P",           label: "Phosphorus (P)",   icon: <FlaskConical size={14} />,  unit: "mg/kg", accent: "#60a5fa", hint: "0–200"  },
  { name: "K",           label: "Potassium (K)",    icon: <FlaskConical size={14} />,  unit: "mg/kg", accent: "#a78bfa", hint: "0–200"  },
  { name: "temperature", label: "Temperature",      icon: <Thermometer size={14} />,   unit: "°C",    accent: "#fb923c", hint: "0–50"   },
  { name: "humidity",    label: "Humidity",         icon: <Droplets size={14} />,      unit: "%",     accent: "#38bdf8", hint: "0–100"  },
  { name: "ph",          label: "Soil pH",          icon: <Sprout size={14} />,        unit: "pH",    accent: "#4ade80", hint: "0–14"   },
  { name: "rainfall",    label: "Rainfall",         icon: <CloudRain size={14} />,     unit: "mm",    accent: "#818cf8", hint: "0–3000" },
];

const WeatherForm = ({ onPredict, loading }) => {
  /* ── State — logic unchanged ── */
  const [formData, setFormData] = useState({
    N: "", P: "", K: "", temperature: "", humidity: "", ph: "", rainfall: "",
  });

  const formRef = useRef(null);

  /* ── Logic unchanged ── */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      N: Number(formData.N), P: Number(formData.P), K: Number(formData.K),
      temperature: Number(formData.temperature), humidity: Number(formData.humidity),
      ph: Number(formData.ph), rainfall: Number(formData.rainfall),
    };
    onPredict(payload);
  };

  /* ── GSAP entrance ── */
  useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(formRef.current,
        { x: -32, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.65, ease: "power3.out" }
      );
      gsap.fromTo(".wf-field",
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.07, duration: 0.45, ease: "power2.out", delay: 0.2 }
      );
    }, formRef);
    return () => ctx.revert();
  }, []);

  /* Fill progress */
  const filled = Object.values(formData).filter(Boolean).length;
  const fillPct = Math.round((filled / 7) * 100);

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="relative rounded-2xl overflow-hidden h-fit"
      style={{
        background: "linear-gradient(160deg, #071409, #040e07)",
        border: "1px solid rgba(52,211,153,0.1)",
        boxShadow: "0 24px 64px rgba(0,0,0,0.5)",
      }}
    >
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

      {/* ── HEADER ── */}
      <div className="px-5 pt-6 pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-500 mb-1">
              Input Parameters
            </p>
            {/* Title — logic unchanged */}
            <h3 className="text-lg font-black text-white" style={{ fontFamily: "serif", letterSpacing: "-0.01em" }}>
              Soil &amp; Weather
            </h3>
          </div>

          {/* Fill indicator */}
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-bold" style={{ color: fillPct === 100 ? "#34d399" : "rgba(255,255,255,0.3)" }}>
              {fillPct}%
            </span>
            <div className="w-20 h-1.5 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
              <motion.div
                className="h-full rounded-full"
                style={{ background: "linear-gradient(90deg, #059669, #34d399)" }}
                animate={{ width: `${fillPct}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── FIELDS ── */}
      <div className="px-5 py-5 space-y-3">
        {FIELDS.map(({ name, label, icon, unit, accent, hint }) => (
          <PremiumField
            key={name}
            name={name}
            label={label}
            icon={icon}
            unit={unit}
            accent={accent}
            hint={hint}
            value={formData[name]}
            onChange={handleChange}
          />
        ))}
      </div>

      {/* ── SUBMIT ── */}
      <div className="px-5 pb-6">
        <button
          id="predict-btn"
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.97]"
          style={{
            background: loading
              ? "rgba(52,211,153,0.15)"
              : "linear-gradient(135deg, #059669, #34d399)",
            boxShadow: loading ? "none" : "0 8px 28px rgba(52,211,153,0.3)",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Predicting...
            </>
          ) : (
            <>
              Predict Crop
              <ChevronRight size={16} />
            </>
          )}
        </button>
      </div>
    </form>
  );
};

/* ── Premium input field ── */
function PremiumField({ name, label, icon, unit, accent, hint, value, onChange }) {
  const [focused, setFocused] = useState(false);
  const hasVal = value !== "" && value !== undefined;

  return (
    <div className="wf-field group relative">
      <div
        className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl transition-all duration-200"
        style={{
          background: focused
            ? `${accent}09`
            : hasVal
            ? "rgba(255,255,255,0.025)"
            : "rgba(255,255,255,0.02)",
          border: `1px solid ${focused ? `${accent}50` : hasVal ? `${accent}20` : "rgba(255,255,255,0.06)"}`,
          boxShadow: focused ? `0 0 0 3px ${accent}10` : "none",
        }}
      >
        {/* Icon */}
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
          style={{
            background: `${accent}12`,
            color: focused || hasVal ? accent : "rgba(255,255,255,0.2)",
          }}
        >
          {icon}
        </div>

        {/* Input + label stack */}
        <div className="flex-1 min-w-0">
          <label
            className="block transition-all duration-200 pointer-events-none"
            style={{
              fontSize: focused || hasVal ? "9px" : "11px",
              fontWeight: 600,
              color: focused ? accent : "rgba(255,255,255,0.3)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: focused || hasVal ? "2px" : "0",
            }}
          >
            {label}
          </label>
          {/* Logic unchanged: name, type, value, onChange */}
          <input
            id={name}
            name={name}
            type="number"
            placeholder={focused ? hint : ""}
            value={value}
            onChange={onChange}
            required
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full bg-transparent text-sm font-semibold text-white outline-none placeholder-white/20"
            style={{ lineHeight: 1.2 }}
          />
        </div>

        {/* Unit badge */}
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 transition-all duration-200"
          style={{
            background: focused || hasVal ? `${accent}15` : "rgba(255,255,255,0.04)",
            color: focused || hasVal ? accent : "rgba(255,255,255,0.2)",
            border: `1px solid ${focused || hasVal ? `${accent}25` : "transparent"}`,
          }}
        >
          {unit}
        </span>
      </div>
    </div>
  );
}

export default WeatherForm;