'use client';

import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: (lat: number, lon: number) => void;
}

export default function SearchBar({ onSearch, onLocationSearch }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      setError('');
      onSearch(city.trim());
      setCity('');
    }
  };

  const handleLocationClick = async () => {
    setError('');
    setIsLoading(true);
    
    try {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      onLocationSearch(latitude, longitude);
    } catch (err: any) {
      setError(err.message === 'User denied Geolocation'
        ? 'Please enable location access to use this feature'
        : 'Unable to get your location. Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative max-w-xl mx-auto mb-8">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city name..."
            className="w-full px-6 py-4 text-lg bg-white/10 backdrop-blur-md 
                     text-white placeholder-white/60 rounded-full outline-none
                     border-2 border-white/20 focus:border-white/40 transition-all
                     shadow-lg"
          />
          <button
            type="button"
            onClick={handleLocationClick}
            disabled={isLoading}
            className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full
                     transition-all duration-200 backdrop-blur-md flex items-center gap-2"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="hidden sm:inline">Use Location</span>
              </>
            )}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-white/20 hover:bg-white/30 text-white rounded-full
                     transition-all duration-200 backdrop-blur-md"
          >
            Search
          </button>
        </div>
        {error && (
          <p className="absolute -bottom-8 left-0 text-red-400 text-sm px-2">
            {error}
          </p>
        )}
      </form>
      <div className="absolute inset-0 -z-10 blur-xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full"></div>
    </div>
  );
}