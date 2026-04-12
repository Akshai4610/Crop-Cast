import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";

const HistoryHeatmap = ({ data }) => {
  const values = data.map(d => ({
    date: new Date(d.timestamp).toISOString().split("T")[0],
    count: 1
  }));

  return (
    <div className="bg-slate-800 p-4 rounded-xl mt-6">
      <h3 className="mb-3">Activity Heatmap</h3>

      <CalendarHeatmap
        startDate={new Date(new Date().setMonth(new Date().getMonth() - 3))}
        endDate={new Date()}
        values={values}
      />
    </div>
  );
};

export default HistoryHeatmap;