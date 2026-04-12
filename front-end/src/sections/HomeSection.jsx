// src/sections/HomeSection.jsx
import { useEffect, useRef } from "react";
import { Element } from "react-scroll";
import { gsap } from "gsap";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Leaf, Zap, Cloud } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

// ─────────────────────────────────────────────
// HIGHEST END UI: 3D Tilt Card Component
// ─────────────────────────────────────────────
const TiltCard = ({ children, className, delayStr }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      whileHover={{ scale: 1.05, zIndex: 50 }}
    >
      {/* Glossy overlay effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: useTransform(
            () => `radial-gradient(circle at ${x.get() * 100 + 50}% ${y.get() * 100 + 50}%, rgba(255,255,255,0.1) 0%, transparent 60%)`
          )
        }}
      />
      {/* Inner container pops out in 3D */}
      <div style={{ transform: "translateZ(30px)" }} className="flex items-center gap-3 w-full">
        {children}
      </div>
    </motion.div>
  );
};


const HomeSection = () => {
  const sectionRef = useRef(null);
  const navigate   = useNavigate();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      /* Badge */
      tl.fromTo(".hero-badge",
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 }
      )
      /* Each headline word staggers in */
      .fromTo(".hero-word",
        { y: 80, opacity: 0, rotateX: -40 },
        { y: 0, opacity: 1, rotateX: 0, stagger: 0.08, duration: 0.7 },
        "-=0.2"
      )
      /* Subtext */
      .fromTo(".hero-sub",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.3"
      )
      /* CTAs */
      .fromTo(".hero-cta",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 },
        "-=0.2"
      )
      /* Stats */
      .fromTo(".hero-stat",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 },
        "-=0.2"
      );

      /* Floating orbs parallax */
      gsap.to(".orb-1", { y: -30, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".orb-2", { y:  20, duration: 5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.8 });
      gsap.to(".orb-3", { y: -16, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.5 });

      /* Card floating icons */
      gsap.to(".float-card-1", { y: -12, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".float-card-2", { y:  10, duration: 3.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 0.5 });
      gsap.to(".float-card-3", { y: -8,  duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 1.2 });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const headline = ["Smart Crop", "Decisions,", "Powered by AI"];

  return (
    <Element name="home">
      <section
        ref={sectionRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 px-5 sm:px-8"
        style={{ background: "transparent" }} /* Three.js canvas shows through */
      >

        {/* ── AMBIENT ORBS ── */}
        <div
          className="orb-1 absolute top-20 left-[10%] w-72 h-72 sm:w-96 sm:h-96 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(5,150,105,0.18) 0%, transparent 70%)", filter: "blur(40px)" }}
        />
        <div
          className="orb-2 absolute bottom-32 right-[8%] w-64 h-64 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(52,211,153,0.12) 0%, transparent 70%)", filter: "blur(32px)" }}
        />
        <div
          className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(5,150,105,0.06) 0%, transparent 65%)", filter: "blur(60px)" }}
        />

        {/* ── FLOATING STAT CARDS (Now with 3D tilts) ── */}
        <TiltCard
          className="float-card-1 hidden lg:flex absolute top-36 right-[6%] items-center px-4 py-3 rounded-2xl cursor-pointer"
          style={{
            background: "rgba(10,20,15,0.6)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(52,211,153,0.15)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(52,211,153,0.12)" }}>
            <Cloud size={16} style={{ color: "#34d399" }} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Live Weather</p>
            <p className="text-sm font-bold text-white">28°C · Clear</p>
          </div>
        </TiltCard>

        <TiltCard
          className="float-card-2 hidden lg:flex absolute bottom-48 left-[5%] items-center px-4 py-3 rounded-2xl cursor-pointer"
          style={{
            background: "rgba(10,20,15,0.6)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(52,211,153,0.15)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(52,211,153,0.12)" }}>
            <Zap size={16} style={{ color: "#34d399" }} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Accuracy</p>
            <p className="text-sm font-bold text-white">94.2% · AI Model</p>
          </div>
        </TiltCard>

        <TiltCard
          className="float-card-3 hidden lg:flex absolute top-48 left-[6%] items-center px-4 py-3 rounded-2xl cursor-pointer"
          style={{
            background: "rgba(10,20,15,0.6)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(52,211,153,0.15)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(52,211,153,0.12)" }}>
            <Leaf size={16} style={{ color: "#34d399" }} />
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Crops Tracked</p>
            <p className="text-sm font-bold text-white">22 Varieties</p>
          </div>
        </TiltCard>

        {/* ── HERO CONTENT ── */}
        <div className="relative z-10 max-w-4xl w-full text-center">

          {/* Badge */}
          <div className="hero-badge inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full"
            style={{
              background: "rgba(52,211,153,0.08)",
              border: "1px solid rgba(52,211,153,0.2)",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-widest uppercase text-emerald-400">
              AI-Powered Agriculture
            </span>
          </div>

          {/* Headline — perspective on wrapper for 3D words */}
          <div style={{ perspective: "800px" }}>
            <h1 className="mb-6" style={{ lineHeight: 1.08 }}>
              {headline.map((line, li) => (
                <div key={li} className="overflow-hidden block">
                  {line.split(" ").map((word, wi) => (
                    <span
                      key={wi}
                      className="hero-word inline-block mr-4 last:mr-0"
                      style={{
                        fontSize: "clamp(2.4rem, 6vw, 5rem)",
                        fontWeight: 900,
                        fontFamily: "'DM Serif Display', Georgia, serif",
                        letterSpacing: "-0.025em",
                        color: li === 2 ? "#34d399" : "#fff",
                        display: "inline-block",
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </div>
              ))}
            </h1>
          </div>

          {/* Sub */}
          <p className="hero-sub text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            CropCast helps farmers choose the best crops using real-time weather
            insights and machine learning predictions — cutting risk, boosting yield.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="hero-cta flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-black"
              style={{
                background: "linear-gradient(135deg, #059669, #34d399)",
                boxShadow: "0 12px 32px rgba(52,211,153,0.4), inset 0 2px 0 rgba(255,255,255,0.2)",
              }}
            >
              Start Free
              <ArrowRight size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2, backgroundColor: "rgba(255,255,255,0.1)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/login")}
              className="hero-cta flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-semibold"
              style={{ 
                color: "rgba(255,255,255,0.85)", 
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(12px)"
              }}
            >
              Sign In
            </motion.button>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {[
              { value: "22+",  label: "Crop Varieties" },
              { value: "94%",  label: "Prediction Accuracy" },
              { value: "10K+", label: "Farmers Helped" },
            ].map(({ value, label }) => (
              <div key={label} className="hero-stat text-center">
                <p
                  className="text-2xl sm:text-3xl font-black"
                  style={{ color: "#34d399", fontFamily: "serif" }}
                >
                  {value}
                </p>
                <p className="text-xs mt-1 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(2,8,7,0.8), transparent)" }}
        />
      </section>
    </Element>
  );
};

export default HomeSection;