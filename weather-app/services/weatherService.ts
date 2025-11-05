import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_OPENWEATHER_BASE_URL;

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

export const getWeatherData = async (city: string, units: 'metric' | 'imperial' = 'metric') => {
  try {
    const response = await axios.get(
      `${BASE_URL}/weather?q=${city}&units=${units}&appid=${API_KEY}`
    );
    return response.data as WeatherData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to fetch weather data');
    }
    throw new Error('Failed to fetch weather data');
  }
};

export const getForecastData = async (city: string, units: 'metric' | 'imperial' = 'metric') => {
  try {
    const response = await axios.get(
      `${BASE_URL}/forecast?q=${city}&units=${units}&appid=${API_KEY}`
    );
    return response.data as ForecastData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.message || 'Failed to fetch forecast data');
    }
    throw new Error('Failed to fetch forecast data');
  }
};