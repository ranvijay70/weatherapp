/**
 * Settings Models
 * Contains all data structures related to app settings
 */

export type TemperatureUnit = 'metric' | 'imperial';
export type Theme = 'dark' | 'light' | 'auto';

export interface AppSettings {
  temperatureUnit: TemperatureUnit;
  theme: Theme;
  autoLocation: boolean;
  notifications: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  temperatureUnit: 'metric',
  theme: 'dark',
  autoLocation: true,
  notifications: false,
};

