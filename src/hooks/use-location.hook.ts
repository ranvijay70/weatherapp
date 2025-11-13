/**
 * Location Hook
 * Handles location-related logic
 */

import { useState, useCallback } from 'react';
import { Coordinates } from '@/src/models/location.model';
import { LocationService } from '@/src/services/location.service';

export function useLocation() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async (): Promise<Coordinates | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const coords = await LocationService.getCurrentLocation();
      return coords;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getLocationWithFallback = useCallback(async (): Promise<Coordinates | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const coords = await LocationService.getLocationWithFallback();
      return coords;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get location';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getCurrentLocation,
    getLocationWithFallback,
  };
}

