// src/pages/user/NewsPage.jsx
/*
  User News Page
  - Card layout
  - Scrollable news list
*/

const news = [
  { title: "Crop Prices Rising", desc: "Market prices for wheat and maize increased today." },
  { title: "Weather Alert", desc: "Heavy rainfall expected tomorrow in northern regions." },
  { title: "New AI Model", desc: "CropCast released improved crop prediction model." },
];

const NewsPage = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">News</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {news.map((n, i) => (
          <div
            key={i}
            className="bg-gray-900/70 p-6 rounded-2xl shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 transition animate-fade-in"
          >
            <h2 className="text-xl font-semibold mb-2">{n.title}</h2>
            <p className="text-white/80">{n.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
