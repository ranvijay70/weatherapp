/**
 * Settings Service
 * Handles settings storage and retrieval
 */

import { AppSettings, DEFAULT_SETTINGS } from '@/src/models/settings.model';
import { STORAGE_KEYS } from '@/src/utils/constants';

export class SettingsService {
  /**
   * Load settings from localStorage
   */
  static loadSettings(): AppSettings {
    if (typeof window === 'undefined') {
      return DEFAULT_SETTINGS;
    }

    try {
      const temperatureUnit = (localStorage.getItem(STORAGE_KEYS.TEMPERATURE_UNIT) ||
        DEFAULT_SETTINGS.temperatureUnit) as AppSettings['temperatureUnit'];
      const autoLocation =
        localStorage.getItem(STORAGE_KEYS.AUTO_LOCATION) !== null
          ? localStorage.getItem(STORAGE_KEYS.AUTO_LOCATION) === 'true'
          : DEFAULT_SETTINGS.autoLocation;
      const notifications =
        localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) !== null
          ? localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) === 'true'
          : DEFAULT_SETTINGS.notifications;

      return {
        temperatureUnit,
        autoLocation,
        notifications,
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return DEFAULT_SETTINGS;
    }
  }

  /**
   * Save settings to localStorage
   */
  static saveSettings(settings: Partial<AppSettings>): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      if (settings.temperatureUnit !== undefined) {
        localStorage.setItem(STORAGE_KEYS.TEMPERATURE_UNIT, settings.temperatureUnit);
      }
      if (settings.autoLocation !== undefined) {
        localStorage.setItem(STORAGE_KEYS.AUTO_LOCATION, settings.autoLocation.toString());
      }
      if (settings.notifications !== undefined) {
        localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, settings.notifications.toString());
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }

  /**
   * Get a specific setting value
   */
  static getSetting<K extends keyof AppSettings>(key: K): AppSettings[K] {
    const settings = this.loadSettings();
    return settings[key];
  }

  /**
   * Update a specific setting
   */
  static updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    this.saveSettings({ [key]: value });
  }
}

