import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Database,
  Cpu,
  Activity,
  GitBranch,
  TrendingUp,
} from "lucide-react";

/* ── status config ── */
const STATUS_CONFIG = {
  Idle:      { color: "text-gray-400", dot: "bg-gray-500", pulse: false },
  Pending:   { color: "text-yellow-400", dot: "bg-yellow-500", pulse: false },
  Training:  { color: "text-cyan-400", dot: "bg-cyan-400", pulse: true },
  Completed: { color: "text-emerald-400", dot: "bg-emerald-400", pulse: false },
  Failed:    { color: "text-red-400", dot: "bg-red-500", pulse: false },
};

/* ── stat card ── */
function StatCard({ icon: Icon, label, value, sub, accent = "indigo" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-[#0e1219] border border-white/10"
    >
      <div className="flex justify-between mb-3">
        <Icon size={18} className="text-gray-400" />
        <TrendingUp size={12} className="text-white/10" />
      </div>

      <p className="text-xs text-gray-500">{label}</p>
      <div className="text-xl font-bold text-white">{value}</div>

      {sub && <div className="text-xs text-gray-500 mt-2">{sub}</div>}
    </motion.div>
  );
}

export default function DatasetStats({ rows = [], training = {} }) {

  // ================= STATUS LOGIC =================
const uiStatus = useMemo(() => {

  if (!training) return "Idle";

  // ✅ REAL STATES
  if (training.status === "Training") return "Training";
  if (training.status === "Failed") return "Failed";

  // ✅ DATA CHANGED → Pending
  if (training.dataset_changed) return "Pending";

  // ✅ COMPLETED MODEL
  if (training.status === "Completed") return "Completed";

  // ✅ INITIAL STATE (no training yet)
  if (!training.last_trained) return "Idle";

  // fallback
  return "Idle";

}, [training]);

  const statusCfg = STATUS_CONFIG[uiStatus];

  // ================= VALUES =================
  const totalRows = rows.length || 0;
  const accuracy =
    uiStatus === "Completed" ? training?.accuracy || 0 : "--";

  // ================= UI =================
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

      {/* TOTAL ROWS */}
      <StatCard
        icon={Database}
        label="Total Rows"
        value={totalRows}
        sub="Dataset records"
      />

      {/* ACCURACY */}
      <StatCard
        icon={Activity}
        label="Model Accuracy"
        value={
          uiStatus === "Completed" ? `${accuracy}%` : "--"
        }
        sub={
          uiStatus === "Completed"
            ? "Validation score"
            : "Not trained"
        }
      />

      {/* STATUS */}
      <StatCard
        icon={Cpu}
        label="Training Status"
        value={
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${statusCfg.dot}`} />
            <span className={statusCfg.color}>{uiStatus}</span>
          </div>
        }
        sub={
          uiStatus === "Training" ? (
            <div className="mt-2">
              <div className="text-xs text-cyan-400 mb-1">
                {training?.progress || 0}%
              </div>
              <div className="w-full h-2 bg-gray-800 rounded">
                <div
                  className="h-2 bg-cyan-400 rounded"
                  style={{ width: `${training?.progress || 0}%` }}
                />
              </div>
            </div>
          ) : uiStatus === "Completed"
          ? "Training completed"
          : uiStatus === "Pending"
          ? "Dataset changed - retrain required"
          : uiStatus === "Failed"
          ? "Training failed"
          : "Model not trained - Waiting for training"
        }
      />

      {/* MODEL */}
      <StatCard
        icon={GitBranch}
        label="Model Type"
        value="RandomForest"
        sub="ML Classifier"
      />

    </div>
  );
}