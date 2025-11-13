/**
 * Auto Location Hook
 * Automatically fetches location on mount
 */

import { useEffect, useState, useCallback } from 'react';
import { Coordinates } from '@/src/models/location.model';
import { LocationService } from '@/src/services/location.service';
import { SettingsService } from '@/src/services/settings.service';

export function useAutoLocation(
  onLocationFound: (coords: Coordinates) => void,
  enabled: boolean = true
) {
  const [hasAttempted, setHasAttempted] = useState(false);

  const tryGetLocation = useCallback(async () => {
    if (!enabled || hasAttempted) return;

    const autoLocationEnabled = SettingsService.getSetting('autoLocation');
    if (!autoLocationEnabled) {
      setHasAttempted(true);
      return;
    }

    setHasAttempted(true);

    try {
      const coords = await LocationService.getLocationWithFallback();
      if (coords) {
        onLocationFound(coords);
      }
    } catch (error) {
      console.log('Auto-location failed:', error);
    }
  }, [enabled, hasAttempted, onLocationFound]);

  useEffect(() => {
    if (enabled && !hasAttempted) {
      tryGetLocation();
    }
  }, [enabled, hasAttempted, tryGetLocation]);

  return {
    hasAttempted,
    retry: () => {
      setHasAttempted(false);
      tryGetLocation();
    },
  };
}

