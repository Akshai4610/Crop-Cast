import { useEffect, useState } from "react";
import { getNews, likeNews, dislikeNews } from "../../services/api";

import NewsList from "../../components/user/news/NewsList";
import NewsDetail from "../../components/user/news/NewsDetail";

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState("");
  const [selected, setSelected] = useState(null);

  const userEmail = localStorage.getItem("username");

  const fetchNews = async () => {
    const data = await getNews(category);
    setNews(data);
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  // =============================
  // LIKE (FINAL FIX)
  // =============================
  const handleLike = async (id) => {
  const updated = await likeNews(id);

  setNews((prev) =>
    prev.map((n) => (n._id === id ? updated : n))
  );
};

  // =============================
  // DISLIKE (FINAL FIX)
  // =============================
  const handleDislike = async (id) => {
  const updated = await dislikeNews(id);

  setNews((prev) =>
    prev.map((n) => (n._id === id ? updated : n))
  );
};

  return (
    <div className="p-6">
      {/* FILTER */}
      <div className="flex gap-3 mb-6 flex-wrap">
        {["", "crop", "weather", "general"].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="px-4 py-1 bg-gray-800 rounded-full hover:bg-emerald-400 hover:text-black"
          >
            {c || "All"}
          </button>
        ))}
      </div>

      {/* LIST */}
      <NewsList
        news={news}
        userEmail={userEmail}
        onLike={handleLike}
        onDislike={handleDislike}
        onOpen={setSelected}
      />

      {/* MODAL */}
      <NewsDetail selected={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default NewsPage;
