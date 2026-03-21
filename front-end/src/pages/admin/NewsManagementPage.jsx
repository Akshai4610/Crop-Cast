/*
====================================================
Admin → News Management Page
- Matches UserManagementPage design
- Includes stats + table + form
====================================================
*/

import { useEffect, useState, useCallback } from "react";

import AdminNavbar from "../../components/admin/navbar/AdminNavbar";

import { getNews } from "../../services/api";

import NewsTable from "../../components/admin/news/NewsTable";
import NewsForm from "../../components/admin/news/NewsForm";
import NewsSearchBar from "../../components/admin/news/NewsSearchBar";
import NewsAnalytics from "../../components/admin/news/NewsAnalytics";
import WeatherWidget from "../../components/common/WeatherWidget";

export default function NewsManagementPage() {
  const [news, setNews] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedNews, setSelectedNews] = useState(null);
  const [openForm, setOpenForm] = useState(false);

  // =========================================
  // Load News
  // =========================================
  const loadNews = useCallback(async () => {
    try {
      const data = await getNews(category);

      // simple search filter (frontend)
      const filtered = data.filter((n) =>
        n.title.toLowerCase().includes(search.toLowerCase()),
      );

      setNews(filtered);
    } catch (err) {
      console.error("News load failed");
    }
  }, [search, category]);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // =========================================
  // Open Form
  // =========================================
  const handleAdd = () => {
    setSelectedNews(null);
    setOpenForm(true);
  };

  const handleEdit = (newsItem) => {
    setSelectedNews(newsItem);
    setOpenForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* 🔍 SEARCH + FILTER */}
        <NewsSearchBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          onAdd={handleAdd}
        />

        <div className="grid xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2 glass-card p-6">
            <NewsTable news={news} refresh={loadNews} onEdit={handleEdit} />
          </div>

          <NewsAnalytics news={news} />
        </div>
      </div>

      {/* ➕ FORM MODAL */}
      {openForm && (
        <NewsForm
        news={selectedNews}
        onClose={() => setOpenForm(false)}
        refresh={loadNews}
        />
      )}
      <WeatherWidget />
    </div>
  );
}
