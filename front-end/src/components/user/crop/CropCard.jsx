// CropCard.jsx
/*
  PURPOSE:
  - Reusable card for displaying crop information
  - Designed for insights and recommendations
  - Fully UI-based for now
*/

const CropCard = ({ name, season, water, soil }) => {
  return (
    <div className="glass-card hover:scale-105 transition duration-300 cursor-pointer">
      <h3 className="text-2xl font-semibold text-emerald-300 mb-2">
        🌱 {name}
      </h3>

      <p className="text-white/80 mb-1">
        <span className="font-semibold">Season:</span> {season}
      </p>

      <p className="text-white/80 mb-1">
        <span className="font-semibold">Water Requirement:</span> {water}
      </p>

      <p className="text-white/80">
        <span className="font-semibold">Soil Type:</span> {soil}
      </p>
    </div>
  );
};

export default CropCard;
