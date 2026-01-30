/**
 * Shows previous predictions made by the user
 */
import { useEffect, useState } from "react";

export default function HistoryPage({ user }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/api/predictions/history/${user.username}`)
      .then((res) => res.json())
      .then((data) => setHistory(data.history));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Prediction History</h2>

      {history.map((item, index) => (
        <div key={index} className="border p-3 rounded mb-3">
          <p>
            <b>Crop:</b> {item.predicted_crop}
          </p>
          <p>
            <b>Confidence:</b> {(item.confidence * 100).toFixed(2)}%
          </p>
          <p className="text-sm text-gray-500">
            {new Date(item.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
