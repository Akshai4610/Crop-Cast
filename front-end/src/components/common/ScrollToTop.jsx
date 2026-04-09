/*
=========================================================
🌿 CROPCAST — PREMIUM SCROLL TO TOP
  ✔ Logic unchanged (show after 300px, smooth scroll)
  ✔ SVG circular scroll-progress ring
  ✔ GSAP scale-in / scale-out animations
  ✔ Percentage indicator
=========================================================
*/

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";

const RADIUS    = 20;
const CIRC      = 2 * Math.PI * RADIUS;

const ScrollToTop = () => {
  const [show,       setShow]       = useState(false);
  const [scrollPct,  setScrollPct]  = useState(0);
  const btnRef                      = useRef(null);
  const prevShow                    = useRef(false);

  /* ── Logic unchanged + progress calc ── */
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop    = window.scrollY;
      const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
      const pct          = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;

      setScrollPct(pct);
      setShow(scrollTop > 300);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ── GSAP show/hide ── */
  useEffect(() => {
    if (!btnRef.current) return;

    if (show && !prevShow.current) {
      gsap.fromTo(
        btnRef.current,
        { scale: 0.4, opacity: 0, y: 12 },
        { scale: 1, opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.5)" }
      );
    } else if (!show && prevShow.current) {
      gsap.to(btnRef.current, { scale: 0.4, opacity: 0, y: 12, duration: 0.3, ease: "power2.in" });
    }

    prevShow.current = show;
  }, [show]);

  /* ── Scroll to top — logic unchanged ── */
  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const dashOffset = CIRC * (1 - scrollPct / 100);

  if (!show && !prevShow.current) return null;

  return (
    <button
      ref={btnRef}
      onClick={scrollTop}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 w-12 h-12 flex items-center justify-center group"
      style={{ opacity: 0 }} /* GSAP controls this */
      onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2 })}
      onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1.0, duration: 0.2 })}
    >
      {/* Glow halo */}
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle, rgba(52,211,153,0.25) 0%, transparent 70%)",
          transform: "scale(1.6)",
        }}
      />

      {/* SVG ring */}
      <svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        className="-rotate-90 absolute inset-0"
      >
        {/* Track */}
        <circle
          cx="24" cy="24" r={RADIUS}
          fill="rgba(5,8,12,0.85)"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="2"
        />
        {/* Progress arc */}
        <circle
          cx="24" cy="24" r={RADIUS}
          fill="transparent"
          stroke="url(#progressGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.25s ease" }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#059669" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>

      {/* Arrow icon */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-px">
        <svg
          viewBox="0 0 12 12"
          fill="none"
          className="w-3.5 h-3.5 -translate-y-px group-hover:-translate-y-0.5 transition-transform duration-200"
        >
          <path
            d="M6 10V2M2.5 5.5L6 2l3.5 3.5"
            stroke="#34d399"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span
          className="text-[8px] font-bold leading-none"
          style={{ color: "rgba(52,211,153,0.7)" }}
        >
          {Math.round(scrollPct)}%
        </span>
      </div>
    </button>
  );
};

export default ScrollToTop;