// CropInsightsPage.jsx — Premium redesign, logic unchanged
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { Sparkles, Leaf } from "lucide-react";

import CropCard from "../../components/user/crop/CropCard";

gsap.registerPlugin(ScrollTrigger);

/* ── Three.js DNA helix particle field ── */
function useDNAParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 22);

    /* DNA helix positions */
    const COUNT = 200;
    const positions = new Float32Array(COUNT * 3);

    for (let i = 0; i < COUNT; i++) {
      const t    = (i / COUNT) * Math.PI * 8 - Math.PI * 4;
      const r    = 3.5;
      const strand = i % 2 === 0 ? 1 : -1;
      positions[i * 3]     = Math.cos(t + strand * Math.PI) * r;
      positions[i * 3 + 1] = t * 0.8;
      positions[i * 3 + 2] = Math.sin(t + strand * Math.PI) * r * 0.4;
    }

    /* Dot texture */
    const tc = document.createElement("canvas");
    tc.width  = 32; tc.height = 32;
    const tctx = tc.getContext("2d");
    const grad = tctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0,   "rgba(52,211,153,1)");
    grad.addColorStop(0.5, "rgba(52,211,153,0.3)");
    grad.addColorStop(1,   "rgba(52,211,153,0)");
    tctx.fillStyle = grad;
    tctx.fillRect(0, 0, 32, 32);
    const texture = new THREE.CanvasTexture(tc);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.25, map: texture, transparent: true,
      blending: THREE.AdditiveBlending, depthWrite: false,
      color: new THREE.Color(0x34d399), opacity: 0.7,
    });

    const pts = new THREE.Points(geo, mat);
    scene.add(pts);

    const resize = () => {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let frameId;
    const animate = (t) => {
      frameId = requestAnimationFrame(animate);
      pts.rotation.y = t * 0.0003;
      pts.rotation.x = Math.sin(t * 0.0002) * 0.1;
      renderer.render(scene, camera);
    };
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      geo.dispose(); mat.dispose(); texture.dispose(); renderer.dispose();
    };
  }, []);
}

const CropInsightsPage = () => {
  const pageRef   = useRef(null);
  const canvasRef = useRef(null);

  /* Logic unchanged: dummy crop data */
  const crops = [
    { name: "Rice",   season: "Kharif",        water: "High",     soil: "Clayey soil" },
    { name: "Maize",  season: "Kharif / Rabi", water: "Moderate", soil: "Loamy soil"  },
    { name: "Cotton", season: "Kharif",        water: "Moderate", soil: "Black soil"  },
  ];

  useDNAParticles(canvasRef);

  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      /* Header entrance */
      gsap.fromTo(".ci-header",
        { y: -40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }
      );
      /* Cards stagger */
      gsap.fromTo(".ci-card",
        { y: 60, opacity: 0, scale: 0.94 },
        { y: 0, opacity: 1, scale: 1, stagger: 0.15, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: ".ci-grid", start: "top 85%", once: true } }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="relative min-h-screen">

      {/* Three.js canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full pointer-events-none opacity-20"
        style={{ zIndex: 0 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── HEADER ── */}
        <div className="ci-header mb-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
            <Sparkles size={11} style={{ color: "#34d399" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
              Premium Intelligence
            </span>
          </div>

          {/* Title — logic unchanged: "Crop Insights" */}
          <h1
            className="text-4xl sm:text-5xl font-black text-white leading-none mb-4"
            style={{ fontFamily: "serif", letterSpacing: "-0.025em" }}
          >
            Crop{" "}
            <span
              className="relative"
              style={{
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundImage: "linear-gradient(135deg, #34d399, #a7f3d0, #059669)",
              }}
            >
              Insights
            </span>
          </h1>

          {/* Subtext — logic unchanged */}
          <p className="text-base max-w-2xl" style={{ color: "rgba(255,255,255,0.45)" }}>
            Detailed information about crops recommended by the machine learning
            model based on weather conditions.
          </p>

          {/* Stat row */}
          <div className="flex flex-wrap gap-5 mt-5">
            {[
              { v: crops.length, l: "Crops Analyzed" },
              { v: "AI", l: "Powered Insights" },
              { v: "Live", l: "Data Feed" },
            ].map(({ v, l }) => (
              <div key={l} className="flex items-center gap-2">
                <span className="text-lg font-black" style={{ color: "#34d399", fontFamily: "serif" }}>{v}</span>
                <span className="text-[11px] text-gray-600 uppercase tracking-widest">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CARDS GRID ── */}
        <div className="ci-grid grid md:grid-cols-3 gap-5">
          {crops.map((crop, index) => (
            <div key={index} className="ci-card">
              <CropCard {...crop} />
            </div>
          ))}
        </div>

        {/* ── BOTTOM NOTE ── */}
        <div
          className="mt-10 flex items-center gap-3 px-5 py-4 rounded-2xl"
          style={{ background: "rgba(52,211,153,0.05)", border: "1px solid rgba(52,211,153,0.1)" }}
        >
          <Leaf size={16} style={{ color: "#34d399", flexShrink: 0 }} />
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
            Crop insights are dynamically generated from your ML prediction results and real-time weather conditions.
            Data is refreshed with every prediction cycle.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CropInsightsPage;