export default function PasswordStrength({ password }) {

  const getStrength = () => {
    let score = 0;

    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return score;
  };

  const strength = getStrength();

  const levels = [
    { label: "Very Weak", color: "bg-red-500", glow: "shadow-red-500/50" },
    { label: "Weak", color: "bg-orange-400", glow: "shadow-orange-400/50" },
    { label: "Good", color: "bg-yellow-400", glow: "shadow-yellow-400/50" },
    { label: "Strong", color: "bg-green-500", glow: "shadow-green-500/50" },
  ];

  const current = levels[strength - 1];

  return (
    <div className="mt-3">

      <div className="flex gap-2">
        {[1,2,3,4].map((i)=>(
          <div
            key={i}
            className={`h-2 flex-1 rounded transition-all duration-300
              ${i <= strength 
                ? `${levels[strength-1].color} shadow-lg ${levels[strength-1].glow}` 
                : "bg-gray-700"
              }
            `}
          />
        ))}
      </div>

      <p className={`text-xs mt-1 transition-all ${
        current ? "text-white" : "text-gray-400"
      }`}>
        {current?.label || "Very Weak"}
      </p>

    </div>
  );
}