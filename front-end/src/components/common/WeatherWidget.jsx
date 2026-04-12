/* ═══════════════════════════════════════════════
   WeatherWidget.jsx
   Logic: unchanged (getKochiWeather, weather state)
═══════════════════════════════════════════════ */

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { Wind, Navigation, Thermometer, Droplets } from "lucide-react";
import { getKochiWeather } from "../../services/api";

/* ── derive wind description ── */
function windDesc(speed) {
  if (speed < 10) return "Calm";
  if (speed < 25) return "Light Breeze";
  if (speed < 50) return "Moderate";
  return "Strong Wind";
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const cardRef = useRef(null);

  /* ── Logic unchanged ── */
  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await getKochiWeather();
        setWeather(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadWeather();
  }, []);

  /* ── GSAP reveal when data arrives ── */
  useEffect(() => {
    if (!weather || !cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
    gsap.fromTo(
      cardRef.current.querySelectorAll(".w-stat"),
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.45, ease: "power2.out", delay: 0.2 }
    );
  }, [weather]);

  /* ── Loading skeleton ── */
  if (!weather) {
    return (
      <div
        className="rounded-2xl p-5 animate-pulse"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", minWidth: "220px" }}
      >
        <div className="h-3 w-24 rounded bg-white/10 mb-4" />
        <div className="h-8 w-20 rounded bg-white/10 mb-3" />
        <div className="space-y-2">
          <div className="h-2.5 w-full rounded bg-white/5" />
          <div className="h-2.5 w-3/4 rounded bg-white/5" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "linear-gradient(145deg, rgba(5,30,18,0.9), rgba(2,12,8,0.95))",
        border: "1px solid rgba(52,211,153,0.12)",
        boxShadow: "0 16px 48px rgba(0,0,0,0.4), 0 0 40px rgba(5,150,105,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Top accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

      {/* Glow orb */}
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(5,150,105,0.15) 0%, transparent 70%)", filter: "blur(20px)" }}
      />

      <div className="relative p-5">

        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: "rgba(52,211,153,0.6)" }}>
              Live Weather · Kochi
            </p>
          </div>
          {/* Animated cloud icon */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "rgba(52,211,153,0.1)" }}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" style={{ color: "#34d399" }}>
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Big temperature */}
        <div className="flex items-end gap-1.5 mb-5">
          <span className="text-4xl font-black text-white leading-none" style={{ fontFamily: "serif" }}>
            {weather.temperature}
          </span>
          <span className="text-lg font-bold mb-1" style={{ color: "#34d399" }}>°C</span>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2">
          <WeatherStat icon={<Wind size={12} />}       label="Wind"      value={`${weather.windspeed} km/h`}    sub={windDesc(weather.windspeed)} />
          <WeatherStat icon={<Navigation size={12} />} label="Direction" value={`${weather.winddirection}°`}    sub="Wind dir" />
          <WeatherStat icon={<Thermometer size={12} />} label="Feels"    value={`${weather.temperature - 1}°`}  sub="Feels like" />
        </div>
      </div>
    </div>
  );
}

function WeatherStat({ icon, label, value, sub }) {
  return (
    <div
      className="w-stat flex flex-col gap-1 px-2.5 py-2 rounded-xl"
      style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
    >
      <div className="flex items-center gap-1" style={{ color: "rgba(52,211,153,0.6)" }}>
        {icon}
        <span className="text-[9px] text-gray-600 uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-sm font-bold text-white leading-none">{value}</p>
      {sub && <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.25)" }}>{sub}</p>}
    </div>
  );
}