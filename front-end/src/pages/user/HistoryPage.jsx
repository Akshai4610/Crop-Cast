/**
 * Shows previous predictions made by the logged-in user
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [history, setHistory] = useState([]);

  // ❌ Block guest users
  useEffect(() => {
    if (!user || !token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/api/predictions/history/${user.username}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // 🔐 REQUIRED
            },
          }
        );

        const data = await res.json();
        setHistory(data.history || []);
      } catch (err) {
        console.error("History fetch failed", err);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Prediction History</h2>

      {history.length === 0 && <p>No predictions yet.</p>}

      {history.map((item, index) => (
        <div key={index} className="border p-3 rounded mb-3">
          <p><b>Crop:</b> {item.predicted_crop}</p>
          <p><b>Confidence:</b> {(item.confidence * 100).toFixed(2)}%</p>
          <p className="text-sm text-gray-500">
            {new Date(item.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
