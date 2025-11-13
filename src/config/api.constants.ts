/**
 * API Constants
 * Client-safe constants that don't require environment variables
 */

// IP Location API (fallback)
export const IP_LOCATION_API = 'https://ipapi.co/json/';

// API Endpoints (relative to base URLs)
export const API_ENDPOINTS = {
  WEATHER: '/weather',
  FORECAST: '/forecast',
  AIR_POLLUTION: '/air_pollution',
  GEOCODE_DIRECT: '/direct',
} as const;

// Client-side API routes (Next.js API routes)
export const CLIENT_API_ROUTES = {
  WEATHER: '/api/weather',
  GEOCODE: '/api/geocode',
} as const;

