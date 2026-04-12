/* ═══════════════════════════════════════════════════════
   NewsList.jsx — Logic unchanged
═══════════════════════════════════════════════════════ */
import { useEffect as useEffectNL, useRef as useRefNL } from "react";
import { gsap as gsapNL } from "gsap";

import { Newspaper } from "lucide-react";
import NewsCard from "./NewsCard";

export function NewsList({ news, userEmail, onLike, onDislike, onOpen }) {
  const gridRef = useRefNL(null);

  // Derive a string of IDs to watch for structural changes (not likes)
  const newsIds = news.map((n) => n._id).join(",");

  useEffectNL(() => {
    if (!gridRef.current || news.length === 0) return;
    gsapNL.fromTo(
      gridRef.current.querySelectorAll(".nl-card"),
      { y: 32, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.08, duration: 0.5, ease: "power2.out" }
    );
  }, [newsIds]);

  if (!news.length) return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <Newspaper size={32} style={{ color: "rgba(255,255,255,0.1)" }} />
      <p className="text-sm text-gray-700">No articles found.</p>
    </div>
  );

  return (
    <div ref={gridRef} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {news.map((n) => (
        <div key={n._id} className="nl-card">
          <NewsCard
            n={n}
            userEmail={userEmail}
            onLike={onLike}
            onDislike={onDislike}
            onOpen={onOpen}
          />
        </div>
      ))}
    </div>
  );
}

export default NewsList;