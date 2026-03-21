import { useEffect, useState } from "react";
import { getKochiWeather } from "../../services/api";

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await getKochiWeather();
        setWeather(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadWeather();
  }, []);

  if (!weather) return <p>Loading weather...</p>;

  return (
    <div className="bg-gray-800 p-4 rounded-xl text-white">
      <h2 className="text-lg font-bold mb-2">🌦 Current Weather</h2>

      <p>🌡 Temp: {weather.temperature}°C</p>
      <p>💨 Wind: {weather.windspeed} km/h</p>
      <p>🧭 Direction: {weather.winddirection}°</p>
    </div>
  );
}