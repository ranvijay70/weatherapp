
export type TemperatureUnit = 'metric' | 'imperial';

export interface AppSettings {
  temperatureUnit: TemperatureUnit;
  autoLocation: boolean;
  notifications: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  temperatureUnit: 'metric',
  autoLocation: true,
  notifications: false,
};

