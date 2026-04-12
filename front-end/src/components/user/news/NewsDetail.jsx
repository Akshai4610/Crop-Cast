
/* ═══════════════════════════════════════════════════════
   NewsDetail.jsx — Premium redesign, ALL logic unchanged
═══════════════════════════════════════════════════════ */
import { useEffect as useEffectND, useState as useStateND } from "react";
import { createPortal } from "react-dom";
import { motion as motionND, AnimatePresence as APND } from "framer-motion";
import { X, Send as SendND, Trash2, MessageCircle, Calendar } from "lucide-react";
import { addComment, getComments, deleteComment } from "../../../services/api";

export function NewsDetail({ selected, onClose }) {
  const [comment,  setComment]  = useStateND("");
  const [comments, setComments] = useStateND([]);
  const email = localStorage.getItem("username");

  /* Logic unchanged */
  useEffectND(() => {
    if (selected?._id) loadComments();
  }, [selected]);

  const loadComments = async () => {
    const data = await getComments(selected._id);
    setComments(data);
  };

  const handleAddComment = async () => {
    if (!comment.trim()) return;
    await addComment(selected._id, comment);
    setComment("");
    loadComments();
  };

  const handleDelete = async (text) => {
    await deleteComment(selected._id, text);
    loadComments();
  };

  if (!selected) return null;

  return createPortal(
    <APND>
      {selected && (
        <motionND.div
          key="nd-overlay"
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

          <motionND.div
            className="relative z-10 w-full max-w-2xl flex flex-col rounded-2xl overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #061009, #040c06)",
              border: "1px solid rgba(52,211,153,0.12)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.7)",
              maxHeight: "90vh",
            }}
            initial={{ scale: 0.93, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 24 }}
            transition={{ type: "spring", stiffness: 340, damping: 30 }}
          >
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 hover:bg-white/10 text-gray-600 hover:text-white transition-all"
            >
              <X size={14} />
            </button>

            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#1f2937 transparent" }}>

              {/* Image — logic unchanged */}
              {selected.image && (
                <div className="relative h-52 flex-shrink-0">
                  <img src={selected.image} className="w-full h-full object-cover" alt={selected.title} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(4,12,6,1) 0%, transparent 50%)" }} />
                </div>
              )}

              <div className="px-6 py-6 space-y-4">

                {/* Date — logic unchanged */}
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
                  <Calendar size={11} />
                  {new Date(selected.created_at).toDateString()}
                </div>

                {/* Title — logic unchanged */}
                <h1 className="text-xl sm:text-2xl font-black text-white leading-tight" style={{ fontFamily: "serif", letterSpacing: "-0.02em" }}>
                  {selected.title}
                </h1>

                {/* Content — logic unchanged: all style props preserved */}
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    fontFamily:  selected.fontFamily,
                    textAlign:   selected.textAlign,
                    fontSize:    selected.fontSize,
                    fontWeight:  selected.fontWeight,
                    color:       selected.color || "rgba(255,255,255,0.6)",
                  }}
                >
                  {selected.content}
                </p>

                {/* ── COMMENTS ── */}
                <div>
                  <div className="flex items-center gap-1.5 mb-4">
                    <MessageCircle size={13} style={{ color: "#34d399" }} />
                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
                      Comments ({comments.length})
                    </span>
                  </div>

                  {/* Comment list — logic unchanged */}
                  <div className="space-y-2 mb-4 max-h-44 overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                    {comments.map((c, i) => (
                      <div
                        key={i}
                        className="flex items-start justify-between gap-3 px-3.5 py-2.5 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                      >
                        <div className="min-w-0">
                          <span className="text-[11px] font-bold" style={{ color: "#34d399" }}>{c.user}</span>
                          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{c.text}</p>
                        </div>
                        {/* Delete own comment — logic unchanged */}
                        {c.user === email && (
                          <button
                            onClick={() => handleDelete(c.text)}
                            className="flex-shrink-0 text-red-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Add comment — logic unchanged */}
                  <div className="flex gap-2">
                    <input
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                      placeholder="Write a comment..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl text-sm text-white outline-none transition-all duration-200"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                      onFocus={(e) => { e.target.style.borderColor = "rgba(52,211,153,0.4)"; }}
                      onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                    />
                    <button
                      onClick={handleAddComment}
                      className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200 active:scale-[0.97]"
                      style={{ background: "linear-gradient(135deg, #059669, #34d399)", boxShadow: "0 4px 14px rgba(52,211,153,0.25)" }}
                    >
                      <SendND size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motionND.div>
        </motionND.div>
      )}
    </APND>,
    document.body
  );
}

export default NewsDetail;