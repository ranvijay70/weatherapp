/**
 * Settings ViewModel
 * Manages settings-related state and business logic
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AppSettings } from '@/src/models/settings.model';
import { SettingsService } from '@/src/services/settings.service';

export interface SettingsState {
  settings: AppSettings;
  isLoading: boolean;
}

export class SettingsViewModel {
  private _state: SettingsState;
  private _setState: React.Dispatch<React.SetStateAction<SettingsState>>;

  constructor(
    state: SettingsState,
    setState: React.Dispatch<React.SetStateAction<SettingsState>>
  ) {
    this._state = state;
    this._setState = setState;
  }

  /**
   * Update state reference (for hook usage)
   */
  updateStateRef(state: SettingsState, setState: React.Dispatch<React.SetStateAction<SettingsState>>): void {
    this._state = state;
    this._setState = setState;
  }

  /**
   * Load settings from storage
   */
  loadSettings(): void {
    const loadedSettings = SettingsService.loadSettings();
    this._setState((prev) => ({
      ...prev,
      settings: loadedSettings,
      isLoading: false,
    }));
  }

  /**
   * Update settings
   */
  updateSettings(newSettings: Partial<AppSettings>): void {
    SettingsService.saveSettings(newSettings);
    this._setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings },
    }));
  }

  /**
   * Update a specific setting
   */
  updateSetting<K extends keyof AppSettings>(key: K, value: AppSettings[K]): void {
    SettingsService.updateSetting(key, value);
    this._setState((prev) => ({
      ...prev,
      settings: { ...prev.settings, [key]: value },
    }));
  }

  /**
   * Reset settings to defaults
   */
  resetSettings(): void {
    const defaultSettings = SettingsService.loadSettings();
    SettingsService.saveSettings(defaultSettings);
    this._setState((prev) => ({
      ...prev,
      settings: defaultSettings,
    }));
  }

  /**
   * Handle storage change event
   */
  handleStorageChange(e: StorageEvent): void {
    if (e.key && ['temperatureUnit', 'autoLocation', 'notifications'].includes(e.key)) {
      const updatedSettings = SettingsService.loadSettings();
      this._setState((prev) => ({
        ...prev,
        settings: updatedSettings,
      }));
    }
  }

  getState(): SettingsState {
    return this._state;
  }
}

/**
 * Custom hook for Settings ViewModel
 */
export function useSettingsViewModel() {
  const [state, setState] = useState<SettingsState>({
    settings: SettingsService.loadSettings(),
    isLoading: true,
  });

  // Use useRef to persist ViewModel instance across renders
  const viewModelRef = useRef<SettingsViewModel | null>(null);
  if (!viewModelRef.current) {
    viewModelRef.current = new SettingsViewModel(state, setState);
  }
  // Update state reference in ViewModel
  viewModelRef.current.updateStateRef(state, setState);

  // Load settings on mount
  useEffect(() => {
    viewModelRef.current!.loadSettings();
  }, []);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      viewModelRef.current!.handleStorageChange(e);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    viewModelRef.current!.updateSettings(newSettings);
  }, []);

  const updateSetting = useCallback(<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    viewModelRef.current!.updateSetting(key, value);
  }, []);

  const resetSettings = useCallback(() => {
    viewModelRef.current!.resetSettings();
  }, []);

  return {
    settings: state.settings,
    isLoading: state.isLoading,
    updateSettings,
    updateSetting,
    resetSettings,
  };
}

