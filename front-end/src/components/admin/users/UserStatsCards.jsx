import { Users, ShieldOff, Activity } from "lucide-react"

export default function UserStatsCards({users}){

  const total = users.length
  const blocked = users.filter(u=>u.blocked).length
  const active = total - blocked

  const stats = [
    {
      label:"Total Users",
      value:total,
      icon:<Users size={20}/>
    },
    {
      label:"Active Users",
      value:active,
      icon:<Activity size={20}/>
    },
    {
      label:"Blocked Users",
      value:blocked,
      icon:<ShieldOff size={20}/>
    }
  ]

  return(

    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

      {stats.map((s,i)=>(

        <div
          key={i}
          className="glass-card p-6 flex items-center justify-between"
        >

          <div>
            <p className="text-gray-400 text-sm">{s.label}</p>
            <h2 className="text-2xl font-semibold">{s.value}</h2>
          </div>

          <div className="text-indigo-400">
            {s.icon}
          </div>

        </div>

      ))}

    </div>

  )
}