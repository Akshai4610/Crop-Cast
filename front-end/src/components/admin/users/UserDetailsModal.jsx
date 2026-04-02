import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  MapPin,
  Phone,
  Calendar,
  Shield,
  ShieldOff,
  BarChart2,
} from "lucide-react";
import { getProfile, getPredictionHistory } from "../../../services/api";

export default function UserDetailsModal({ open, user, onClose }) {
  const [profile, setProfile] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =====================================================
     🔒 LOCK BODY SCROLL WHEN MODAL OPEN
  ===================================================== */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* =====================================================
     📡 FETCH USER PROFILE + ACTIVITY
  ===================================================== */
  useEffect(() => {
    if (!user?.email || !open) return;

    let isMounted = true; // prevent state update after unmount

    const load = async () => {
      setLoading(true);
      try {
        const data = await getProfile(user.email);
        if (isMounted) setProfile(data);

        const history = await getPredictionHistory(user.email);
        const last7 = history?.slice(0, 7).reverse() || [];

        if (isMounted) {
          setActivity(
            last7.map((item) => ({
              day: new Date(item.timestamp).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              value: Math.min(Math.max(item.confidence || 1, 1), 16),
            }))
          );
        }
      } catch (err) {
        console.error("Modal load error", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [user?.email, open]);

  /* =====================================================
     ⏱ FORMAT LAST SEEN
  ===================================================== */
  const formatLastSeen = (date) => {
    if (!date) return "Never";

    const diff = (Date.now() - new Date(date)) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;

    return new Date(date).toLocaleDateString();
  };

  const lastSeen = profile?.last_seen;
  const isOnline = lastSeen && Date.now() - new Date(lastSeen).getTime() < 60000; // 1 min threshold

  /* =====================================================
     🖼 PROFILE IMAGE RESOLVER
  ===================================================== */
  const seed = encodeURIComponent(user?.fullname || "User");
  const fallback = `https://api.dicebear.com/7.x/initials/svg?seed=${seed}`;

  const profileImage = (() => {
    const pic = profile?.profile_pic;
    if (!pic) return fallback;
    if (pic.startsWith("data:image")) return pic;
    if (!pic.startsWith("http")) return `data:image/jpeg;base64,${pic}`;
    return pic;
  })();

  /* =====================================================
     ⚙️ DERIVED VALUES
  ===================================================== */
  const isBlocked = !!user?.blocked;
  const maxVal = activity.length > 0 ? Math.max(...activity.map((a) => a.value), 1) : 1;

  /* =====================================================
     🚀 MODAL RENDER (PORTAL)
  ===================================================== */
  return createPortal(
    <AnimatePresence>
      {open && user && (
        <motion.div
          key="modal-overlay"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {/* 🌫 BACKDROP */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />

          {/* 🧊 MODAL */}
          <motion.div
            className="relative z-10 w-full max-w-md flex flex-col rounded-2xl overflow-hidden bg-gradient-to-b from-[#131720] to-[#0d1117] border border-white/[0.07] shadow-[0_32px_80px_rgba(0,0,0,0.75)]"
            style={{ maxHeight: "min(90vh, 640px)" }}
            initial={{ scale: 0.93, opacity: 0, y: 28 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 28 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            {/* ═════ HEADER ═════ */}
            <div className="relative flex-shrink-0 bg-gradient-to-br from-[#1c2740] via-[#161e30] to-[#111827] border-b border-white/[0.06]">
              {/* Accent line */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-cyan-500 opacity-80" />
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-3.5 right-3.5 z-20 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition"
              >
                <X size={15} />
              </button>

              {/* Avatar + Info */}
              <div className="flex items-center gap-4 px-5 py-5 pr-14">
                <div className="relative flex-shrink-0">
                  <div
                    className={`rounded-full p-[2.5px] ${
                      isBlocked
                        ? "bg-gradient-to-br from-red-500 to-red-700"
                        : "bg-gradient-to-br from-indigo-500 to-cyan-400"
                    }`}
                  >
                    <img
                      src={profileImage}
                      onError={(e) => (e.target.src = fallback)}
                      alt={user.fullname}
                      className="w-[58px] h-[58px] rounded-full object-cover bg-gray-800"
                      style={{ border: "2.5px solid #0d1117" }}
                    />
                  </div>

                  {/* Status Dot */}
                  <span
                    className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-[#0d1117] ${
                      isBlocked ? "bg-red-500" : "bg-emerald-500"
                    }`}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-white font-semibold text-base truncate">
                    {profile?.fullname || user.fullname || "—"}
                  </h2>
                  <p className="text-gray-500 text-xs truncate">{user.email}</p>

                  {/* Status + Last Seen */}
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-[3px] rounded-full text-[11px] ${
                        isBlocked
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {isBlocked ? <ShieldOff size={10} /> : <Shield size={10} />}
                      {isBlocked ? "Blocked" : "Active"}
                    </span>

                    {!isBlocked && (
                      <span className="text-[11px] text-gray-400">
                        {isOnline ? (
                          <span className="text-emerald-400 font-medium">● Active now</span>
                        ) : (
                          <>Last seen {formatLastSeen(lastSeen)}</>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ═════ BODY ═════ */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-5 py-5 space-y-5">
                {/* INFO GRID */}
                <div className="grid grid-cols-2 gap-2.5">
                  <InfoCard
                    icon={<MapPin size={12} />}
                    label="Location"
                    value={profile?.location}
                  />
                  <InfoCard
                    icon={<Phone size={12} />}
                    label="Phone"
                    value={profile?.phone}
                  />
                  <InfoCard
                    icon={<Calendar size={12} />}
                    label="Age"
                    value={profile?.age ? `${profile.age} yrs` : null}
                  />
                  <InfoCard
                    icon={<BarChart2 size={12} />}
                    label="Predictions"
                    value={activity.length ? `${activity.length} recent` : null}
                  />
                </div>

                {/* ACTIVITY */}
                <div>
                  {loading ? (
                    <div className="flex justify-center h-24 items-center">
                      <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : activity.length > 0 ? (
                    <div className="flex items-end gap-1.5 h-20">
                      {activity.map((item, i) => {
                        const pct = Math.max((item.value / maxVal) * 100, 8);
                        return (
                          <motion.div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-sm"
                            initial={{ height: 0 }}
                            animate={{ height: `${pct}%` }}
                          />
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-600 text-center">No activity</p>
                  )}
                </div>
              </div>
            </div>

            {/* ═════ FOOTER ═════ */}
            <div className="p-4 border-t border-white/[0.05]">
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* =====================================================
   🧩 REUSABLE INFO CARD
===================================================== */
function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-xl px-3.5 py-3 bg-white/[0.03] border border-white/[0.06]">
      <div className="flex items-center gap-1.5 mb-1.5">
        <span className="text-indigo-500">{icon}</span>
        <span className="text-[10px] text-gray-500 uppercase">{label}</span>
      </div>
      <p className="text-sm text-gray-200 truncate">{value || "Not provided"}</p>
    </div>
  );
}