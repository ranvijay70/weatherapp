/**
 * Weather ViewModel
 * Manages weather-related state and business logic
 */

import { useState, useCallback } from 'react';
import { WeatherData, ForecastData, AQIData, TemperatureUnit } from '@/src/models/weather.model';
import { WeatherService } from '@/src/services/weather.service';
import { SettingsService } from '@/src/services/settings.service';

export interface WeatherState {
  weather: WeatherData | null;
  forecast: ForecastData | null;
  aqi: AQIData | null;
  loading: boolean;
  error: string | null;
}

export class WeatherViewModel {
  private state: WeatherState;
  private setState: React.Dispatch<React.SetStateAction<WeatherState>>;

  constructor(
    state: WeatherState,
    setState: React.Dispatch<React.SetStateAction<WeatherState>>
  ) {
    this.state = state;
    this.setState = setState;
  }

  /**
   * Fetch weather by city name
   */
  async fetchWeatherByCity(city: string): Promise<void> {
    this.setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const units = SettingsService.getSetting('temperatureUnit');
      const data = await WeatherService.getWeatherByCity(city, units);

      this.setState({
        weather: data.weather,
        forecast: data.forecast,
        aqi: data.aqi,
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        weather: null,
        forecast: null,
        aqi: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch weather data',
      });
    }
  }

  /**
   * Fetch weather by coordinates
   */
  async fetchWeatherByCoordinates(lat: number, lon: number): Promise<void> {
    this.setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const units = SettingsService.getSetting('temperatureUnit');
      const data = await WeatherService.getWeatherByCoordinates(lat, lon, units);

      this.setState({
        weather: data.weather,
        forecast: data.forecast,
        aqi: data.aqi,
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        weather: null,
        forecast: null,
        aqi: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to fetch weather data',
      });
    }
  }

  /**
   * Clear error
   */
  clearError(): void {
    this.setState((prev) => ({ ...prev, error: null }));
  }

  /**
   * Clear all data
   */
  clearData(): void {
    this.setState({
      weather: null,
      forecast: null,
      aqi: null,
      loading: false,
      error: null,
    });
  }

  getState(): WeatherState {
    return this.state;
  }
}

/**
 * Custom hook for Weather ViewModel
 */
export function useWeatherViewModel() {
  const [state, setState] = useState<WeatherState>({
    weather: null,
    forecast: null,
    aqi: null,
    loading: false,
    error: null,
  });

  const viewModel = new WeatherViewModel(state, setState);

  const fetchWeatherByCity = useCallback(
    (city: string) => viewModel.fetchWeatherByCity(city),
    [viewModel]
  );

  const fetchWeatherByCoordinates = useCallback(
    (lat: number, lon: number) => viewModel.fetchWeatherByCoordinates(lat, lon),
    [viewModel]
  );

  const clearError = useCallback(() => viewModel.clearError(), [viewModel]);
  const clearData = useCallback(() => viewModel.clearData(), [viewModel]);

  return {
    ...state,
    fetchWeatherByCity,
    fetchWeatherByCoordinates,
    clearError,
    clearData,
  };
}

