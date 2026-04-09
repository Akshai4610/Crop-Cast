
/* ═══════════════════════════════════════
   DashBoardPage.jsx
   Logic: 100% unchanged
═══════════════════════════════════════ */
// DashBoardPage.jsx

import { useEffect, useRef, useState } from "react";

import PredictionPanel from "../../components/user/dashboard/PredictionPanel";
import WeatherForm   from "../../components/user/dashboard/WeatherForm";
import WeatherWidget from "../../components/common/WeatherWidget";
import { PremiumWelcomeModal } from "../../utils/premiumWelcome";
import { predictCrop, checkPremium } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";

export function DashBoardPage() {
  const [loadingD, setLoadingD] = useState(false);
  const [crop,     setCropsD]   = useState([]);
  const [confid,   setConfidD]  = useState(0);
  const [top3D,    setTop3D]    = useState([]);
  const [inputD,   setInputD]   = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);
  const [userName,    setUserName]    = useState("");

  /* ── Premium Welcome Logic (Refactored to Utils) ── */
  useEffect(() => {
    const runWelcomeCheck = async () => {
      try {
        console.log("💎 Checking premium status...");
        const isPremiumData = await checkPremium();
        const shown = sessionStorage.getItem("welcomeShown");
        
        console.log("💎 Status:", { isPremiumData, shown });

        if (isPremiumData === true && !shown) { 
          const name = localStorage.getItem("fullname") || localStorage.getItem("username") || "Exclusive Member";
          console.log("💎 Triggering welcome for:", name);
          setUserName(name);
          setShowWelcome(true);
        }
      } catch (err) {
        console.error("Welcome logic failed", err);
      }
    };
    runWelcomeCheck();
  }, []);


  /* Logic unchanged */
  const handlePredict = async (formData) => {
    try {
      setLoadingD(true);
      setInputD(formData);
      const res = await predictCrop(formData);
      if (!res || !res.top_3) { alert("Invalid prediction response"); return; }
      setCropsD(res.top_3.map((x) => x.crop));
      setConfidD(res.confidence || 0);
      setTop3D(res.top_3 || []);
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Prediction failed");
    } finally {
      setLoadingD(false);
    }
  };

  const isPremiumTheme = userName !== "" && showWelcome === false;

  return (
    <div
      className={`min-h-screen p-4 sm:p-6 transition-colors duration-700 ${showWelcome ? "overflow-hidden" : ""}`}
      style={isPremiumTheme ? { background: "linear-gradient(160deg, #051008, #020804)", color: "#ffffff" } : { background: "#f8fafc", color: "#0f172a" }}
    >
      <AnimatePresence>
        {showWelcome && (
          <PremiumWelcomeModal
            name={userName}
            onComplete={() => {
              setShowWelcome(false);
              sessionStorage.setItem("welcomeShown", "true");
            }}
          />
        )}
      </AnimatePresence>

      {/* Page title */}
      <div className="mb-8 relative z-10 text-center sm:text-left transition-all duration-500">
        <p className={`text-[10px] font-bold uppercase tracking-[0.25em] mb-2 opacity-80 ${isPremiumTheme ? "text-emerald-400" : "text-emerald-600"}`}>
          {isPremiumTheme ? "Premium Experience" : "Dashboard"}
        </p>
        <h1 className={`text-3xl sm:text-5xl font-black transition-colors duration-500 ${isPremiumTheme ? "text-white" : "text-slate-900"}`} style={{ fontFamily: "serif", letterSpacing: "-0.04em" }}>
          {isPremiumTheme ? "Crop Intelligence" : "Crop Prediction"}
        </h1>
      </div>

      {/* Main grid — logic unchanged */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <WeatherForm onPredict={handlePredict} loading={loadingD} />
        <PredictionPanel
          crops={crop}
          confidence={confid}
          top3={top3D}
          loading={loadingD}
          inputData={inputD}
        />
      </div>

      {/* Weather widget — logic unchanged */}
      <motion.div drag dragMomentum={false} className="mt-5 max-w-sm cursor-grab active:cursor-grabbing w-fit relative z-50">
        <WeatherWidget />
      </motion.div>
    </div>
  );
}

export default DashBoardPage;