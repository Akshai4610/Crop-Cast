import {
  PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#10b981", "#22c55e", "#4ade80", "#86efac"];

const HistoryAnalytics = ({ data }) => {

  // 📊 PIE DATA
  const cropCount = {};
  data.forEach(d => {
    cropCount[d.predicted_crop] =
      (cropCount[d.predicted_crop] || 0) + 1;
  });

  const pieData = Object.keys(cropCount).map(k => ({
    name: k,
    value: cropCount[k]
  }));

  // 📈 TREND DATA
  const trend = data.map(d => ({
    date: new Date(d.timestamp).toLocaleDateString(),
    confidence: d.confidence * 100
  }));

  return (
    <div className="grid md:grid-cols-2 gap-6">

      {/* PIE */}
      <motion.div className="bg-slate-800 p-4 rounded-xl">
        <h3 className="mb-3">Crop Distribution</h3>
        <ResponsiveContainer width="100%" height={250} minWidth={0}>
          <PieChart>
            <Pie data={pieData} dataKey="value" cx="50%" cy="50%" outerRadius={80}>
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </motion.div>

      {/* LINE */}
      <motion.div className="bg-slate-800 p-4 rounded-xl">
        <h3 className="mb-3">Confidence Trend</h3>
        <ResponsiveContainer width="100%" height={250} minWidth={0}>
          <LineChart data={trend}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="confidence" stroke="#10b981" />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
};

export default HistoryAnalytics;