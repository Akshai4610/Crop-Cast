import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import HistoryToolbar from "./HistoryToolbar";
import HistoryAnalytics from "./HistoryAnalytics";
import HistoryHeatmap from "./HistoryHeatmap";
import HistoryViewModal from "./HistoryViewModal";
import DeleteHistoryModal from "../../common/DeleteHistoryModal";
import Toast from "../../common/Toast";

import {
  getPredictionHistory,
  deletePredictionHistory,
  checkPremium,
} from "../../../services/api";

const PredictionHistory = () => {
  const email = localStorage.getItem("username");

  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [isPremium, setIsPremium] = useState(false);
  const [toast, setToast] = useState(null); // toast message
  const [range, setRange] = useState("selcted history"); // default to one-by-one

  // 🔐 PREMIUM UI
  const [ui, setUI] = useState({
    getGradientBorder: () => "",
    cardBase: "bg-slate-800 rounded-xl p-4",
    getGlowStyle: () => ({}),
    pulseAnimation: {},
    historyCardMotionProps: {},
    historyBarProps: () => ({})
  });

  const [getEmoji, setGetEmoji] = useState(() => () => "🌱");
  const [getGlow, setGetGlow] = useState(() => () => ({
    glow: "rgba(16,185,129,0.3)",
    border: "from-emerald-400 to-cyan-400",
    intensity: 0.5,
  }));

  useEffect(() => {
    const init = async () => {
      try {
        const premium = await checkPremium();
        setIsPremium(premium);

        const mods = import.meta.glob('../../../utils/*.js');

        if (mods['../../../utils/cropGlow.js']) {
          try { const m = await mods['../../../utils/cropGlow.js'](); if (m.getCropGlow) setGetGlow(() => m.getCropGlow); } catch(e){}
        }

        if (premium) {
          if (mods['../../../utils/croeX.js']) {
            try { const m = await mods['../../../utils/croeX.js'](); if (m.getCropEmoji) setGetEmoji(() => m.getCropEmoji); } catch(e){}
          }
          if (mods['../../../utils/uiEngine.js']) {
            try {
              const m = await mods['../../../utils/uiEngine.js']();
              if (m.getGradientBorder) {
                setUI({
                  getGradientBorder: m.getGradientBorder,
                  cardBase: m.cardBase,
                  getGlowStyle: m.getGlowStyle,
                  pulseAnimation: m.pulseAnimation,
                  historyCardMotionProps: m.historyCardMotionProps || {},
                  historyBarProps: m.historyBarProps || (() => ({}))
                });
              }
            } catch(e) {}
          }
        }
      } catch (err) {
        console.error("Init error:", err);
      }
    };
    init();
  }, []);

  // Fetch history whenever selectedDate changes
  useEffect(() => {
    fetchHistory();
  }, [selectedDate]);

const fetchHistory = async () => {
  try {
    if (!email) {
      console.warn("❌ No email found");
      setHistory([]);
      return;
    }

    const data = await getPredictionHistory(email, "all");

    // ✅ DIRECT SET (since API already normalized)
    let filtered = data;

    if (selectedDate) {
      filtered = data.filter(
        (item) =>
          new Date(item.timestamp).toISOString().slice(0, 10) === selectedDate
      );
    }

    setHistory(filtered);

  } catch (err) {
    console.error(err);
    setHistory([]);
  }
};

  // ✅ DELETE HANDLER
  const handleDelete = async (range) => {
    if (!range) {
      setToast({ type: "error", message: "Please select a time range!" });
      return;
    }

    try {
      await deletePredictionHistory(email, range);
      setToast({ type: "success", message: "History deleted successfully!" });
      setDeleteOpen(false); // close modal automatically
      fetchHistory(); // refresh list
    } catch (err) {
      console.error(err);
      setToast({ type: "error", message: "Failed to delete history!" });
    }
  };

  return (
    <div className="space-y-8">
      {/* TOAST */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* TOOLBAR */}
      <HistoryToolbar
        onFilter={setSelectedDate}
        historyData={history}
        onDelete={async (payload) => {
          await deletePredictionHistory(email, payload);
          fetchHistory();
        }}
      />

      {/* HISTORY GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {history.map((item, i) => {
          const percent = (item.confidence * 100).toFixed(1);
          const glowData = getGlow(item.predicted_crop, item.confidence);

          return (
            <motion.div
              key={i}
              {...(isPremium ? ui.historyCardMotionProps : {})}
              className="relative group"
            >
              {isPremium && (
                <div className={ui.getGradientBorder(glowData.border)} />
              )}

              <motion.div
                {...(isPremium ? ui.pulseAnimation : {})}
                style={ui.getGlowStyle(glowData)}
                className={ui.cardBase}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-4xl">
                    {getEmoji(item.predicted_crop)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-white capitalize">
                  {item.predicted_crop}
                </h3>

                <p className="text-sm text-gray-400 mt-1">{percent}%</p>

                <div className="w-full h-2 bg-slate-700 rounded mt-3 mb-4 overflow-hidden">
                  <motion.div
                    {...(isPremium ? ui.historyBarProps(percent) : { style: { width: `${percent}%` } })}
                    className={`h-full bg-gradient-to-r ${glowData.border}`}
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </span>
                  <button
                    onClick={() => setSelected(item)}
                    className="text-xs px-3 py-1 bg-white/10 rounded hover:bg-white/20 text-white transition"
                  >
                    View
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* ANALYTICS */}
      <HistoryAnalytics data={history} />

      {/* HEATMAP */}
      <HistoryHeatmap data={history} />

      {/* MODALS */}
      {selected && (
        <HistoryViewModal data={selected} onClose={() => setSelected(null)} />
      )}

      {deleteOpen && (
        <DeleteHistoryModal
          range={range}
          historyData={history}
          onConfirm={async (payload) => {
            await deletePredictionHistory(email, payload);
            fetchHistory();
          }}
          onClose={() => setDeleteOpen(false)}
        />
      )}
    </div>
  );
};

export default PredictionHistory;
