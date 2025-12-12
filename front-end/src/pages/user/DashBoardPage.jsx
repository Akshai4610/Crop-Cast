// src/pages/user/DashboardPage.jsx
/*
  PURPOSE:
  - User Dashboard main page
  - Will later host:
      • Weather input form
      • ML prediction results
      • Prediction history summary
*/

const DashboardPage = () => {
  return (
    <section className="max-w-7xl mx-auto animate-fade-in">
      
      {/* Page heading */}
      <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-lime-400 bg-clip-text text-transparent">
        Dashboard
      </h1>

      {/* Placeholder cards */}
      <div className="grid md:grid-cols-3 gap-6">
        
        <div className="glass-card">
          <h3 className="text-xl font-semibold mb-2">Weather Input</h3>
          <p className="text-white/70">
            Enter weather details to get crop recommendations.
          </p>
        </div>

        <div className="glass-card">
          <h3 className="text-xl font-semibold mb-2">ML Prediction</h3>
          <p className="text-white/70">
            AI-based crop suggestions will appear here.
          </p>
        </div>

        <div className="glass-card">
          <h3 className="text-xl font-semibold mb-2">History</h3>
          <p className="text-white/70">
            View your past crop predictions.
          </p>
        </div>

      </div>
    </section>
  );
};

export default DashboardPage;
