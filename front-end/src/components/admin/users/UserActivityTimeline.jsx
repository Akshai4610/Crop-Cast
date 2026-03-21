import { LogIn, LogOut } from "lucide-react"

export default function UserActivityTimeline({ users }) {

  const activities = users.slice(0, 6).map((u) => ({
    name: u.fullname,
    action: Math.random() > 0.5 ? "login" : "logout",
    time: "2 min ago",
  }))

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
                {a.time}
              </span>

            </div>

          </div>

        ))}

      </div>

    </div>

  )
}