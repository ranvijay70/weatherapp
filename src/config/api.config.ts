/**
 * Centralized API Configuration
 * Single source of truth for API keys, URLs, and endpoints
 */

// Environment variables - validated at runtime (only on server-side)
const getEnvVar = (key: string, defaultValue?: string): string => {
  // Only validate on server-side (Node.js environment)
  if (typeof window === 'undefined') {
    const value = process.env[key] || defaultValue;
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  }
  // On client-side, return empty string (shouldn't be used)
  return defaultValue || '';
};

// Lazy-load configuration to avoid client-side evaluation
type OpenWeatherConfig = {
  BASE_URL: string;
  GEO_BASE_URL: string;
  API_KEY: string;
  TIMEOUT: number;
  RETRY_CONFIG: {
    retries: number;
    retryDelay: number;
  };
};

let cachedConfig: OpenWeatherConfig | null = null;

const getOpenWeatherConfig = (): OpenWeatherConfig => {
  if (cachedConfig) {
    return cachedConfig;
  }

  // Only create config on server-side
  if (typeof window !== 'undefined') {
    // Client-side: return a placeholder config (shouldn't be used)
    cachedConfig = {
      BASE_URL: 'https://api.openweathermap.org/data/2.5',
      GEO_BASE_URL: 'https://api.openweathermap.org/geo/1.0',
      API_KEY: '',
      TIMEOUT: 10000,
      RETRY_CONFIG: {
        retries: 3,
        retryDelay: 1000,
      },
    };
    return cachedConfig;
  }

  // Server-side: validate and return real config
  cachedConfig = {
    BASE_URL: getEnvVar('OPENWEATHER_BASE_URL', 'https://api.openweathermap.org/data/2.5'),
    GEO_BASE_URL: 'https://api.openweathermap.org/geo/1.0',
    API_KEY: getEnvVar('OPENWEATHER_API_KEY'),
    TIMEOUT: 10000, // 10 seconds
    RETRY_CONFIG: {
      retries: 3,
      retryDelay: 1000,
    },
  };
  return cachedConfig;
};

// Export getter function instead of direct object
export const OPENWEATHER_CONFIG = new Proxy({} as OpenWeatherConfig, {
  get(target, prop) {
    const config = getOpenWeatherConfig();
    return config[prop as keyof OpenWeatherConfig];
  },
});

// Re-export constants from separate file (client-safe)
export { IP_LOCATION_API, API_ENDPOINTS, CLIENT_API_ROUTES } from './api.constants';

