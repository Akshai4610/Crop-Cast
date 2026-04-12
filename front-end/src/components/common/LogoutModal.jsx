/* ═══════════════════════════════════════════════════════
   PREMIUM 3D LOGOUT MODAL
   src/components/common/LogoutModal.jsx
   Logic: Three.js + GSAP + Framer Motion
   UI: High-end persuasive exit experience
   ═══════════════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Heart, Sprout } from "lucide-react";
import { createPortal } from "react-dom";

const LogoutModal = ({ isOpen, onConfirm, onClose }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || !isOpen) return;

    // ── SCENE SETUP ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(300, 300);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // ── THE SEED OF RETURN ──
    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshPhongMaterial({
      color: 0x34d399,
      emissive: 0x065f46,
      specular: 0xffffff,
      shininess: 100,
      flatShading: true,
      transparent: true,
      opacity: 0.8,
    });
    const seed = new THREE.Mesh(geometry, material);
    scene.add(seed);

    // Wireframe Outer Shell
    const wireG = new THREE.IcosahedronGeometry(1.2, 1);
    const wireM = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    });
    const outerShell = new THREE.Mesh(wireG, wireM);
    scene.add(outerShell);

    // ── LIGHTING ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x34d399, 10, 10);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 4;

    // ── GSAP ANIMATIONS ──
    const tl = gsap.timeline();
    
    // Continuous rotation
    gsap.to(seed.rotation, { 
      y: Math.PI * 2, 
      x: Math.PI,
      duration: 10, 
      repeat: -1, 
      ease: "none" 
    });
    gsap.to(outerShell.rotation, { 
      y: -Math.PI * 2, 
      duration: 15, 
      repeat: -1, 
      ease: "none" 
    });

    // Entrance reveal
    tl.fromTo(seed.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 1.2, ease: "elastic.out(1, 0.5)" });
    tl.fromTo(".lm-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: "power3.out" }, "-=0.6");
    tl.fromTo(".lm-btn", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, stagger: 0.1, duration: 0.5, ease: "back.out(1.7)" }, "-=0.4");

    // ── RENDER LOOP ──
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      geometry.dispose();
      material.dispose();
      wireG.dispose();
      wireM.dispose();
      renderer.dispose();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-100000 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(160deg, #071409, #020804)",
            border: "1px solid rgba(52,211,153,0.15)",
            boxShadow: "0 25px 80px rgba(0,0,0,0.9), inset 0 1px 1px rgba(255,255,255,0.05)",
          }}
        >
          {/* Top Decorative Shine */}
          <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/40 to-transparent" />

          <div className="p-10 flex flex-col items-center text-center">
            {/* 3D Visual */}
            <div className="relative w-48 h-48 mb-2">
              <div className="absolute inset-0 bg-emerald-500/10 blur-3xl rounded-full scale-75" />
              <canvas ref={canvasRef} width={300} height={300} className="w-full h-full relative z-10" />
            </div>

            {/* Content Mapping */}
            <div className="space-y-6 max-w-xs mx-auto">
              <div>
                <h3 className="lm-text text-3xl font-black text-white leading-tight mb-2" style={{ fontFamily: "serif" }}>
                  Leaving so<br /><span className="text-emerald-400">soon?</span>
                </h3>
                <p className="lm-text text-sm text-white/40 leading-relaxed font-medium">
                  Your journey with Crop Intelligence is evolving. The fields are safer when you're here.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-4">
                <button
                  onClick={onClose}
                  className="lm-btn group flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-emerald-500 text-black font-black text-sm transition-all hover:bg-emerald-400 active:scale-[0.98] shadow-lg shadow-emerald-500/20"
                >
                  <Heart size={16} className="fill-black/20" />
                  I'll Stay Logged In
                </button>
                
                <button
                  onClick={onConfirm}
                  className="lm-btn group flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white/60 font-bold text-sm hover:bg-white/10 hover:text-white transition-all"
                >
                  <LogOut size={16} opacity={0.5} />
                  Safe Logout
                </button>
              </div>

              {/* Bottom Quote */}
              <div className="lm-text flex items-center justify-center gap-2 text-[9px] uppercase tracking-[0.2em] font-black text-emerald-500/50 pt-4">
                <Sprout size={12} />
                Elevating your harvest
              </div>
            </div>
          </div>
          
          {/* Corner Glows */}
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-500/5 blur-[100px] rounded-full" />
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/5 blur-[100px] rounded-full" />
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default LogoutModal;
