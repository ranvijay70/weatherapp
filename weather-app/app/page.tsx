'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import WeatherDisplay from '@/components/WeatherDisplay';
import { getWeatherData, getForecastData, WeatherData, ForecastData } from '@/services/weatherService';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (city: string) => {
    try {
      setLoading(true);
      setError('');
      
      const [weather, forecast] = await Promise.all([
        getWeatherData(city),
        getForecastData(city)
      ]);
      
      setWeatherData(weather);
      setForecastData(forecast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 text-white">
          Weather Forecast
        </h1>
        <SearchBar onSearch={handleSearch} />
        {loading ? (
          <div className="text-center text-white mt-8">Loading...</div>
        ) : (
          <WeatherDisplay 
            weatherData={weatherData} 
            forecastData={forecastData}
            error={error} 
          />
        )}
      </div>
    </main>
  );
}
