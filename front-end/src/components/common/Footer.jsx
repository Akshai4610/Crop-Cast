/*
=========================================================
🌿 CROPCAST — PREMIUM FOOTER
  ✔ All logic unchanged (isLoggedIn, goToSection, feedback)
  ✔ GSAP ScrollTrigger stagger reveals
  ✔ Editorial 4-column layout
  ✔ Rich emerald brand section
  ✔ Fully responsive
=========================================================
*/

import { Link, useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Leaf, MapPin, Mail, Phone, ArrowUpRight, Send } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const footerRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [feedback,   setFeedback]   = useState("");

  /* ── Check login — logic unchanged ── */
  const checkLogin = () => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  };

  useEffect(() => {
    checkLogin();
    window.addEventListener("userChanged", checkLogin);
    return () => window.removeEventListener("userChanged", checkLogin);
  }, []);

  /* ── GSAP ScrollTrigger column reveals ── */
  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      /* Brand column */
      gsap.fromTo(
        ".footer-brand",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 90%" },
        }
      );

      /* Other columns stagger */
      gsap.fromTo(
        ".footer-col",
        { y: 36, opacity: 0 },
        {
          y: 0, opacity: 1, stagger: 0.12, duration: 0.65, ease: "power3.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 90%" },
          delay: 0.15,
        }
      );

      /* Divider line draws in */
      gsap.fromTo(
        ".footer-divider",
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1, opacity: 1, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: ".footer-divider", start: "top 95%" },
        }
      );

      /* Bottom row */
      gsap.fromTo(
        ".footer-bottom",
        { y: 16, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, ease: "power2.out",
          scrollTrigger: { trigger: ".footer-bottom", start: "top 98%" },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  /* ── goToSection — logic unchanged ── */
  const goToSection = (section) => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: section } });
    } else {
      scroller.scrollTo(section, { smooth: true, duration: 600, offset: -80 });
    }
  };

  const NAV_LINKS = [
    { id: "home",     label: "Home"     },
    { id: "about",    label: "About"    },
    { id: "services", label: "Services" },
    { id: "contact",  label: "Contact"  },
  ];

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #020807 0%, #030c09 100%)",
        borderTop: "1px solid rgba(52,211,153,0.1)",
      }}
    >
      {/* Background grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(52,211,153,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial glow top-left */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(5,150,105,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 pt-16 pb-10">

        {/* ── MAIN GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* BRAND */}
          <div className="footer-brand lg:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #059669, #34d399)",
                  boxShadow: "0 0 24px rgba(52,211,153,0.3)",
                }}
              >
                <Leaf size={18} className="text-white" />
              </div>
              <span
                className="text-2xl font-black text-white"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.02em" }}
              >
                Crop<span style={{ color: "#34d399" }}>Cast</span>
              </span>
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
              AI-powered crop intelligence for the modern farmer. Precision recommendations, real-time insights, smarter harvests.
            </p>

            {/* Social row */}
            <div className="flex gap-2">
              {["𝕏", "in", "gh"].map((s) => (
                <button
                  key={s}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.07)",
                    color: "rgba(255,255,255,0.45)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(52,211,153,0.1)";
                    e.currentTarget.style.color = "#34d399";
                    e.currentTarget.style.borderColor = "rgba(52,211,153,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* QUICK LINKS */}
          <div className="footer-col">
            <h3
              className="text-[10px] font-bold uppercase tracking-[0.18em] mb-5"
              style={{ color: "#34d399" }}
            >
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => goToSection(link.id)}
                    className="flex items-center gap-2 text-sm group transition-all duration-200"
                    style={{ color: "rgba(255,255,255,0.45)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.45)"; }}
                  >
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-200"
                      style={{ color: "#34d399" }}
                    />
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* CONTACT */}
          <div className="footer-col">
            <h3
              className="text-[10px] font-bold uppercase tracking-[0.18em] mb-5"
              style={{ color: "#34d399" }}
            >
              Contact
            </h3>
            <ul className="space-y-3.5">
              {[
                { icon: <MapPin size={13} />, text: "Kerala, India" },
                { icon: <Mail size={13} />,   text: "support@cropcast.ai" },
                { icon: <Phone size={13} />,  text: "+91 98765 43210" },
              ].map(({ icon, text }) => (
                <li key={text} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex-shrink-0" style={{ color: "rgba(52,211,153,0.6)" }}>
                    {icon}
                  </span>
                  <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {text}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* DYNAMIC — feedback / account — logic unchanged */}
          <div className="footer-col">
            <h3
              className="text-[10px] font-bold uppercase tracking-[0.18em] mb-5"
              style={{ color: "#34d399" }}
            >
              {isLoggedIn ? "Feedback" : "Account"}
            </h3>

            {!isLoggedIn ? (
              <div className="flex flex-col gap-2.5">
                <Link
                  to="/login"
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-center transition-all duration-200"
                  style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.09)" }}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="w-full py-2.5 rounded-xl text-sm font-bold text-white text-center transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #059669, #34d399)",
                    boxShadow: "0 4px 16px rgba(52,211,153,0.25)",
                  }}
                >
                  Sign Up →
                </Link>
              </div>
            ) : (
              <form className="flex flex-col gap-2.5" onSubmit={(e) => e.preventDefault()}>
                <textarea
                  placeholder="Share your feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl resize-none transition-all duration-200 outline-none focus:ring-1"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "rgba(255,255,255,0.8)",
                    focusRingColor: "#34d399",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(52,211,153,0.35)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                />
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
                  style={{
                    background: "linear-gradient(135deg, #059669, #34d399)",
                    boxShadow: "0 4px 16px rgba(52,211,153,0.25)",
                  }}
                >
                  <Send size={13} />
                  Send
                </button>
              </form>
            )}
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div
          className="footer-divider my-10 h-px origin-left"
          style={{ background: "linear-gradient(90deg, rgba(52,211,153,0.25), rgba(52,211,153,0.05), transparent)" }}
        />

        {/* ── BOTTOM ROW ── */}
        <div className="footer-bottom flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} CropCast. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <button
                key={item}
                className="text-[12px] transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.25)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;