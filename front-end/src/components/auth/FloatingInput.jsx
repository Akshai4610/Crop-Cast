import { useState } from "react";

export default function FloatingInput({
  type = "text",
  name,
  label,
  value,
  onChange,
}) {
  const [focus, setFocus] = useState(false);

  return (
    <div className="relative">

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(value !== "")}
        className="peer w-full px-4 pt-5 pb-2 pr-10 rounded-xl bg-white/10 border border-gray-600 text-white outline-none focus:ring-2 focus:ring-emerald-400"
      />

      <label
        className={`
          absolute left-4 text-gray-400 transition-all duration-200
          ${focus || value ? "top-1 text-xs text-emerald-400" : "top-3 text-sm"}
        `}
      >
        {label}
      </label>

    </div>
  );
}