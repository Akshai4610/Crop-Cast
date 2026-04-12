import { useState, useEffect } from "react"
import { LogIn, LogOut, Loader2 } from "lucide-react"
import { getRecentActivities } from "../../../services/api"

export default function UserActivityTimeline() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await getRecentActivities()
        setActivities(data)
      } catch (err) {
        console.error("Failed to fetch activities", err)
      } finally {
        setLoading(false)
      }
    }
    fetchActivities()
    
    // Refresh every minute
    const interval = setInterval(fetchActivities, 60000)
    return () => clearInterval(interval)
  }, [])

  return (

    <div
      className="
        bg-white/5
        backdrop-blur-xl
        border border-white/10
        rounded-2xl
        p-6
        shadow-xl
      "
    >

      <h2 className="text-lg font-semibold mb-6">
        Recent Activity
      </h2>

      <div className="space-y-6">

        {activities.map((a, i) => (

          <div
            key={i}
            className="flex gap-4 items-start"
          >

            {/* Icon */}
            <div
              className="
                flex items-center justify-center
                w-9 h-9
                rounded-full
                bg-white/5
                border border-white/10
              "
            >

              {a.action === "login" ? (
                <LogIn size={18} className="text-green-400" />
              ) : (
                <LogOut size={18} className="text-red-400" />
              )}

            </div>

            {/* Text */}
            <div>

              <p className="text-sm text-gray-200">

                <span className="font-medium">
                  {a.name}
                </span>

                {" "}

                {a.action === "login"
                  ? "logged in"
                  : "logged out"}

              </p>

              <span className="text-xs text-gray-400">
                {a.time_ago}
              </span>
            </div>
          </div>
        ))}

        {!loading && activities.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-4">No recent activity</p>
        )}

        {loading && (
          <div className="flex justify-center py-4">
            <Loader2 className="animate-spin text-emerald-400" />
          </div>
        )}

      </div>

    </div>

  )
}