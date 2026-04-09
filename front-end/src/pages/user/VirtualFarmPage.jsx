/* ═══════════════════════════════════════════════
   PREMIUM VIRTUAL FARM BUILDER (LOGGED-IN)
   File: src/pages/user/VirtualFarmPage.jsx
   -------------------------------------------------
   ✔ Interactive 4x4 Grid
   ✔ Weather-Driven Growth Simulation
   ✔ Real-Time Kochi Weather Integration
   ✔ High-End Visuals & Animations (FIXED ALIGNMENT ✅)
   ═══════════════════════════════════════════════ */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CloudRain, Sun, Thermometer, Droplets, 
  Sprout, Leaf, Flower, Harvest, Trash2, Info, Award
} from "lucide-react";
import { getKochiWeather } from "../../services/api";

// ── SIMULATION CONFIG ─────────
const GROWTH_SPEED = 2000; 
const MAX_GROWTH = 100;

const CROP_TEMPLATES = [
  { name: "Rice",   icon: "🍚", idealTemp: [20, 35], idealHum: [70, 95] },
  { name: "Maize",  icon: "🌽", idealTemp: [18, 30], idealHum: [50, 80] },
  { name: "Coffee", icon: "☕", idealTemp: [15, 25], idealHum: [60, 90] },
  { name: "Mango",  icon: "🥭", idealTemp: [24, 38], idealHum: [40, 70] },
  { name: "Apple",  icon: "🍎", idealTemp: [10, 24], idealHum: [50, 75] },
];

