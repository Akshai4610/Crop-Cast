// KEEP FILE (but simplify usage)
// Now mainly fallback component

const PredictionResult = ({ crops = [], confidence = 0 }) => {
  if (!crops.length)
    return <div className="glass-card">No prediction</div>;

  return (
    <div className="glass-card">
      <h3>{crops[0]}</h3>
      <p>{(confidence * 100).toFixed(2)}%</p>
    </div>
  );
};

export default PredictionResult;