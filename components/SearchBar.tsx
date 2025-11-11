'use client';

import { useState, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: (lat: number, lon: number) => void;
}

export default function SearchBar({ onSearch, onLocationSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearch = searchTerm.trim();
    if (trimmedSearch) {
      onSearch(trimmedSearch);
      setSearchTerm('');
    }
  };

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          onLocationSearch(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to retrieve your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  return (
    <div className="mb-6 sm:mb-8 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a city..."
            className="w-full px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-3 sm:gap-4">
          <button
            type="submit"
            className="flex-1 sm:flex-none px-6 py-3 sm:py-3.5 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm border border-white/20 rounded-lg text-white font-medium text-base sm:text-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/50 whitespace-nowrap min-h-[48px] touch-manipulation"
          >
            Search
          </button>
          <button
            type="button"
            onClick={handleLocationClick}
            className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-3.5 bg-white/20 hover:bg-white/30 active:bg-white/40 backdrop-blur-sm border border-white/20 rounded-lg text-white font-medium text-base sm:text-lg transition-all focus:outline-none focus:ring-2 focus:ring-white/50 whitespace-nowrap min-h-[48px] touch-manipulation"
            aria-label="Use current location"
          >
            <span className="sm:hidden text-xl">📍</span>
            <span className="hidden sm:inline">📍 Use Location</span>
          </button>
        </div>
      </form>
    </div>
  );
}

