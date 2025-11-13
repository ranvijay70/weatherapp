/**
 * Home Page - Refactored with MVVM pattern and Glassmorphism
 */

'use client';

import { useCallback } from 'react';
import { useWeatherViewModel } from '@/src/viewmodels/weather.viewmodel';
import { useAutoLocation } from '@/src/hooks/use-auto-location.hook';
import { SearchBarView } from '@/src/components/weather/SearchBar.view';
import WeatherDisplay from '@/src/components/weather/WeatherDisplay.view';
import LoadingSpinner from '@/src/components/ui/LoadingSpinner.view';
import NoDataFound from '@/src/components/ui/no-data-found';
import AppBar from '@/src/components/layout/AppBar.view';
import { COLORS, TYPOGRAPHY, LAYOUT, GLASSMORPHISM } from '@/src/utils/theme';

export default function Home() {
  const {
    weather: weatherData,
    forecast: forecastData,
    aqi: aqiData,
    loading,
    error,
    fetchWeatherByCity,
    fetchWeatherByCoordinates,
    clearError,
  } = useWeatherViewModel();

  const handleLocationSearch = useCallback(
    (lat: number, lon: number) => {
      fetchWeatherByCoordinates(lat, lon);
    },
    [fetchWeatherByCoordinates]
  );

  const handleSearch = useCallback(
    (city: string) => {
      fetchWeatherByCity(city);
    },
    [fetchWeatherByCity]
  );

  // Auto-load location on mount
  const handleAutoLocation = useCallback(
    (coords: { lat: number; lon: number }) => {
      handleLocationSearch(coords.lat, coords.lon);
    },
    [handleLocationSearch]
  );

  useAutoLocation(handleAutoLocation);

  return (
    <main className={`min-h-screen ${LAYOUT.containerPadding} ${COLORS.bgGradient}`}>
      <div className={`${LAYOUT.containerMaxWidth} mx-auto`}>
        {/* Header with AppBar on the right */}
        <div className={`mb-6 sm:mb-8`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 sm:gap-6 mb-4 sm:mb-6">
            <h1 className={`${TYPOGRAPHY.heading1} ${COLORS.textPrimary} drop-shadow-lg text-center sm:text-left`}>
          Weather Forecast
        </h1>
            <div className="w-full sm:w-auto">
              <AppBar />
            </div>
          </div>
        </div>
        
        <SearchBarView
          onSearch={handleSearch} 
          onLocationSearch={handleLocationSearch}
          isLoading={loading}
        />
        
        {error ? (
          <div className={`text-center ${COLORS.textError} ${LAYOUT.sectionSpacing} flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-2`}>
            <span className={TYPOGRAPHY.bodySmall}>{error}</span>
            <button 
              onClick={clearError}
              className={`px-4 py-2 sm:py-2.5 ${GLASSMORPHISM.bgLight} ${GLASSMORPHISM.bgHover} ${GLASSMORPHISM.bgActive} ${GLASSMORPHISM.roundedFull} ${TYPOGRAPHY.bodySmall} ${GLASSMORPHISM.transitionFast} focus:outline-none focus:ring-2 focus:ring-white/50 min-h-[40px] touch-manipulation`}
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <div className={`text-center ${LAYOUT.sectionSpacing}`}>
            <LoadingSpinner />
          </div>
        ) : weatherData ? (
          <WeatherDisplay weather={weatherData} forecast={forecastData} aqi={aqiData} />
        ) : (
          <NoDataFound displayMessage="No weather data available. Search for a city to get started!" />
        )}
      </div>
    </main>
  );
}
