/*
=========================================================
🌿 CROPCAST — PREMIUM PUBLIC NAVBAR
  ✔ All auth/routing logic unchanged
  ✔ GSAP entrance + stagger animations
  ✔ Scroll-aware glassmorphism
  ✔ Fluid mobile drawer
  ✔ Fully responsive
=========================================================
*/

import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { scroller } from "react-scroll";
import { Menu, X, Leaf } from "lucide-react";
import { gsap } from "gsap";
import { hasPremium } from "../../utils/premium-registry";
import { checkPremium } from "../../services/api";
import PremiumLockedModal from "./PremiumLockedModal";

import AdminNavbar from "../admin/navbar/AdminNavbar";

const Navbar = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [token,    setToken]    = useState(null);
  const [role,     setRole]     = useState(null);
  const [isLockedModalOpen, setIsLockedModalOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    checkPremium().then(setIsPremium);
  }, []);

  const navRef      = useRef(null);
  const logoRef     = useRef(null);
  const linksRef    = useRef(null);
  const actionsRef  = useRef(null);
  const drawerRef   = useRef(null);
  const overlayRef  = useRef(null);

  /* ── 🔥 Sync auth state — logic unchanged ── */
  useEffect(() => {
    const updateAuth = () => {
      setToken(localStorage.getItem("token"));
      setRole(localStorage.getItem("role"));
    };
    updateAuth();
    window.addEventListener("userChanged", updateAuth);
    return () => window.removeEventListener("userChanged", updateAuth);
  }, []);

  /* ── GSAP entrance on mount ── */
  useEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      /* Navbar bar slides in */
      gsap.fromTo(
        navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );

      /* Logo pops in */
      gsap.fromTo(
        logoRef.current,
        { x: -24, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, ease: "back.out(1.4)", delay: 0.25 }
      );

      /* Nav links stagger */
      if (linksRef.current) {
        gsap.fromTo(
          linksRef.current.querySelectorAll("button"),
          { y: -12, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.08, duration: 0.45, ease: "power2.out", delay: 0.35 }
        );
      }

      /* Action buttons stagger */
      if (actionsRef.current) {
        gsap.fromTo(
          actionsRef.current.querySelectorAll("button"),
          { x: 20, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.08, duration: 0.45, ease: "power2.out", delay: 0.5 }
        );
      }
    }, navRef);

    return () => ctx.revert();
  }, [token, role]);

  /* ── Mobile drawer GSAP ── */
  useEffect(() => {
    if (!drawerRef.current) return;

    if (open) {
      /* block scroll */
      document.body.style.overflow = "hidden";

      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 });
      gsap.fromTo(
        drawerRef.current,
        { x: "100%" },
        { x: "0%", duration: 0.4, ease: "power3.out" }
      );
      gsap.fromTo(
        drawerRef.current.querySelectorAll(".drawer-item"),
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, stagger: 0.07, duration: 0.35, ease: "power2.out", delay: 0.15 }
      );
    } else {
      document.body.style.overflow = "";
      gsap.to(drawerRef.current,   { x: "100%", duration: 0.3, ease: "power3.in" });
      gsap.to(overlayRef.current,  { opacity: 0, duration: 0.25 });
    }
  }, [open]);

  /* ── Scroll effect — logic unchanged ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Section scroll — logic unchanged ── */
  const goHomeAndScroll = (sectionId) => {
    setOpen(false);
    if (location.pathname === "/") {
      scroller.scrollTo(sectionId, { duration: 700, smooth: "easeInOutQuart", offset: -80 });
      return;
    }
    navigate("/", { state: { scrollTo: sectionId } });
  };

  /* ── 🔁 NAVBAR SWITCHING — logic unchanged ── */
  if (token && role === "admin") return <AdminNavbar />;
  if (token && role === "user")  return null;

  /* ── PUBLIC NAVBAR ── */
  const NAV_LINKS = [
    { id: "home",       label: "Home"       },
    { id: "about",      label: "About"      },
    { id: "services",   label: "Services"   },
    ...(hasPremium ? [{ id: "playground", label: "Playground" }] : []),
    { id: "contact",    label: "Contact"    },
  ];

  const handleNavLinkClick = (link) => {
     setOpen(false);
     if (link.id === "playground") {
       if (isPremium) {
         navigate("/playground");
       } else {
         setIsLockedModalOpen(true);
       }
     } else {
       goHomeAndScroll(link.id);
     }
  };

  return (
    <>
      <header
        ref={navRef}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? "rgba(5, 8, 12, 0.85)"
            : "rgba(5, 8, 12, 0.3)",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "blur(8px)",
          borderBottom: scrolled
            ? "1px solid rgba(52, 211, 153, 0.1)"
            : "1px solid transparent",
          boxShadow: scrolled ? "0 8px 40px rgba(0,0,0,0.5)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16 sm:h-18">

          {/* ── LOGO ── */}
          <div
            ref={logoRef}
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            {/* Icon mark */}
            <div className="relative">
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, #059669, #34d399)",
                  boxShadow: "0 0 20px rgba(52,211,153,0.35)",
                }}
              >
                <Leaf size={18} className="text-white" />
              </div>
              {/* Pulse ring */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(52,211,153,0.5)",
                  transform: "scale(1.25)",
                }}
              />
            </div>

            <div className="leading-none">
              <div
                className="font-black text-white tracking-tight text-lg sm:text-xl"
                style={{ fontFamily: "'DM Serif Display', Georgia, serif", letterSpacing: "-0.02em" }}
              >
                Crop<span style={{ color: "#34d399" }}>Cast</span>
              </div>
              <div className="text-[10px] tracking-[0.18em] uppercase mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                Smart Farming
              </div>
            </div>
          </div>

          {/* ── DESKTOP NAV ── */}
          <nav ref={linksRef} className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <NavBtn key={link.id} onClick={() => handleNavLinkClick(link)} label={link.label} />
            ))}
          </nav>

          {/* ── DESKTOP ACTIONS ── */}
          <div ref={actionsRef} className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-white/5"
              style={{ color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
              style={{
                background: "linear-gradient(135deg, #059669, #34d399)",
                boxShadow: "0 4px 16px rgba(52,211,153,0.3)",
              }}
            >
              Get Started
            </button>
          </div>

          {/* ── MOBILE HAMBURGER ── */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
            style={{
              background: open ? "rgba(52,211,153,0.15)" : "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: open ? "#34d399" : "rgba(255,255,255,0.8)",
            }}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* ── MOBILE OVERLAY ── */}
      <div
        ref={overlayRef}
        onClick={() => setOpen(false)}
        className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm opacity-0 pointer-events-none"
        style={{ pointerEvents: open ? "auto" : "none" }}
      />

      {/* ── MOBILE DRAWER ── */}
      <div
        ref={drawerRef}
        className="md:hidden fixed top-0 right-0 h-full w-72 z-50 flex flex-col"
        style={{
          background: "linear-gradient(160deg, #07100e, #040a08)",
          borderLeft: "1px solid rgba(52,211,153,0.12)",
          boxShadow: "-32px 0 80px rgba(0,0,0,0.7)",
          transform: "translateX(100%)",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #059669, #34d399)" }}
            >
              <Leaf size={15} className="text-white" />
            </div>
            <span className="font-bold text-white" style={{ fontFamily: "serif" }}>CropCast</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer links */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => handleNavLinkClick(link)}
              className="drawer-item w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200"
              style={{ color: "rgba(255,255,255,0.7)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(52,211,153,0.08)";
                e.currentTarget.style.color = "#34d399";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: "rgba(52,211,153,0.5)" }}
              />
              {link.label}
            </button>
          ))}
        </nav>

        {/* Drawer CTA */}
        <div
          className="drawer-item px-4 py-6 space-y-3"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <button
            onClick={() => { setOpen(false); navigate("/login"); }}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{ color: "rgba(255,255,255,0.8)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            Login
          </button>
          <button
            onClick={() => { setOpen(false); navigate("/signup"); }}
            className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #059669, #34d399)",
              boxShadow: "0 4px 16px rgba(52,211,153,0.25)",
            }}
          >
            Get Started →
          </button>
        </div>
      </div>

      <PremiumLockedModal 
        isOpen={isLockedModalOpen}
        onClose={() => setIsLockedModalOpen(false)}
      />
    </>
  );
};

/* ── Desktop Nav Button ── */
const NavBtn = ({ onClick, label }) => (
  <button
    onClick={onClick}
    className="relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 group"
    style={{ color: "rgba(255,255,255,0.65)" }}
    onMouseEnter={(e) => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; e.currentTarget.style.background = "transparent"; }}
  >
    {label}
    <span
      className="absolute bottom-1 left-4 right-4 h-px origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
      style={{ background: "linear-gradient(90deg, #059669, #34d399)" }}
    />
  </button>
);

export default Navbar;