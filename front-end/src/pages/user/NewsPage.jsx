/*
  NewsPage
  --------
  - Full page showing agriculture/news or notifications
  - Reachable at /user/news
  - Replace placeholder cards with dynamic data later
*/

import { motion } from "framer-motion";

const NewsPage = () => {
  const items = [
    { title: "Monsoon Forecast", body: "Rain expected in target regions next week." },
    { title: "New Scheme", body: "Agricultural subsidy announced by Govt." },
    { title: "Farming Tips", body: "Best sowing practices for rice this season." },
  ];

  return (
    <section className="min-h-screen bg-green-50 py-16 px-6" id="user-news">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-green-800 mb-6">News & Updates</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it, idx) => (
            <motion.article
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-lg shadow border border-green-100"
            >
              <h3 className="font-semibold text-green-800 mb-2">{it.title}</h3>
              <p className="text-gray-600 text-sm">{it.body}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default NewsPage;
