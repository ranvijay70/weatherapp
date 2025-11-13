/**
 * Weather Models
 * Contains all data structures related to weather
 */

export interface WeatherData {
  name: string;
  coord?: {
    lat: number;
    lon: number;
  };
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure?: number;
    temp_min?: number;
    temp_max?: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind?: {
    speed: number;
    deg: number;
  };
  visibility?: number;
  dt?: number;
}

export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure?: number;
    temp_min?: number;
    temp_max?: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind?: {
    speed: number;
    deg: number;
  };
  dt_txt: string;
}

export interface ForecastData {
  list: ForecastItem[];
  city?: {
    name: string;
    country: string;
    coord: {
      lat: number;
      lon: number;
    };
  };
}

export interface AQIComponent {
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

export interface AQIData {
  coord: {
    lon: number;
    lat: number;
  };
  list: Array<{
    main: {
      aqi: number; // 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
    };
    components: AQIComponent;
    dt: number;
  }>;
}

export type TemperatureUnit = 'metric' | 'imperial';

export type LocationInput =
  | { type: 'city'; city: string }
  | { type: 'coordinates'; lat: number; lon: number };

export interface WeatherResponse {
  weather: WeatherData;
  forecast: ForecastData;
  aqi: AQIData | null;
}

