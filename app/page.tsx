'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import WeatherDisplay from '@/components/WeatherDisplay';
import LoadingSpinner from '@/components/LoadingSpinner';
import NoDataFound from '@/components/ui/no-data-found';
import { ForecastData, WeatherData, AQIData } from '@/services/weatherService';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
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
      setAqiData(data.aqi || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
      setForecastData(null);
      setAqiData(null);
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
      setAqiData(data.aqi || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
      setWeatherData(null);
      setForecastData(null);
      setAqiData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-3 sm:p-4 md:p-6 lg:p-8 bg-gradient-to-br from-purple-900 via-slate-900 to-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center mb-4 sm:mb-6 md:mb-8 text-white">
          Weather Forecast
        </h1>
        <SearchBar 
          onSearch={handleSearch} 
          onLocationSearch={handleLocationSearch}
        />
        {error ? (
          <div className="text-center text-red-400 mb-4 sm:mb-6 md:mb-8 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-2">
            <span className="text-xs sm:text-sm md:text-base">{error}</span>
            <button 
              onClick={() => setError('')}
              className="px-4 py-2 sm:py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-full text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[40px] touch-manipulation"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <LoadingSpinner />
          </div>
        ) : weatherData ? (
          <WeatherDisplay weather={weatherData} forecast={forecastData} aqi={aqiData} />
        ) : (
          <NoDataFound displayMessage="No weather data available. Search for a city to get started!" />
        )}
      </div>
    </main>
  );
}