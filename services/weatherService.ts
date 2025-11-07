import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL;

if (!API_KEY || !BASE_URL) {
  console.error('OpenWeather API key or base URL is missing!');
}

export interface WeatherData {
  name: string;
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

export type LocationInput =
  | { type: 'city'; city: string }
  | { type: 'coordinates'; lat: number; lon: number };

// Fetch current weather
export const getWeatherData = async (
  location: LocationInput,
  units: 'metric' | 'imperial' = 'metric'
) => {
  if (!API_KEY || !BASE_URL) {
    throw new Error('API key or Base URL is missing!');
  }

  const endpoint = location.type === 'city'
    ? `${BASE_URL}/weather?q=${encodeURIComponent(location.city)}&appid=${API_KEY}&units=${units}`
    : `${BASE_URL}/weather?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=${units}`;

  try {
    const response = await axios.get(endpoint);
    return response.data as WeatherData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch weather data'
      );
    }
    throw new Error('Failed to fetch weather data');
  }
};

// Fetch forecast
export const getForecastData = async (
  location: LocationInput,
  units: 'metric' | 'imperial' = 'metric'
) => {
  if (!API_KEY || !BASE_URL) {
    throw new Error('API key or Base URL is missing!');
  }

  const endpoint = location.type === 'city'
    ? `${BASE_URL}/forecast?q=${encodeURIComponent(location.city)}&appid=${API_KEY}&units=${units}`
    : `${BASE_URL}/forecast?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=${units}`;

  try {
    const response = await axios.get(endpoint);
    return response.data as ForecastData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || 'Failed to fetch forecast data'
      );
    }
    throw new Error('Failed to fetch forecast data');
  }
};
