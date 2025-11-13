/**
 * Application Constants
 */

export const API_ENDPOINTS = {
  WEATHER: '/api/weather',
  GEOCODE: '/api/geocode',
} as const;

export const IP_LOCATION_API = 'https://ipapi.co/json/';

export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 300000, // 5 minutes
} as const;

export const SEARCH_DEBOUNCE_MS = 500;
export const MIN_SEARCH_LENGTH = 2;
export const MAX_SUGGESTIONS = 5;

export const STORAGE_KEYS = {
  TEMPERATURE_UNIT: 'temperatureUnit',
  THEME: 'theme',
  AUTO_LOCATION: 'autoLocation',
  NOTIFICATIONS: 'notifications',
} as const;

