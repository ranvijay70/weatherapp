/**
 * Settings ViewModel
 * Manages settings-related state and business logic
 */

import { useState, useEffect, useCallback } from 'react';
import { AppSettings } from '@/src/models/settings.model';
import { SettingsService } from '@/src/services/settings.service';

export function useSettingsViewModel() {
  const [settings, setSettings] = useState<AppSettings>(() => SettingsService.loadSettings());
  const [isLoading, setIsLoading] = useState(true);

  // Load settings on mount
  useEffect(() => {
    const loadedSettings = SettingsService.loadSettings();
    setSettings(loadedSettings);
    setIsLoading(false);
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && ['temperatureUnit', 'autoLocation', 'notifications'].includes(e.key)) {
        const updatedSettings = SettingsService.loadSettings();
        setSettings(updatedSettings);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    SettingsService.saveSettings(newSettings);
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  const updateSetting = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    SettingsService.updateSetting(key, value);
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  const resetSettings = useCallback(() => {
    SettingsService.saveSettings(SettingsService.loadSettings());
    setSettings(SettingsService.loadSettings());
  }, []);

  return {
    settings,
    isLoading,
    updateSettings,
    updateSetting,
    resetSettings,
  };
}

