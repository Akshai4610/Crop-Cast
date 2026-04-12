/* ═══════════════════════════════════════════════
   PREMIUM LOCKED MODAL (UPSALE)
   File: src/components/common/PremiumLockedModal.jsx
   -------------------------------------------------
   ✔ Premium Glassmorphic Design
   ✔ GSAP Entrance Animations
   ✔ Upsell Messaging for Virtual Farm & 3D
   ═══════════════════════════════════════════════ */

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Crown, Check, X, ArrowRight, Zap, Box } from "lucide-react";
import { gsap } from "gsap";

export default function PremiumLockedModal({ isOpen, onClose }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(modalRef.current,
        { scale: 0.9, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-[#010502]/80 backdrop-blur-md">
      {/* Background Glow */}
      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

      <motion.div
        ref={modalRef}
        className="relative w-full max-w-lg bg-[#051008] rounded-3xl border border-emerald-500/20 shadow-[0_24px_80px_rgba(0,0,0,0.6)] overflow-hidden"
      >
        {/* Top Header Decor */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-white/60"
        >
          <X size={18} />
        </button>

        <div className="p-8 sm:p-10 text-center">
          
          {/* Lock Icon Bloom */}
          <div className="relative w-20 h-20 mx-auto mb-8">
             <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
             <div className="relative w-full h-full rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Lock className="text-emerald-400" size={32} />
             </div>
             <div className="absolute -top-1 -right-1 p-1.5 rounded-full bg-yellow-500 text-black shadow-lg">
                <Crown size={12} strokeWidth={3} />
             </div>
          </div>

          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400/60 mb-3">
             Premium Access Required
          </p>
          <h2 className="text-3xl font-black mb-6 leading-tight" style={{ fontFamily: "serif" }}>
             Unlock Your <span className="text-emerald-400">Digital Farm.</span>
          </h2>
          
          <div className="space-y-4 mb-10 text-left">
             <FeatureItem 
               icon={<Zap size={14} className="text-yellow-400" />} 
               title="Interactive Virtual Farm" 
               desc="Plant, grow, and simulate real-time weather impacts." 
             />
             <FeatureItem 
               icon={<Box size={14} className="text-blue-400" />} 
               title="3D Crop Intelligence" 
               desc="Explore predictions in a beautiful 3D interactive scene." 
             />
             <FeatureItem 
               icon={<Crown size={14} className="text-emerald-400" />} 
               title="Advanced AI Insights" 
               desc="Get deeper, personalized data for every harvest." 
             />
          </div>

          <div className="flex flex-col gap-3">
             <button className="w-full py-4 rounded-2xl bg-emerald-500 text-black font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all shadow-[0_8px_32px_rgba(16,185,129,0.25)] flex items-center justify-center gap-2 group">
                Upgrade to Premium <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
             <button 
              onClick={onClose}
              className="w-full py-3 rounded-2xl text-[10px] uppercase font-bold tracking-widest text-white/30 hover:text-white transition-colors"
             >
                Maybe later
             </button>
          </div>

        </div>
      </motion.div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/5">
       <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0">
          {icon}
       </div>
       <div>
          <h4 className="text-sm font-bold text-white mb-0.5">{title}</h4>
          <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
       </div>
       <div className="ml-auto flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <Check size={10} className="text-emerald-400" />
       </div>
    </div>
  );
}
