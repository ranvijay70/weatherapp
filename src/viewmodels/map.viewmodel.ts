/**
 * Map ViewModel
 * Manages map-related state and business logic
 */

import { useState, useCallback, useRef } from 'react';
import { WeatherService } from '@/src/services/weather.service';
import { LocationService } from '@/src/services/location.service';
import { WeatherData } from '@/src/models/weather.model';
import { Coordinates } from '@/src/models/location.model';

export interface MapState {
  lat: number;
  lon: number;
  zoom: number;
  baseMap: 'standard' | 'satellite' | 'terrain';
  weatherLayer: 'temperature' | 'precipitation' | 'wind' | 'clouds' | 'pressure' | null;
  opacity: number;
  showControls: boolean;
  showLegend: boolean;
  selectedLocation: { name: string; lat: number; lon: number } | null;
  weatherInfo: WeatherData | null;
  loadingWeather: boolean;
  mounted: boolean;
}

export class MapViewModel {
  private state: MapState;
  private setState: React.Dispatch<React.SetStateAction<MapState>>;

  constructor(
    state: MapState,
    setState: React.Dispatch<React.SetStateAction<MapState>>
  ) {
    this.state = state;
    this.setState = setState;
  }

  /**
   * Initialize map with user location or default
   */
  async initializeLocation(urlLat?: string | null, urlLon?: string | null): Promise<void> {
    if (urlLat && urlLon) {
      this.setState((prev) => ({
        ...prev,
        lat: parseFloat(urlLat),
        lon: parseFloat(urlLon),
      }));
      return;
    }

    try {
      const coords = await LocationService.getLocationWithFallback();
      this.setState((prev) => ({
        ...prev,
        lat: coords.lat,
        lon: coords.lon,
      }));
    } catch (error) {
      // Use default location (already set in initial state)
      console.warn('Failed to get location, using default');
    }
  }

  /**
   * Handle location selection from search
   */
  async handleLocationSelect(lat: number, lon: number, name: string): Promise<void> {
    this.setState((prev) => ({
      ...prev,
      selectedLocation: { name, lat, lon },
      lat,
      lon,
      zoom: 12,
    }));

    await this.fetchWeatherForLocation(lat, lon);
  }

  /**
   * Handle map click
   */
  async handleMapClick(lat: number, lon: number): Promise<void> {
    this.setState((prev) => ({
      ...prev,
      selectedLocation: { name: 'Selected Location', lat, lon },
      lat,
      lon,
    }));

    await this.fetchWeatherForLocation(lat, lon);
  }

  /**
   * Fetch weather for a location
   */
  private async fetchWeatherForLocation(lat: number, lon: number): Promise<void> {
    this.setState((prev) => ({ ...prev, loadingWeather: true }));

    try {
      const data = await WeatherService.getWeatherByCoordinates(lat, lon);
      this.setState((prev) => ({
        ...prev,
        weatherInfo: data.weather,
        loadingWeather: false,
      }));
    } catch (error) {
      console.error('Failed to fetch weather:', error);
      this.setState((prev) => ({
        ...prev,
        weatherInfo: null,
        loadingWeather: false,
      }));
    }
  }

  /**
   * Update zoom level
   */
  setZoom(zoom: number): void {
    this.setState((prev) => ({ ...prev, zoom }));
  }

  /**
   * Update map center
   */
  setCenter(lat: number, lon: number): void {
    this.setState((prev) => ({ ...prev, lat, lon }));
  }

  /**
   * Update base map type
   */
  setBaseMap(baseMap: 'standard' | 'satellite' | 'terrain'): void {
    this.setState((prev) => ({ ...prev, baseMap }));
  }

  /**
   * Update weather layer
   */
  setWeatherLayer(layer: 'temperature' | 'precipitation' | 'wind' | 'clouds' | 'pressure' | null): void {
    this.setState((prev) => ({ ...prev, weatherLayer: layer }));
  }

