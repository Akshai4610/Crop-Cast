// src/pages/user/NewsPage.jsx
/*
  PURPOSE:
  - Displays agriculture and weather related news
*/

const NewsPage = () => {
  return (
    <section className="max-w-6xl mx-auto animate-fade-in">
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
        Agriculture News
      </h1>

      <div className="glass-card">
        <p className="text-white/80">
          Latest agriculture and weather news will be shown here.
        </p>
      </div>
    </section>
  );
};

export default NewsPage;
