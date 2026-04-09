/* ═══════════════════════════════════════════════════════
   NewsPage.jsx — Premium redesign, ALL logic unchanged
   File: src/pages/user/NewsPage.jsx
═══════════════════════════════════════════════════════ */
import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { getNews, likeNews, dislikeNews } from "../../services/api";
import NewsList  from "../../components/user/news/NewsList";
import NewsDetail from "../../components/user/news/NewsDetail";
import { Newspaper, Filter } from "lucide-react";

const CATEGORIES = [
  { id: "",        label: "All News" },
  { id: "crop",    label: "Crops"    },
  { id: "weather", label: "Weather"  },
  { id: "general", label: "General"  },
];

const NewsPage = () => {
  /* ── Logic unchanged ── */
  const [news,     setNews]     = useState([]);
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState(null);
  const userEmail = localStorage.getItem("username");
  const pageRef   = useRef(null);

  const fetchNews = async () => {
    const data = await getNews(category);
    setNews(data);
  };

  useEffect(() => { fetchNews(); }, [category]);

  /* Optimistic updates to avoid refresh lag */
  const handleLike = (id) => {
    setNews((prev) => prev.map((n) => {
      if (n._id === id) {
        const hasLiked = n.likedBy?.includes(userEmail);
        const newLikedBy = hasLiked ? n.likedBy.filter(e => e !== userEmail) : [...(n.likedBy || []), userEmail];
        const newDislikedBy = n.dislikedBy?.filter(e => e !== userEmail) || [];
        return { ...n, likedBy: newLikedBy, dislikedBy: newDislikedBy, likes: newLikedBy.length, dislikes: newDislikedBy.length };
      }
      return n;
    }));
    likeNews(id).catch(console.error);
  };

  const handleDislike = (id) => {
    setNews((prev) => prev.map((n) => {
      if (n._id === id) {
        const hasDisliked = n.dislikedBy?.includes(userEmail);
        const newDislikedBy = hasDisliked ? n.dislikedBy.filter(e => e !== userEmail) : [...(n.dislikedBy || []), userEmail];
        const newLikedBy = n.likedBy?.filter(e => e !== userEmail) || [];
        return { ...n, likedBy: newLikedBy, dislikedBy: newDislikedBy, likes: newLikedBy.length, dislikes: newDislikedBy.length };
      }
      return n;
    }));
    dislikeNews(id).catch(console.error);
  };

  /* GSAP entrance */
  useEffect(() => {
    if (!pageRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".np-header", { y: -24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" });
      gsap.fromTo(".np-filter", { y: 16, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.07, duration: 0.4, ease: "power2.out", delay: 0.2 });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={pageRef} className="min-h-screen px-4 sm:px-6 py-8">

      {/* ── HEADER ── */}
      <div className="np-header flex items-start justify-between gap-4 mb-7 flex-wrap">
        <div>
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded-full"
            style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)" }}>
            <Newspaper size={11} style={{ color: "#34d399" }} />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-500">Agri Feed</span>
          </div>
          <h1 className="text-3xl font-black text-white" style={{ fontFamily: "serif", letterSpacing: "-0.02em" }}>
            Latest <span style={{ color: "#34d399" }}>News</span>
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-600">
          <Filter size={12} />
          <span>{news.length} articles</span>
        </div>
      </div>

      {/* ── FILTERS — logic unchanged ── */}
      <div className="flex flex-wrap gap-2 mb-7">
        {CATEGORIES.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setCategory(id)}
            className="np-filter px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
            style={{
              background: category === id ? "linear-gradient(135deg, #059669, #34d399)" : "rgba(255,255,255,0.04)",
              color: category === id ? "#fff" : "rgba(255,255,255,0.45)",
              border: `1px solid ${category === id ? "transparent" : "rgba(255,255,255,0.07)"}`,
              boxShadow: category === id ? "0 4px 14px rgba(52,211,153,0.25)" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── NEWS LIST — logic unchanged ── */}
      <NewsList
        news={news}
        userEmail={userEmail}
        onLike={handleLike}
        onDislike={handleDislike}
        onOpen={setSelected}
      />

      {/* ── NEWS DETAIL — logic unchanged ── */}
      <NewsDetail selected={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export { NewsPage };
export default NewsPage;