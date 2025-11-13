/**
 * Weather ViewModel
 * Manages weather-related state and business logic
 */

import { useState, useCallback, useRef } from 'react';
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
  private _state: WeatherState;
  private _setState: React.Dispatch<React.SetStateAction<WeatherState>>;

  constructor(
    state: WeatherState,
    setState: React.Dispatch<React.SetStateAction<WeatherState>>
  ) {
    this._state = state;
    this._setState = setState;
  }

  /**
   * Update state reference (for hook usage)
   */
  updateStateRef(state: WeatherState, setState: React.Dispatch<React.SetStateAction<WeatherState>>): void {
    this._state = state;
    this._setState = setState;
  }

  /**
   * Fetch weather by city name
   */
  async fetchWeatherByCity(city: string): Promise<void> {
    this._setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const units = SettingsService.getSetting('temperatureUnit');
      const data = await WeatherService.getWeatherByCity(city, units);

      this._setState({
        weather: data.weather,
        forecast: data.forecast,
        aqi: data.aqi,
        loading: false,
        error: null,
      });
    } catch (error) {
      this._setState({
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
    this._setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const units = SettingsService.getSetting('temperatureUnit');
      const data = await WeatherService.getWeatherByCoordinates(lat, lon, units);

      this._setState({
        weather: data.weather,
        forecast: data.forecast,
        aqi: data.aqi,
        loading: false,
        error: null,
      });
    } catch (error) {
      this._setState({
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
    this._setState((prev) => ({ ...prev, error: null }));
  }

  /**
   * Clear all data
   */
  clearData(): void {
    this._setState({
      weather: null,
      forecast: null,
      aqi: null,
      loading: false,
      error: null,
    });
  }

  getState(): WeatherState {
    return this._state;
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

  // Use useRef to persist ViewModel instance across renders
  const viewModelRef = useRef<WeatherViewModel | null>(null);
  if (!viewModelRef.current) {
    viewModelRef.current = new WeatherViewModel(state, setState);
  }
  // Update state reference in ViewModel
  viewModelRef.current.updateStateRef(state, setState);

  const fetchWeatherByCity = useCallback(
    async (city: string) => {
      await viewModelRef.current!.fetchWeatherByCity(city);
    },
    []
  );

  const fetchWeatherByCoordinates = useCallback(
    async (lat: number, lon: number) => {
      await viewModelRef.current!.fetchWeatherByCoordinates(lat, lon);
    },
    []
  );

  const clearError = useCallback(() => {
    viewModelRef.current!.clearError();
  }, []);

  const clearData = useCallback(() => {
    viewModelRef.current!.clearData();
  }, []);

  return {
    ...state,
    fetchWeatherByCity,
    fetchWeatherByCoordinates,
    clearError,
    clearData,
  };
}

