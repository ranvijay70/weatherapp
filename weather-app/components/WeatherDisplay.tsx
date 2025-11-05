'use client';

import { WeatherData, ForecastData } from '@/services/weatherService';
import { useState } from 'react';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';

interface WeatherDisplayProps {
  weatherData: WeatherData | null;
  forecastData: ForecastData | null;
  error?: string;
}

const getWeatherBackground = (weatherMain: string) => {
  switch (weatherMain.toLowerCase()) {
    case 'clear':
      return 'from-sky-400 via-blue-500 to-blue-600';
    case 'clouds':
      return 'from-gray-400 via-gray-500 to-gray-600';
    case 'rain':
    case 'drizzle':
      return 'from-blue-700 via-blue-800 to-gray-800';
    case 'snow':
      return 'from-blue-100 via-blue-200 to-gray-200';
    case 'thunderstorm':
      return 'from-gray-700 via-purple-900 to-gray-900';
    default:
      return 'from-indigo-500 via-purple-500 to-pink-500';
  }
};

export default function WeatherDisplay({ weatherData, forecastData, error }: WeatherDisplayProps) {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');

  if (error) {
    return (
      <div className="text-center text-red-700 p-4 bg-red-100 rounded-xl shadow-md animate-pulse">
        {error}
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="text-center text-gray-500 py-8">
        Enter a city name to see the weather
      </div>
    );
  }

  const toggleUnits = () => {
    setUnits(prev => prev === 'metric' ? 'imperial' : 'metric');
  };

  const convertTemp = (temp: number) => {
    if (units === 'imperial') {
      return Math.round((temp * 9/5) + 32);
    }
    return Math.round(temp);
  };

  const bgGradient = getWeatherBackground(weatherData.weather[0].main);

  return (
    <div className={`bg-gradient-to-br ${bgGradient} p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto animate-fade-in`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-extrabold text-white drop-shadow-lg">
          {weatherData.name}
        </h2>
        <button
          onClick={toggleUnits}
          className="bg-white/20 px-4 py-2 rounded-lg text-white hover:bg-white/30 transition-colors"
        >
          °{units === 'metric' ? 'C' : 'F'}
        </button>
      </div>
      
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-6">
        <div className="text-center md:text-left">
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
            alt={weatherData.weather[0].description}
            className="mx-auto md:mx-0 drop-shadow-xl"
          />
          <p className="text-xl font-semibold text-white capitalize mt-2 drop-shadow">
            {weatherData.weather[0].description}
          </p>
        </div>
        <div className="flex-1 text-center md:text-left space-y-2 text-white drop-shadow">
          <p className="text-6xl font-bold">
            {convertTemp(weatherData.main.temp)}°{units === 'metric' ? 'C' : 'F'}
          </p>
          <p className="text-xl">
            Feels like: {convertTemp(weatherData.main.feels_like)}°{units === 'metric' ? 'C' : 'F'}
          </p>
          <p className="text-xl">Humidity: {weatherData.main.humidity}%</p>
        </div>
      </div>

      <HourlyForecast forecastData={forecastData} units={units} />
      <DailyForecast forecastData={forecastData} units={units} />

      <div className="mt-6 text-center text-white text-sm opacity-80">
        {/* Powered by OpenWeather */}
      </div>
    </div>
  );
}
