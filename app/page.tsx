'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import WeatherDisplay from '@/components/WeatherDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import { ForecastData, WeatherData } from '@/services/weatherService';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (city: string) => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      setWeatherData(data.weather);
      setForecastData(data.forecast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSearch = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError('');

      const res = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      setWeatherData(data.weather);
      setForecastData(data.forecast);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
      setForecastData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gradient-to-br from-purple-900 via-slate-900 to-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 text-white">
          Weather Forecast
        </h1>
        <SearchBar 
          onSearch={handleSearch} 
          onLocationSearch={handleLocationSearch}
        />
        {error ? (
          <div className="text-center text-red-400 mb-8 flex items-center justify-center gap-2">
            <span>{error}</span>
            <button 
              onClick={() => setError('')}
              className="px-4 py-1 bg-white/10 hover:bg-white/20 rounded-full text-sm transition-all"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="text-center mb-8">
            <LoadingSpinner />
          </div>
        ) : weatherData ? (
          <WeatherDisplay weather={weatherData} forecast={forecastData} />
        ) : null}
      </div>
    </main>
  );
}