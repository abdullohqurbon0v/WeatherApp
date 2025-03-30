// app/page.tsx
"use client";

import { useState, useEffect, FormEvent, JSX } from "react";
import {
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiFog,
  WiThunderstorm,
} from "react-icons/wi";
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
}

interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      temp_max: number;
      temp_min: number;
    };
    weather: Array<{
      main: string;
      description: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
}

export default function WeatherApp() {
  const [city, setCity] = useState<string>("Tashkent");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null
  );
  const [showGeoPrompt, setShowGeoPrompt] = useState<boolean>(true);

  const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
  const WEATHER_API = coords
    ? `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`
    : `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`;
  const FORECAST_API = coords
    ? `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`
    : `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;

  const getUserLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setLoading(true);
    setError(null);

    if ("permissions" in navigator) {
      const permissionStatus = await navigator.permissions.query({
        name: "geolocation",
      });
      if (permissionStatus.state === "denied") {
        setError(
          "Geolocation access denied. Please enable it in your browser settings and try again."
        );
        setLoading(false);
        return;
      }
    }

    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        setCoords({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setCity("");
        setLoading(false);
      },
      (err: GeolocationPositionError) => {
        if (err.code === err.PERMISSION_DENIED) {
          setError(
            "Location access was denied. Please allow location access to use this feature."
          );
          setTimeout(() => {
            navigator.geolocation.getCurrentPosition(
              (position: GeolocationPosition) => {
                setCoords({
                  lat: position.coords.latitude,
                  lon: position.coords.longitude,
                });
                setCity("");
                setLoading(false);
              },
              () => {
                setError(
                  "Failed to get location after retry. Please enable location in settings or enter a city manually."
                );
                setLoading(false);
              }
            );
          }, 1000);
        } else {
          setError(`Geolocation error: ${err.message}`);
          setLoading(false);
        }
      }
    );
  };

  const fetchWeatherData = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const weatherRes = await fetch(WEATHER_API);
      const forecastRes = await fetch(FORECAST_API);

      if (!weatherRes.ok || !forecastRes.ok) {
        throw new Error("Location not found or API error");
      }

      const weather: WeatherData = await weatherRes.json();
      const forecast: ForecastData = await forecastRes.json();

      setWeatherData(weather);
      setForecastData(forecast);

      if (coords && weather.name) {
        setCity(weather.name);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showGeoPrompt && (coords || city)) {
      fetchWeatherData();
    }
  }, [coords, showGeoPrompt]);

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setCoords(null);
    fetchWeatherData();
  };

  const getWeatherIcon = (weather: string): JSX.Element => {
    switch (weather.toLowerCase()) {
      case "clear":
        return <WiDaySunny className="text-yellow-400 text-6xl" />;
      case "clouds":
        return <WiCloudy className="text-gray-400 text-6xl" />;
      case "rain":
        return <WiRain className="text-blue-400 text-6xl" />;
      case "snow":
        return <WiSnow className="text-white text-6xl" />;
      case "fog":
        return <WiFog className="text-gray-300 text-6xl" />;
      case "thunderstorm":
        return <WiThunderstorm className="text-purple-400 text-6xl" />;
      default:
        return <WiCloudy className="text-gray-400 text-6xl" />;
    }
  };

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  const getWeatherTheme = (): string => {
    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
      return "bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900";
    }

    const weatherType = weatherData.weather[0].main.toLowerCase();
    switch (weatherType) {
      case "clear":
        return "bg-gradient-to-br from-yellow-500 via-orange-400 to-red-500";
      case "clouds":
        return "bg-gradient-to-br from-gray-500 via-gray-700 to-gray-900";
      case "rain":
        return "bg-gradient-to-br from-blue-700 via-blue-800 to-gray-900";
      case "snow":
        return "bg-gradient-to-br from-blue-200 via-gray-300 to-white";
      case "fog":
        return "bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600";
      case "thunderstorm":
        return "bg-gradient-to-br from-purple-800 via-gray-900 to-black";
      default:
        return "bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900";
    }
  };

  const getTextColor = (): string => {
    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
      return "text-white";
    }

    const weatherType = weatherData.weather[0].main.toLowerCase();
    return weatherType === "snow" || weatherType === "fog"
      ? "text-gray-800"
      : "text-white";
  };

  const handleGeoAccept = (): void => {
    setShowGeoPrompt(false);
    getUserLocation();
  };

  const handleGeoDecline = (): void => {
    setShowGeoPrompt(false);
    fetchWeatherData();
  };

  return (
    <div
      className={`min-h-screen ${getWeatherTheme()} ${getTextColor()} p-6 transition-all duration-500`}
    >
      <div className="container mx-auto max-w-5xl">
        {showGeoPrompt && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/20 max-w-md w-full text-center">
              <h2 className="text-2xl font-bold mb-4">
                Allow Location Access?
              </h2>
              <p className="text-sm mb-6 opacity-75">
                Would you like to allow this app to access your location to show
                weather for your current position?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleGeoAccept}
                  className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300"
                >
                  Yes
                </button>
                <button
                  onClick={handleGeoDecline}
                  className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all duration-300"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        <header className="text-center mb-8">
          <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-lg">
            Weather Dashboard
          </h1>
          <p className="text-lg mt-2 opacity-80">
            Real-time weather insights at your fingertips
          </p>
        </header>

        <div className="mb-10 flex flex-col items-center gap-4">
          <form onSubmit={handleSearch} className="flex justify-center gap-4">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className={`w-64 p-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400 ${getTextColor()} placeholder-gray-300`}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 disabled:bg-gray-500"
            >
              {loading ? "Loading..." : "Search"}
            </button>
          </form>
          <button
            onClick={getUserLocation}
            disabled={loading}
            className="px-6 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-all duration-300 disabled:bg-gray-500"
          >
            {loading ? "Loading..." : "Use My Location"}
          </button>
        </div>

        {error && (
          <div className="text-center text-red-400 mb-6 text-lg font-medium max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {weatherData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/20">
              <h2 className="text-3xl font-bold mb-4">{weatherData.name}</h2>
              <div className="flex items-center gap-4">
                {getWeatherIcon(weatherData.weather[0].main)}
                <div>
                  <p className="text-5xl font-semibold">
                    {Math.round(weatherData.main.temp)}°C
                  </p>
                  <p className="text-xl capitalize">
                    {weatherData.weather[0].description}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-sm opacity-75">
                Feels like: {Math.round(weatherData.main.feels_like)}°C
              </p>
              {coords && (
                <p className="mt-2 text-xs opacity-75">
                  Lat: {coords.lat.toFixed(2)}, Lon: {coords.lon.toFixed(2)}
                </p>
              )}
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/20">
              <h3 className="text-xl font-semibold mb-4">
                Detailed Information
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  Humidity:{" "}
                  <span className="font-medium">
                    {weatherData.main.humidity}%
                  </span>
                </li>
                <li>
                  Pressure:{" "}
                  <span className="font-medium">
                    {weatherData.main.pressure} hPa
                  </span>
                </li>
                <li>
                  Wind Speed:{" "}
                  <span className="font-medium">
                    {weatherData.wind.speed} m/s
                  </span>
                </li>
                <li>
                  Wind Direction:{" "}
                  <span className="font-medium">{weatherData.wind.deg}°</span>
                </li>
                <li>
                  Cloudiness:{" "}
                  <span className="font-medium">{weatherData.clouds.all}%</span>
                </li>
                <li>
                  Sunrise:{" "}
                  <span className="font-medium">
                    {new Date(
                      weatherData.sys.sunrise * 1000
                    ).toLocaleTimeString()}
                  </span>
                </li>
                <li>
                  Sunset:{" "}
                  <span className="font-medium">
                    {new Date(
                      weatherData.sys.sunset * 1000
                    ).toLocaleTimeString()}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {forecastData && (
          <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/20">
            <h3 className="text-2xl font-semibold mb-6">5-Day Forecast</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
              {forecastData.list
                .filter((_, index: number) => index % 8 === 0)
                .map((day, index: number) => (
                  <div
                    key={index}
                    className="bg-white/5 p-4 rounded-lg text-center hover:bg-white/10 transition-all duration-300"
                  >
                    <p className="font-medium">{formatDate(day.dt)}</p>
                    {getWeatherIcon(day.weather[0].main)}
                    <p className="text-lg font-semibold">
                      {Math.round(day.main.temp)}°C
                    </p>
                    <p className="text-sm capitalize">
                      {day.weather[0].description}
                    </p>
                    <p className="text-xs mt-2 opacity-75">
                      H: {Math.round(day.main.temp_max)}°C / L:{" "}
                      {Math.round(day.main.temp_min)}°C
                    </p>
                    <p className="text-xs opacity-75">
                      Wind: {day.wind.speed} m/s
                    </p>
                  </div>
                ))}
            </div>
          </div>
        )}

        {forecastData && (
          <div className="mt-12 bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/20">
            <h3 className="text-2xl font-semibold mb-6">
              Hourly Forecast (Next 24h)
            </h3>
            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-blue-400 scrollbar-track-transparent">
              {forecastData.list.slice(0, 8).map((hour, index: number) => (
                <div
                  key={index}
                  className="bg-white/5 p-4 rounded-lg text-center min-w-[120px] hover:bg-white/10 transition-all duration-300"
                >
                  <p className="font-medium">
                    {new Date(hour.dt * 1000).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  {getWeatherIcon(hour.weather[0].main)}
                  <p className="text-lg font-semibold">
                    {Math.round(hour.main.temp)}°C
                  </p>
                  <p className="text-xs capitalize">
                    {hour.weather[0].description}
                  </p>
                  <p className="text-xs mt-2 opacity-75">
                    Wind: {hour.wind.speed} m/s
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="mt-12 text-center text-sm opacity-75">
          <p>Powered by OpenWeather API | Built with Next.js & Tailwind CSS</p>
          <p>© 2025 Weather Dashboard</p>
        </footer>
      </div>
    </div>
  );
}
