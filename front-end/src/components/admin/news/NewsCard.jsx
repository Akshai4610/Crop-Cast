/* ═══════════════════════════════════════════════════════
   NewsCard.jsx — Premium card design
   (referenced by NewsList — import separately)
═══════════════════════════════════════════════════════ */

import { ThumbsUp, ThumbsDown, ArrowUpRight, Clock } from "lucide-react";

export function NewsCard({ n, userEmail, onLike, onDislike, onOpen }) {
  const liked    = n.likes?.includes(userEmail);
  const disliked = n.dislikes?.includes(userEmail);

  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "linear-gradient(145deg, rgba(6,14,9,0.97), rgba(4,10,6,0.98))",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(52,211,153,0.2)";
        e.currentTarget.style.boxShadow   = "0 12px 40px rgba(0,0,0,0.5), 0 0 32px rgba(52,211,153,0.06)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.boxShadow   = "0 4px 24px rgba(0,0,0,0.35)";
      }}
    >
      {/* Image */}
      {n.image && (
        <div className="relative h-44 overflow-hidden">
          <img
            src={n.image}
            alt={n.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(4,10,6,0.9) 0%, transparent 60%)" }} />
          {n.category && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest capitalize"
              style={{ background: "rgba(52,211,153,0.15)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)", backdropFilter: "blur(8px)" }}
            >
              {n.category}
            </span>
          )}
        </div>
      )}

      {/* Body */}
      <div className="flex-1 p-5 flex flex-col gap-3">

        {/* Date */}
        <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
          <Clock size={10} />
          <span className="text-[10px]">{new Date(n.created_at).toDateString()}</span>
        </div>

        {/* Title — logic unchanged: n.title */}
        <h3
          className="font-bold text-white leading-snug line-clamp-2 group-hover:text-emerald-300 transition-colors duration-200"
          style={{ fontSize: "0.95rem", letterSpacing: "-0.01em" }}
        >
          {n.title}
        </h3>

        {/* Excerpt */}
        {n.content && (
          <p className="text-xs leading-relaxed line-clamp-3" style={{ color: "rgba(255,255,255,0.35)" }}>
            {n.content}
          </p>
        )}

        {/* Footer actions — logic unchanged */}
        <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <ReactionBtn
              icon={<ThumbsUp size={12} />}
              count={n.likes?.length || 0}
              active={liked}
              activeColor="#34d399"
              onClick={(e) => { e.stopPropagation(); onLike(n._id); }}
            />
            <ReactionBtn
              icon={<ThumbsDown size={12} />}
              count={n.dislikes?.length || 0}
              active={disliked}
              activeColor="#f87171"
              onClick={(e) => { e.stopPropagation(); onDislike(n._id); }}
            />
          </div>
          <button
            onClick={() => onOpen(n)}
            className="flex items-center gap-1 text-[11px] font-semibold transition-colors duration-200"
            style={{ color: "rgba(52,211,153,0.6)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "#34d399"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(52,211,153,0.6)"; }}
          >
            Read <ArrowUpRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ReactionBtn({ icon, count, active, activeColor, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-all duration-200"
      style={{
        background: active ? `${activeColor}12` : "rgba(255,255,255,0.03)",
        color: active ? activeColor : "rgba(255,255,255,0.3)",
        border: `1px solid ${active ? `${activeColor}25` : "rgba(255,255,255,0.06)"}`,
      }}
    >
      {icon}
      {count}
    </button>
  );
}
