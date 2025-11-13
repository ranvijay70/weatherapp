/**
 * Location Service
 * Handles location-related API calls
 */

import { Coordinates, LocationSuggestion, IPLocationData } from '@/src/models/location.model';
import { API_ENDPOINTS, IP_LOCATION_API, GEOLOCATION_OPTIONS } from '@/src/utils/constants';
import { CLIENT_API_ROUTES } from '@/src/config/api.constants';

export class LocationService {
  /**
   * Get user's current location using browser geolocation
   */
  static async getCurrentLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        GEOLOCATION_OPTIONS
      );
    });
  }

  /**
   * Get location based on IP address (fallback)
   */
  static async getLocationByIP(): Promise<IPLocationData> {
    try {
      const response = await fetch(IP_LOCATION_API);
      if (!response.ok) {
        throw new Error('Failed to fetch IP location');
      }
      const data = await response.json();
      
      if (!data.latitude || !data.longitude) {
        throw new Error('Invalid IP location data');
      }

      return {
        latitude: data.latitude,
        longitude: data.longitude,
        city: data.city,
        country: data.country_name,
      };
    } catch (error) {
      throw new Error(`IP location error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search for location suggestions
   */
  static async searchLocations(query: string, limit: number = 5): Promise<LocationSuggestion[]> {
    try {
      const response = await fetch(`${CLIENT_API_ROUTES.GEOCODE}?q=${encodeURIComponent(query)}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch location suggestions');
      }
      const data = await response.json();
      return Array.isArray(data?.suggestions) ? data.suggestions : [];
    } catch (error) {
      console.error('Location search error:', error);
      return [];
    }
  }

  /**
   * Try to get location with fallback
   */
  static async getLocationWithFallback(): Promise<Coordinates> {
    try {
      // First try browser geolocation
      return await this.getCurrentLocation();
    } catch (error) {
      // Fallback to IP-based location
      console.log('Geolocation failed, trying IP-based location...');
      try {
        const ipData = await this.getLocationByIP();
        return {
          lat: ipData.latitude,
          lon: ipData.longitude,
        };
      } catch (ipError) {
        throw new Error('Unable to determine location');
      }
    }
  }
}

