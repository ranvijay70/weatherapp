import axios from 'axios';

// We'll use our API route as a proxy to keep the API key secure
const API_URL = '/api/weather';

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
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    dt_txt: string;
  }>;
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
    components: {
      co: number; // Carbon monoxide
      no: number; // Nitrogen monoxide
      no2: number; // Nitrogen dioxide
      o3: number; // Ozone
      so2: number; // Sulphur dioxide
      pm2_5: number; // Fine particles
      pm10: number; // Coarse particles
      nh3: number; // Ammonia
    };
    dt: number;
  }>;
}

export type LocationInput =
  | { type: 'city'; city: string }
  | { type: 'coordinates'; lat: number; lon: number };

// Fetch weather data through our API route
export const getWeatherData = async (
  location: LocationInput,
  units: 'metric' | 'imperial' = 'metric'
) => {
  try {
    const params = location.type === 'city'
      ? { city: location.city, units }
      : { lat: location.lat, lon: location.lon, units };

    const response = await axios.get(API_URL, { params });
    return response.data.weather as WeatherData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch weather data');
    }
    throw new Error('Failed to fetch weather data');
  }
};

// Fetch forecast through our API route
export const getForecastData = async (
  location: LocationInput,
  units: 'metric' | 'imperial' = 'metric'
) => {
  try {
    const params = location.type === 'city'
      ? { city: location.city, units }
      : { lat: location.lat, lon: location.lon, units };

    const response = await axios.get(API_URL, { params });
    return response.data.forecast as ForecastData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.error || 'Failed to fetch forecast data');
    }
    throw new Error('Failed to fetch forecast data');
  }
};
