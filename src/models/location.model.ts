/**
 * Location Models
 * Contains all data structures related to location
 */

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface LocationSuggestion {
  name: string;
  state?: string;
  country?: string;
  lat: number;
  lon: number;
}

export interface IPLocationData {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

