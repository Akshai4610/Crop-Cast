// src/sections/ServiceSection.jsx
import { useEffect, useRef } from "react";
import { Element } from "react-scroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Cloud, Sprout, BarChart2, Droplets, Wind, Thermometer } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    icon: <Cloud size={22} />,
    title: "Weather Forecast",
    desc: "Accurate short-term and long-term weather predictions tailored to your farm's exact coordinates.",
    accent: "#38bdf8",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.15)",
  },
  {
    icon: <Sprout size={22} />,
    title: "Crop Recommendation",
    desc: "AI-driven crop suggestions based on live climate, soil type, and seasonal patterns.",
    accent: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.15)",
  },
  {
    icon: <BarChart2 size={22} />,
    title: "Expert Insights",
    desc: "Actionable analytics and market-aware advice to maximize your yield and profit margins.",
    accent: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.15)",
  },
  {
    icon: <Droplets size={22} />,
    title: "Irrigation Planning",
    desc: "Smart watering schedules computed from rainfall forecasts and evapotranspiration rates.",
    accent: "#60a5fa",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.15)",
  },
  {
    icon: <Wind size={22} />,
    title: "Microclimate Analysis",
    desc: "Hyperlocal wind, humidity, and pressure readings for precision crop management.",
    accent: "#fbbf24",
    bg: "rgba(251,191,36,0.08)",
    border: "rgba(251,191,36,0.15)",
  },
  {
    icon: <Thermometer size={22} />,
    title: "Frost & Heat Alerts",
    desc: "Real-time alerts for temperature extremes so you can protect crops before damage occurs.",
    accent: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.15)",
  },
];

const ServiceSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {

      /* Title */
      gsap.fromTo(".svc-title",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".svc-title", start: "top 88%", once: true } }
      );

      /* Cards stagger */
      gsap.fromTo(".svc-card",
        { y: 48, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.1, duration: 0.65, ease: "power3.out",
          scrollTrigger: { trigger: ".svc-grid", start: "top 85%", once: true } }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  /* Tilt on mouse move */
  const handleMouseMove = (e, cardEl) => {
    const rect   = cardEl.getBoundingClientRect();
    const cx     = rect.left + rect.width  / 2;
    const cy     = rect.top  + rect.height / 2;
    const dx     = (e.clientX - cx) / (rect.width  / 2);
    const dy     = (e.clientY - cy) / (rect.height / 2);
    gsap.to(cardEl, { rotateY: dx * 6, rotateX: -dy * 6, duration: 0.3, ease: "power1.out", transformPerspective: 800 });
  };

  const handleMouseLeave = (cardEl) => {
    gsap.to(cardEl, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power3.out" });
  };

  return (
    <Element name="services">
      <section
        ref={sectionRef}
        className="relative py-24 sm:py-32 px-5 sm:px-8 overflow-hidden"
        style={{ background: "rgba(2,8,7,0.95)" }}
      >
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.2), transparent)" }} />

        {/* Background radial */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(5,150,105,0.05) 0%, transparent 65%)", filter: "blur(40px)" }}
        />

        <div className="max-w-6xl mx-auto">

          {/* ── HEADLINE ── */}
          <div className="svc-title text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500">
              What We Offer
            </span>
            <h2
              className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight"
              style={{ fontFamily: "serif", letterSpacing: "-0.02em" }}
            >
              Our <span style={{ color: "#34d399" }}>Services</span>
            </h2>
            <p className="mt-4 text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
              Powerful tools designed for modern agriculture — from raw data to decisive action.
            </p>
          </div>

          {/* ── GRID ── */}
          <div className="svc-grid grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map(({ icon, title, desc, accent, bg, border }) => (
              <div
                key={title}
                className="svc-card group relative rounded-2xl p-6 cursor-default"
                style={{
                  background: "linear-gradient(145deg, rgba(10,18,14,0.9), rgba(5,10,8,0.9))",
                  border: `1px solid rgba(255,255,255,0.06)`,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  willChange: "transform",
                }}
                onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
                onMouseLeave={(e) => handleMouseLeave(e.currentTarget)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = `1px solid ${border}`;
                  e.currentTarget.style.boxShadow = `0 16px 48px rgba(0,0,0,0.4), 0 0 40px ${bg}`;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.06)";
                  e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
                }}
              >
                {/* Top accent bar */}
                <div
                  className="absolute inset-x-0 top-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
                />

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                  style={{ background: bg, color: accent }}
                >
                  {icon}
                </div>

                {/* Text */}
                <h3
                  className="font-bold text-white mb-2 text-base leading-snug"
                  style={{ letterSpacing: "-0.01em" }}
                >
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {desc}
                </p>

                {/* Bottom arrow — appears on hover */}
                <div
                  className="mt-5 flex items-center gap-1.5 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-0 group-hover:translate-x-1"
                  style={{ color: accent }}
                >
                  Learn more
                  <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                    <path d="M2 6h8M7 3l3 3-3 3" stroke={accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.15), transparent)" }} />
      </section>
    </Element>
  );
};

export default ServiceSection;