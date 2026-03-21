import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

export default function NewsAnalytics({ news }) {

  const data = useMemo(() => {
    const map = {};

    news.forEach(n => {
      map[n.category] = (map[n.category] || 0) + 1;
    });

    return Object.keys(map).map(key => ({
      name: key,
      value: map[key]
    }));
  }, [news]);

  return (
    <div className="glass-card p-6">

      <h2 className="text-lg mb-4">News Category Stats</h2>

      <BarChart width={300} height={200} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>

    </div>
  );
}