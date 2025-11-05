'use client';

import { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (city.trim()) {
      onSearch(city.trim());
      setCity('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto mb-8">
      <div className="relative">
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
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2
                   bg-white/20 hover:bg-white/30 text-white rounded-full
                   transition-all duration-200 backdrop-blur-md"
        >
          Search
        </button>
      </div>
      <div className="absolute inset-0 -z-10 blur-xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-full"></div>
    </form>
  );
}