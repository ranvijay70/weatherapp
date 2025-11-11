import { useState } from 'react';
import { WeatherData, ForecastData } from '../services/weatherService';

export function useWeather() {
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

  return {
    weatherData,
    forecastData,
    error,
    loading,
    handleSearch,
    handleLocationSearch,
    setError
  };
}