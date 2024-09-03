"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";
import styles from "./home.module.css";

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
    <div className={styles.weatherApp} style={getBackgroundStyle(weatherData)}>
      <div className={styles.weatherCard}>
        <h1 style={{ color: "white" }}>Weather Dashboard</h1>
        <form onSubmit={handleSubmit}>
          <input
            className={styles.searchBox}
            type="text"
            placeholder="Enter city name"
            value={city}
            onChange={handleInputChange}
          />
          <button className={styles.searchButton} type="submit">
            <div style={{ fontSize: "16px" }}>Search</div>
          </button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {weatherData && (
          <div style={{ marginTop: "30px" }}>
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
            <p>Wind Speed: {weatherData.current.wind_kph} kmph</p>
            <p>
              <b>{weatherData.current.condition.text}</b>
            </p>
            <Image
              src={`https:${weatherData.current.condition.icon}`}
              alt="weather icon"
              width={100}
              height={100}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Time-based and weather-based gradient colors
function getBackgroundStyle(weatherData: WeatherData | null) {
  if (!weatherData) return { background: "lightskyblue" };

  const weather = weatherData.current.condition.text.toLowerCase();
  const localTime = new Date(weatherData.location.localtime);
  const hours = localTime.getHours();

  let timeColor: string;
  let weatherColor: string;

  // Determine the base color based on the time of day
  if (hours >= 0 && hours < 6) {
    timeColor = "#2c3e50"; // Midnight to dawn (dark blue)
  } else if (hours >= 6 && hours < 9) {
    timeColor = "#f39c12"; // Dawn to morning (orange)
  } else if (hours >= 9 && hours < 12) {
    timeColor = "#f1c40f"; // Morning to noon (yellow)
  } else if (hours >= 12 && hours < 15) {
    timeColor = "#3498db"; // Noon to afternoon (sky blue)
  } else if (hours >= 15 && hours < 18) {
    timeColor = "#e67e22"; // Afternoon to evening (orange-red)
  } else if (hours >= 18 && hours < 21) {
    timeColor = "#8e44ad"; // Evening to night (purple)
  } else {
    timeColor = "#2c3e50"; // Night (dark blue)
  }

  // Determine the weather color
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
    background: `linear-gradient(135deg, ${timeColor}, ${weatherColor})`,
  };
}