export default function VirtualFarmPage() {
  const [weather, setWeather] = useState(null);
  const [grid, setGrid]       = useState(Array(16).fill(null));
  const [selected, setSelected] = useState(CROP_TEMPLATES[0]);
  const [logs, setLogs]       = useState([]);

  // ── 🔗 LOAD WEATHER ──
  useEffect(() => {
    const loadData = async () => {
      try {
        const w = await getKochiWeather();
        setWeather(w);
      } catch (err) { console.error("Weather sync failed:", err); }
    };
    loadData();
    const interval = setInterval(loadData, 30000); 
    return () => clearInterval(interval);
  }, []);

  // ── ⚙️ SIMULATION TICK ──
  useEffect(() => {
    if (!weather) return;

    const tick = setInterval(() => {
      setGrid(prevGrid => {
        return prevGrid.map(tile => {
          if (!tile) return null;

          const tempOk = weather.temperature >= tile.crop.idealTemp[0] && weather.temperature <= tile.crop.idealTemp[1];
          const humOk  = (weather.humidity || 75) >= tile.crop.idealHum[0] && (weather.humidity || 75) <= tile.crop.idealHum[1];

          let growthInc = 0;
          let healthDec = 0;

          if (tempOk && humOk) {
            growthInc = 5; 
            healthDec = -2; 
          } else {
            growthInc = 1; 
            healthDec = 5; 
          }

          const newGrowth = Math.min(MAX_GROWTH, tile.growth + growthInc);
          const newHealth = Math.min(100, Math.max(0, tile.health - healthDec));

          let stage = 0; 
          if (newGrowth > 30) stage = 1; 
          if (newGrowth > 70) stage = 2; 
          if (newGrowth >= 100) stage = 3; 

          return { ...tile, growth: newGrowth, health: newHealth, stage };
        });
      });
    }, GROWTH_SPEED);

    return () => clearInterval(tick);
  }, [weather]);

  const plant = (idx) => {
    if (grid[idx]) return; 
    const newGrid = [...grid];
    newGrid[idx] = {
      crop: selected,
      growth: 0,
      health: 100,
      stage: 0,
      plantedAt: new Date()
    };
    setGrid(newGrid);
    addLog(`🌿 Planted ${selected.name} in tile #${idx + 1}`);
  };

  const remove = (idx, e) => {
    e.stopPropagation();
    const newGrid = [...grid];
    newGrid[idx] = null;
    setGrid(newGrid);
  };

  const addLog = (msg) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  return (
    <div className="min-h-screen bg-[#020804] text-white p-6 sm:p-8">
      
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-2">Simulation Engine · V1.0</p>
          <h1 className="text-4xl font-black" style={{ fontFamily: "serif" }}>Virtual Farm <span className="text-emerald-400">Builder</span></h1>
        </div>
        
        <div className="glass-card px-6 py-3 flex items-center gap-6 border-emerald-500/20 bg-white/5 backdrop-blur-xl rounded-2xl border">
          <div className="flex items-center gap-2">
            <Thermometer size={16} className="text-orange-400" />
            <span className="text-sm font-bold">{weather?.temperature || "--"}°C</span>
          </div>
          <div className="flex items-center gap-2 border-l border-white/10 pl-6">
            <Droplets size={16} className="text-blue-400" />
            <span className="text-sm font-bold">{weather?.humidity || 75}%</span>
          </div>
          <div className="flex items-center gap-2 border-l border-white/10 pl-6">
            <CloudRain size={16} className="text-emerald-400" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400/60">Live Kochi Sync</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* ── CROP SELECTOR ─────────────── */}
        <div className="space-y-6">
          <div className="glass-card p-6 bg-white/5 border border-white/10 rounded-3xl">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
              <Leaf size={14} /> Select Seeds
            </h3>
            <div className="space-y-2">
              {CROP_TEMPLATES.map(c => (
                <button
                  key={c.name}
                  onClick={() => setSelected(c)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                    selected.name === c.name 
                      ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" 
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{c.icon}</span>
                    <span className="text-sm font-medium">{c.name}</span>
                  </div>
                  {selected.name === c.name && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
             <div className="flex items-center gap-2 text-emerald-400 mb-3">
               <Info size={16} />
               <h4 className="text-xs font-bold uppercase">Ideal Conditions</h4>
             </div>
             <p className="text-[11px] text-gray-400 leading-relaxed">
               {selected.name} grows best when the temperature is between <span className="text-white">{selected.idealTemp[0]}-{selected.idealTemp[1]}°C</span> and humidity is <span className="text-white">{selected.idealHum[0]}-{selected.idealHum[1]}%</span>.
             </p>
          </div>
        </div>

        {/* ── FARM GRID ─────────────── */}
        <div className="lg:col-span-2 flex justify-center">
          <div className="aspect-square w-full max-w-[550px] grid grid-cols-4 grid-rows-4 gap-3 bg-[#05120a] p-3 rounded-3xl border border-white/5 shadow-2xl relative">
            
            {/* Ground Grid lines (subtle) */}
            <div className="absolute inset-x-0 inset-y-0 grid grid-cols-4 pointer-events-none opacity-20">
              {Array(4).fill(null).map((_, i) => <div key={i} className="border-r border-emerald-900/50" />)}
            </div>
            <div className="absolute inset-x-0 inset-y-0 grid grid-rows-4 pointer-events-none opacity-20">
              {Array(4).fill(null).map((_, i) => <div key={i} className="border-b border-emerald-900/50" />)}
            </div>

            {grid.map((tile, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: tile ? 0.98 : 1.05 }}
                onClick={() => plant(i)}
                className={`relative aspect-square rounded-2xl border transition-all duration-500 flex items-center justify-center cursor-pointer overflow-hidden group/tile ${
                  tile 
                    ? "bg-[#0a1f13] border-emerald-500/20 shadow-inner" 
                    : "bg-[#040d07] border-white/5 hover:border-emerald-500/40 hover:bg-[#07160c] shadow-lg"
                }`}
              >
                {tile ? (
                  <div className="w-full h-full p-2 flex flex-col items-center justify-center">
                    
                    {/* Health Bar (Floating top) */}
                    <div className="absolute top-2 inset-x-3 h-1 bg-white/5 rounded-full overflow-hidden">
                       <motion.div 
                        animate={{ width: `${tile.health}%`, backgroundColor: tile.health > 50 ? "#10b981" : "#ef4444" }}
                        className="h-full"
                       />
                    </div>

                    {/* Growth Indicator */}
                    <div className="relative mb-1">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={tile.stage}
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-2xl sm:text-4xl"
                        >
                          {tile.stage === 0 && <Sprout className="text-emerald-500/40" size={32} />}
                          {tile.stage === 1 && <Leaf className="text-emerald-400" size={32} />}
                          {tile.stage === 2 && <Flower className="text-yellow-400" size={32} />}
                          {tile.stage === 3 && <span className="drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">{tile.crop.icon}</span>}
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    <p className="text-[9px] font-black uppercase text-emerald-400/80 mb-2 truncate max-w-full px-1">{tile.crop.name}</p>

                    {/* Stage Pill */}
                    <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-emerald-500/40 whitespace-nowrap">
                       {tile.stage === 3 ? "Harvest" : `${tile.growth}%`}
                    </div>

                    {/* Delete overlay */}
                    <button 
                      onClick={(e) => remove(i, e)}
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 opacity-0 group-hover/tile:opacity-100 transition-all scale-75 hover:scale-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="opacity-0 group-hover/tile:opacity-30 transition-all scale-50 group-hover/tile:scale-100">
                    <span className="text-2xl filter grayscale">{selected.icon}</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── LOGS & REWARDS ─────────────── */}
        <div className="space-y-6">
          <div className="glass-card p-6 bg-white/5 border border-white/10 rounded-3xl h-fit">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-4">Farm Activity</h3>
            <div className="space-y-3">
              {logs.length === 0 ? (
                 <p className="text-xs text-gray-600 italic">No activity yet. Plant something!</p>
              ) : (
                logs.map((log, i) => (
                  <motion.div 
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    key={i} 
                    className="flex items-start gap-2 text-[11px] text-gray-400"
                  >
                    <div className="w-1 h-1 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    {log}
                  </motion.div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card p-6 border border-yellow-500/20 bg-yellow-500/5 rounded-3xl">
             <div className="flex items-center gap-2 text-yellow-500 mb-4">
               <Award size={18} />
               <h4 className="text-[10px] font-bold uppercase tracking-widest">Season Challenge</h4>
             </div>
             <p className="text-xs font-medium text-white mb-2">Weather Master ⛈️</p>
             <p className="text-[10px] text-gray-500 leading-relaxed mb-4">
               Harvest 3 Coffee plants while the humidity is above 80% to earn the "High Moisture" badge.
             </p>
             <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
               <div className="w-1/3 h-full bg-yellow-500" />
             </div>
          </div>
        </div>

      </div>

    </div>
  );
}
