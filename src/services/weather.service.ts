/**
 * Weather Service
 * Handles weather-related API calls
 */

import { WeatherResponse, LocationInput, TemperatureUnit } from '@/src/models/weather.model';
import { API_ENDPOINTS } from '@/src/utils/constants';

export class WeatherService {
  /**
   * Fetch weather data by city name
   */
  static async getWeatherByCity(city: string, units: TemperatureUnit = 'metric'): Promise<WeatherResponse> {
    try {
      const res = await fetch(`${API_ENDPOINTS.WEATHER}?city=${encodeURIComponent(city)}&units=${units}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch weather data');
    }
  }

  /**
   * Fetch weather data by coordinates
   */
  static async getWeatherByCoordinates(
    lat: number,
    lon: number,
    units: TemperatureUnit = 'metric'
  ): Promise<WeatherResponse> {
    try {
      const res = await fetch(`${API_ENDPOINTS.WEATHER}?lat=${lat}&lon=${lon}&units=${units}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch weather data');
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Failed to fetch weather data');
    }
  }

  /**
   * Fetch weather data by location input
   */
  static async getWeather(
    location: LocationInput,
    units: TemperatureUnit = 'metric'
  ): Promise<WeatherResponse> {
    if (location.type === 'city') {
      return this.getWeatherByCity(location.city, units);
    } else {
      return this.getWeatherByCoordinates(location.lat, location.lon, units);
    }
  }
}

