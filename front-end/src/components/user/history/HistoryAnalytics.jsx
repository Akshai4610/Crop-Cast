import {
  PieChart, Pie, Cell, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid
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
        <PieChart width={300} height={250}>
          <Pie data={pieData} dataKey="value">
            {pieData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </motion.div>

      {/* LINE */}
      <motion.div className="bg-slate-800 p-4 rounded-xl">
        <h3 className="mb-3">Confidence Trend</h3>
        <LineChart width={350} height={250} data={trend}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="confidence" stroke="#10b981" />
        </LineChart>
      </motion.div>
    </div>
  );
};

export default HistoryAnalytics;