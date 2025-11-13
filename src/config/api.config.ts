/**
 * Centralized API Configuration
 * Single source of truth for API keys, URLs, and endpoints
 * 
 * All configuration values come from environment variables only (no hardcoded defaults)
 * This ensures proper configuration management across different environments
 */

/**
 * Get environment variable value
 * @param key - Environment variable key
 * @param defaultValue - Optional default value (only used for optional configs)
 * @returns Environment variable value
 * @throws Error if required variable is missing (server-side only)
 */
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
  // This prevents client-side code from accessing env vars
  return defaultValue || '';
};

/**
 * OpenWeather API Configuration Type
 */
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

// Cache for configuration (lazy-loaded)
let cachedConfig: OpenWeatherConfig | null = null;

/**
 * Get OpenWeather API configuration
 * Lazy-loads configuration to avoid client-side evaluation
 * All values come from environment variables (no hardcoded defaults for required values)
 * 
 * @returns OpenWeatherConfig object
 */
const getOpenWeatherConfig = (): OpenWeatherConfig => {
  // Return cached config if already loaded
  if (cachedConfig) {
    return cachedConfig;
  }

  // Client-side guard: return placeholder (should never be used)
  // API client functions should prevent client-side usage
  if (typeof window !== 'undefined') {
    cachedConfig = {
      BASE_URL: '', // Placeholder - should not be used
      GEO_BASE_URL: '', // Placeholder - should not be used
      API_KEY: '', // Placeholder - should not be used
      TIMEOUT: 10000,
      RETRY_CONFIG: {
        retries: 3,
        retryDelay: 1000,
      },
    };
    return cachedConfig;
  }

  // Server-side: Load configuration from environment variables only
  // Required variables will throw error if missing
  cachedConfig = {
    BASE_URL: getEnvVar('OPENWEATHER_BASE_URL'), // Required - no default
    GEO_BASE_URL: getEnvVar('OPENWEATHER_GEO_BASE_URL', 'https://api.openweathermap.org/geo/1.0'), // Optional - has sensible default
    API_KEY: getEnvVar('OPENWEATHER_API_KEY'), // Required - no default
    TIMEOUT: 10000, // 10 seconds - hardcoded as it's a constant
    RETRY_CONFIG: {
      retries: 3, // Hardcoded as it's a constant
      retryDelay: 1000, // Hardcoded as it's a constant
    },
  };
  return cachedConfig;
};

/**
 * OpenWeather API Configuration Proxy
 * 
 * Uses Proxy to lazy-load configuration only when properties are accessed.
 * This prevents environment variable access during module evaluation,
 * which is important for Next.js client/server boundary.
 * 
 * Usage:
 *   const baseUrl = OPENWEATHER_CONFIG.BASE_URL;
 *   const apiKey = OPENWEATHER_CONFIG.API_KEY;
 */
export const OPENWEATHER_CONFIG = new Proxy({} as OpenWeatherConfig, {
  get(target, prop) {
    const config = getOpenWeatherConfig();
    return config[prop as keyof OpenWeatherConfig];
  },
});

// Re-export client-safe constants (no environment variables)
export { IP_LOCATION_API, API_ENDPOINTS, CLIENT_API_ROUTES } from './api.constants';

