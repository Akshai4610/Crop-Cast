import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts"

export default function UserCharts({users}){

  const data = users.map((u,i)=>({
    name:`U${i+1}`,
    count:i+1
  }))

  return(

    <div className="glass-card p-6">

      <h2 className="text-lg mb-4">
        User Growth
      </h2>

      <ResponsiveContainer width="100%" height={250}>

        <LineChart data={data}>

          <XAxis dataKey="name"/>

          <Tooltip/>

          <Line
            dataKey="count"
            stroke="#6366f1"
            strokeWidth={2}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  )
}