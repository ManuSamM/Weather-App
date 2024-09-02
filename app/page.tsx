'use client';
import { useState } from "react";
import axios from "axios";
import Image from "next/image";

interface WeatherData {
  location: {
    name: string;
    country: string;
    localtime: string; // Add this field to get local time
  };
  current: {
    temp_c: number;
    temp_f: number;
    condition: {
      text: string;
      icon: string;
    };
    humidity: number;
    wind_kph: number;
  };
}

export default function Home() {
  const [city, setCity] = useState<string>("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string>("");

  const getWeather = async () => {
    try {
      const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
      const response = await axios.get<WeatherData>(
        `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
      );
      setWeatherData(response.data);
      setError("");
    } catch (err: any) {
      setError("City not found");
      setWeatherData(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleSearch = () => {
    if (city) {
      getWeather();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    handleSearch();
  };

  return (
    <div style={getBackgroundStyle(weatherData)}>
      <div style={{ textAlign: "center", padding: "50px" }}>
        <h1>Weather Dashboard</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={handleInputChange}
            style={{ padding: "10px", fontSize: "16px" }}
          />
          <button
            type="submit"
            style={{ padding: "10px 20px", marginLeft: "10px" }}
          >
            Search
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {weatherData && (
          <div style={{ marginTop: "30px", color: "#fff" }}>
            <h2>
              {weatherData.location.name}, {weatherData.location.country}
            </h2>
            <p>
              Local Time:{" "}
              {new Date(weatherData.location.localtime).toLocaleTimeString()}
            </p>
            <p>
              Temperature: {weatherData.current.temp_c}°C /{" "}
              {weatherData.current.temp_f}°F
            </p>
            <p>Humidity: {weatherData.current.humidity}%</p>
            <p>Wind Speed: {weatherData.current.wind_kph} kph</p>
            <p>{weatherData.current.condition.text}</p>
            <Image
              src={`https:${weatherData.current.condition.icon}`}
              alt="weather icon"
              width={64}
              height={64}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function getBackgroundStyle(weatherData: WeatherData | null) {
  if (!weatherData) return { backgroundColor: "#87CEEB", height: "100vh" };

  const weather = weatherData.current.condition.text.toLowerCase();
  let weatherColor: string;

  switch (weather) {
    case "sunny":
    case "clear":
      weatherColor = "gold";
      break;
    case "partly cloudy":
    case "cloudy":
      weatherColor = "#D3D3D3";
      break;
    case "rain":
    case "light rain":
    case "moderate rain":
      weatherColor = "#4682B4";
      break;
    case "snow":
      weatherColor = "#FFFFFF";
      break;
    case "thunderstorm":
      weatherColor = "#778899";
      break;
    case "fog":
    case "mist":
      weatherColor = "#B0C4DE";
      break;
    default:
      weatherColor = "#87CEEB";
  }

  return {
    backgroundColor: weatherColor,
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    color: "#fff",
  };
}