  /**
   * Update opacity
   */
  setOpacity(opacity: number): void {
    this.setState((prev) => ({ ...prev, opacity }));
  }

  /**
   * Toggle controls visibility
   */
  toggleControls(): void {
    this.setState((prev) => ({ ...prev, showControls: !prev.showControls }));
  }

  /**
   * Toggle legend visibility
   */
  toggleLegend(): void {
    this.setState((prev) => ({ ...prev, showLegend: !prev.showLegend }));
  }

  /**
   * Clear weather info
   */
  clearWeatherInfo(): void {
    this.setState((prev) => ({
      ...prev,
      weatherInfo: null,
      selectedLocation: null,
    }));
  }

  /**
   * Set mounted state
   */
  setMounted(mounted: boolean): void {
    this.setState((prev) => ({ ...prev, mounted }));
  }

  getState(): MapState {
    return this.state;
  }
}

/**
 * Custom hook for Map ViewModel
 */
export function useMapViewModel(initialLat?: number, initialLon?: number) {
  const [state, setState] = useState<MapState>({
    lat: initialLat || 25.5941,
    lon: initialLon || 85.1376,
    zoom: 10,
    baseMap: 'satellite',
    weatherLayer: null,
    opacity: 0.7,
    showControls: true,
    showLegend: false,
    selectedLocation: null,
    weatherInfo: null,
    loadingWeather: false,
    mounted: false,
  });

  // Use useRef to persist ViewModel instance across renders
  const viewModelRef = useRef<MapViewModel | null>(null);
  if (!viewModelRef.current) {
    viewModelRef.current = new MapViewModel(state, setState);
  }
  // Update state reference in ViewModel
  viewModelRef.current.state = state;
  viewModelRef.current.setState = setState;

  const initializeLocation = useCallback(
    async (urlLat?: string | null, urlLon?: string | null) => {
      await viewModelRef.current!.initializeLocation(urlLat, urlLon);
    },
    []
  );

  const handleLocationSelect = useCallback(
    async (lat: number, lon: number, name: string) => {
      await viewModelRef.current!.handleLocationSelect(lat, lon, name);
    },
    []
  );

  const handleMapClick = useCallback(
    async (lat: number, lon: number) => {
      await viewModelRef.current!.handleMapClick(lat, lon);
    },
    []
  );

  const setZoom = useCallback((zoom: number) => {
    viewModelRef.current!.setZoom(zoom);
  }, []);

  const setCenter = useCallback((lat: number, lon: number) => {
    viewModelRef.current!.setCenter(lat, lon);
  }, []);

  const setBaseMap = useCallback((baseMap: 'standard' | 'satellite' | 'terrain') => {
    viewModelRef.current!.setBaseMap(baseMap);
  }, []);

  const setWeatherLayer = useCallback(
    (layer: 'temperature' | 'precipitation' | 'wind' | 'clouds' | 'pressure' | null) => {
      viewModelRef.current!.setWeatherLayer(layer);
    },
    []
  );

  const setOpacity = useCallback((opacity: number) => {
    viewModelRef.current!.setOpacity(opacity);
  }, []);

  const toggleControls = useCallback(() => {
    viewModelRef.current!.toggleControls();
  }, []);

  const toggleLegend = useCallback(() => {
    viewModelRef.current!.toggleLegend();
  }, []);

  const clearWeatherInfo = useCallback(() => {
    viewModelRef.current!.clearWeatherInfo();
  }, []);

  const setMounted = useCallback((mounted: boolean) => {
    viewModelRef.current!.setMounted(mounted);
  }, []);

  return {
    ...state,
    initializeLocation,
    handleLocationSelect,
    handleMapClick,
    setZoom,
    setCenter,
    setBaseMap,
    setWeatherLayer,
    setOpacity,
    toggleControls,
    toggleLegend,
    clearWeatherInfo,
    setMounted,
  };
}

