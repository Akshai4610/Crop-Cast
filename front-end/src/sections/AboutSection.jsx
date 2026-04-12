// src/sections/AboutSection.jsx
import { useEffect, useRef, useState } from "react";
import { Element } from "react-scroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Leaf, BarChart2, Globe, ShieldCheck } from "lucide-react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

/* ── animated counter ── */
function useCountUp(target, duration = 1400, start = false) {
  const [val, setVal] = useState(0);
  const raf = useRef(null);

  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(target * ease));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [start, target, duration]);

  return val;
}

const STATS = [
  { label: "Crop Varieties",       target: 22,   suffix: "+" },
  { label: "Prediction Accuracy",  target: 94,   suffix: "%" },
  { label: "Farmers Served",       target: 10000, suffix: "+"  },
  { label: "States Covered",       target: 15,   suffix: ""  },
];

const PILLARS = [
  { icon: <Leaf size={16} />,       title: "Smart Agronomy",   desc: "AI-driven crop selection using soil and climate data." },
  { icon: <BarChart2 size={16} />,  title: "Data Intelligence", desc: "Real-time analytics powering every recommendation."   },
  { icon: <Globe size={16} />,      title: "Regional Coverage", desc: "Localized models trained on regional climate patterns." },
  { icon: <ShieldCheck size={16} />, title: "Trusted Results",  desc: "94%+ accuracy validated against ground truth harvests." },
];

function StatItem({ target, suffix, label }) {
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  const val = useCountUp(target, 1400, started);

  useEffect(() => {
    if (!ref.current) return;
    ScrollTrigger.create({
      trigger: ref.current,
      start: "top 85%",
      once: true,
      onEnter: () => setStarted(true),
    });
  }, []);

  const display = target >= 1000 ? (val / 1000).toFixed(1) + "K" : String(val);

  return (
    <div ref={ref} className="text-center">
      <p
        className="text-3xl sm:text-4xl font-black"
        style={{ fontFamily: "serif", color: "#34d399" }}
      >
        {display}{suffix}
      </p>
      <p className="text-[11px] mt-1 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
        {label}
      </p>
    </div>
  );
}

function PillarCard({ icon, title, desc }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <motion.div
      className="about-pillar relative group rounded-2xl p-5 cursor-default overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
      onMouseMove={handleMouseMove}
      whileHover={{ y: -4, backdropFilter: "blur(12px)" }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              350px circle at ${mouseX}px ${mouseY}px,
              rgba(52, 211, 153, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative z-10">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110"
          style={{ background: "rgba(52,211,153,0.1)", color: "#34d399" }}
        >
          {icon}
        </div>
        <h3 className="text-sm font-bold text-white mb-1.5">{title}</h3>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{desc}</p>
      </div>
    </motion.div>
  );
}

const AboutSection = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {

      /* Left col text */
      gsap.fromTo(".about-left",
        { x: -48, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".about-left", start: "top 82%", once: true } }
      );

      /* Right visual */
      gsap.fromTo(".about-right",
        { x: 48, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".about-right", start: "top 82%", once: true } }
      );

      /* Pillar cards stagger */
      gsap.fromTo(".about-pillar",
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: "power3.out",
          scrollTrigger: { trigger: ".about-pillars", start: "top 85%", once: true } }
      );

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <Element name="about">
      <section
        ref={sectionRef}
        className="relative py-24 sm:py-32 px-5 sm:px-8 overflow-hidden"
        style={{ background: "linear-gradient(180deg, rgba(2,12,8,0) 0%, rgba(2,12,8,0.95) 15%, rgba(2,12,8,0.95) 85%, rgba(2,12,8,0) 100%)" }}
      >
        {/* Subtle section divider glow */}
        <div className="absolute inset-x-0 top-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.2), transparent)" }} />

        <div className="max-w-6xl mx-auto">

          {/* ── HEADLINE ── */}
          <div className="text-center mb-16">
            <span
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-500"
              style={{ letterSpacing: "0.2em" }}
            >
              Our Mission
            </span>
            <h2
              className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight"
              style={{ fontFamily: "serif", letterSpacing: "-0.02em" }}
            >
              About Crop<span style={{ color: "#34d399" }}>Cast</span>
            </h2>
          </div>

          {/* ── TWO-COLUMN ── */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20">

            {/* Left */}
            <div className="about-left space-y-6">
              <p className="text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                CropCast is a weather-based crop recommendation platform that helps
                farmers make informed decisions. By combining real-time climate
                data with machine learning models, CropCast improves productivity
                and reduces risk.
              </p>
              <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                Built for the Indian subcontinent, our models are trained on decades of
                regional agricultural data — accounting for monsoon cycles, soil composition,
                and market demand.
              </p>

              {/* CTA chip */}
              <div className="inline-flex items-center gap-2 mt-2">
                <div
                  className="px-4 py-2 rounded-xl text-sm font-semibold"
                  style={{
                    background: "rgba(52,211,153,0.08)",
                    border: "1px solid rgba(52,211,153,0.2)",
                    color: "#34d399",
                  }}
                >
                  Est. 2024 · Kerala, India
                </div>
              </div>
            </div>

            {/* Right — Visual card */}
            <div className="about-right relative">
              <div
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(5,150,105,0.25) 0%, rgba(2,12,8,0.8) 100%)",
                  border: "1px solid rgba(52,211,153,0.15)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 60px rgba(5,150,105,0.1)",
                  aspectRatio: "4/3",
                }}
              >
                {/* Grid overlay */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "linear-gradient(rgba(52,211,153,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Center content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "linear-gradient(135deg, #059669, #34d399)",
                      boxShadow: "0 0 40px rgba(52,211,153,0.4)",
                    }}
                  >
                    <Leaf size={36} className="text-white" />
                  </div>
                  <p className="text-white font-black text-2xl" style={{ fontFamily: "serif" }}>
                    Grow Smarter
                  </p>
                  <p className="text-xs text-gray-500 tracking-widest uppercase">
                    AI × Agriculture
                  </p>
                </div>

                {/* Glow ring */}
                <div
                  className="absolute inset-0 rounded-3xl"
                  style={{ boxShadow: "inset 0 0 60px rgba(5,150,105,0.15)" }}
                />
              </div>
            </div>
          </div>

          {/* ── STATS ROW ── */}
          <div
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-10 px-6 rounded-2xl mb-16"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {STATS.map((s) => (
              <StatItem key={s.label} {...s} />
            ))}
          </div>

          {/* ── PILLARS ── */}
          <div className="about-pillars grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PILLARS.map((p) => (
              <PillarCard key={p.title} {...p} />
            ))}
          </div>

        </div>

        <div className="absolute inset-x-0 bottom-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(52,211,153,0.15), transparent)" }} />
      </section>
    </Element>
  );
};

export default AboutSection;