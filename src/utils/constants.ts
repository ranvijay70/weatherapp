/**
 * Application Constants
 * Note: API endpoints and URLs are now centralized in src/config/api.config.ts
 */

import { IP_LOCATION_API } from '@/src/config/api.constants';

// Re-export IP_LOCATION_API for convenience
export { IP_LOCATION_API };

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
  AUTO_LOCATION: 'autoLocation',
  NOTIFICATIONS: 'notifications',
} as const;

