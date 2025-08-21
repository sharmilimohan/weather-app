import React, { useState, useEffect } from "react";

export default function WeatherApp() {
  const API_KEY = process.env.REACT_APP_OWM_KEY || "";

  const [query, setQuery] = useState("Madurai");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeather(query);
  }, []);

  async function fetchWeather(city) {
    if (!API_KEY) {
      setError("Missing  API");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setWeather({
          name: `${data.name}, ${data.sys.country}`,
          temp: Math.round(data.main.temp),
          feels: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          wind: data.wind.speed,
          desc: data.weather[0].description,
          icon: data.weather[0].icon,
        });
      } else {
        setError(data.message);
      }
    } catch {
      setError("Failed to fetch weather");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    if (query) fetchWeather(query);
  }

  function getLocationWeather() {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude, longitude } = coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`;
        const res = await fetch(url);
        const data = await res.json();
        setWeather({
          name: `${data.name}, ${data.sys.country}`,
          temp: Math.round(data.main.temp),
          feels: Math.round(data.main.feels_like),
          humidity: data.main.humidity,
          wind: data.wind.speed,
          desc: data.weather[0].description,
          icon: data.weather[0].icon,
        });
      },
      () => setError("Location access denied")
    );
  }

  return (
    <div className="weather-app">
      <form onSubmit={handleSearch} className="search-bar">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
        />
        <button type="submit">🔍</button>
        <button type="button" onClick={getLocationWeather}>
          📍
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">Error: {error}</p>}

      {weather && (
        <div className="weather-main">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@4x.png`}
            alt={weather.desc}
          />
          <h1>{weather.temp}°C</h1>
          <p>{weather.name}</p>
          <p>{weather.desc}</p>
          <div className="extra-info">
            <p>Feels like: {weather.feels}°C</p>
            <p>Humidity: {weather.humidity}%</p>
            <p>Wind: {weather.wind} m/s</p>
          </div>
        </div>
      )}
    </div>
  );
}
