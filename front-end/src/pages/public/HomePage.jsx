// src/pages/public/HomePage.jsx
/*
=========================================================
🌿 CROPCAST — PREMIUM HOME PAGE
  ✔ All logic unchanged (location.state scrollTo)
  ✔ Three.js floating particle field (organic spores)
  ✔ GSAP ScrollTrigger section fade-reveals
  ✔ Fully responsive — canvas adapts to all viewports
=========================================================

  DEPENDENCIES (add if not installed):
    npm install gsap three
=========================================================
*/

import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { scroller } from "react-scroll";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import ScrollToTop from "../../components/common/ScrollToTop";

import HomeSection    from "../../sections/HomeSection";
import ServiceSection from "../../sections/ServiceSection";
import AboutSection   from "../../sections/AboutSection";
import ContactSection from "../../sections/ContactSection";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   THREE.JS PARTICLE FIELD
   Floating organic spore / pollen particles
   that drift upward slowly — suggests growth
───────────────────────────────────────────── */
function useParticleField(canvasRef) {
  useEffect(() => {
    const canvas  = canvasRef.current;
    if (!canvas) return;

    /* Renderer */
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    /* Scene + camera */
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 30;

    /* Particle geometry */
    const COUNT   = 380;
    const positions = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);
    const speeds    = new Float32Array(COUNT);
    const phases    = new Float32Array(COUNT);

    const spread = 50;

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      sizes[i]             = 0.5 + Math.random() * 1.8;
      speeds[i]            = 0.012 + Math.random() * 0.025;
      phases[i]            = Math.random() * Math.PI * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("size",     new THREE.BufferAttribute(sizes, 1));

    /* Circular soft-dot texture */
    const texCanvas  = document.createElement("canvas");
    texCanvas.width  = 64;
    texCanvas.height = 64;
    const ctx = texCanvas.getContext("2d");
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0,    "rgba(52, 211, 153, 0.95)");
    grad.addColorStop(0.4,  "rgba(52, 211, 153, 0.4)");
    grad.addColorStop(1,    "rgba(52, 211, 153, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    const texture = new THREE.CanvasTexture(texCanvas);

    const material = new THREE.PointsMaterial({
      size:        0.4,
      map:         texture,
      transparent: true,
      blending:    THREE.AdditiveBlending,
      depthWrite:  false,
      vertexColors: false,
      color:       new THREE.Color(0x34d399),
      opacity:     0.55,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    /* Resize handler */
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    /* Mouse parallax */
    let mx = 0, my = 0;
    const onMouse = (e) => {
      mx = (e.clientX / window.innerWidth  - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse);

    /* Animation loop */
    let frameId;
    const posAttr = geometry.attributes.position;

    const animate = (t) => {
      frameId = requestAnimationFrame(animate);

      const time = t * 0.001;

      for (let i = 0; i < COUNT; i++) {
        /* Drift upward */
        posAttr.array[i * 3 + 1] += speeds[i] * 0.04;

        /* Gentle horizontal sway */
        posAttr.array[i * 3] += Math.sin(time * 0.3 + phases[i]) * 0.004;

        /* Wrap vertically */
        if (posAttr.array[i * 3 + 1] > spread / 2) {
          posAttr.array[i * 3 + 1] = -spread / 2;
        }
      }
      posAttr.needsUpdate = true;

      /* Subtle mouse parallax on camera */
      camera.position.x += (mx * 2 - camera.position.x) * 0.02;
      camera.position.y += (-my * 1.5 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      /* Slow global rotation */
      particles.rotation.z = time * 0.015;

      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    /* Scroll opacity fade — dimmer deep in page */
    const onScroll = () => {
      const pct = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
      material.opacity = 0.55 * (1 - pct * 0.7);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
    };
  }, []);
}

/* ─────────────────────────────────────────────
   GSAP SECTION REVEALS
───────────────────────────────────────────── */
function useSectionReveals() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Each section fades + rises on scroll */
      gsap.utils.toArray(".reveal-section").forEach((section, i) => {
        gsap.fromTo(
          section,
          { y: 48, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.75,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start:   "top 88%",
              once:    true,
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);
}

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */
const HomePage = () => {
  const location  = useLocation();
  const canvasRef = useRef(null);

  useParticleField(canvasRef);
  useSectionReveals();

  /* ── Scroll-to-section on nav — logic unchanged ── */
  useEffect(() => {
    if (location.state?.scrollTo) {
      scroller.scrollTo(location.state.scrollTo, {
        duration: 700,
        smooth:   "easeInOutQuart",
        offset:   -80,
      });
    }
  }, [location]);

  return (
    <div
      className="relative min-h-screen text-white"
      style={{ background: "linear-gradient(180deg, #020c08 0%, #030f0a 40%, #020809 100%)" }}
    >

      {/* ── THREE.JS CANVAS — full viewport, fixed behind everything ── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* ── CONTENT — sits above canvas ── */}
      <div className="relative" style={{ zIndex: 1 }}>
        <Navbar />

        {/* Sections each get the reveal class */}
        <div className="reveal-section">
          <HomeSection />
        </div>

        <div className="reveal-section">
          <AboutSection />
        </div>

        <div className="reveal-section">
          <ServiceSection />
        </div>

        <div className="reveal-section">
          <ContactSection />
        </div>

        <Footer />
        <ScrollToTop />
      </div>
    </div>
  );
};

export default HomePage;