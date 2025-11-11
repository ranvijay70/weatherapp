'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onLocationSearch: (lat: number, lon: number) => void;
}

export default function SearchBar({ onSearch, onLocationSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ name: string; state?: string; country?: string; lat: number; lon: number }>>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [open, setOpen] = useState(false);
  const cacheRef = useRef<Map<string, any[]>>(new Map());
  const suppressOpenRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Debounced suggestion fetch (geocoding). Does NOT call weather API.
  useEffect(() => {
    const q = searchTerm.trim();
    if (suppressOpenRef.current) {
      suppressOpenRef.current = false;
      return; // prevent reopening immediately after a programmatic selection
    }
    if (q.length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const cached = cacheRef.current.get(q.toLowerCase());
    if (cached) {
      setSuggestions(cached as any[]);
      setOpen(true);
      return;
    }

    setLoadingSuggest(true);
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(q)}&limit=5`);
        const data = await res.json();
        const list = Array.isArray(data?.suggestions) ? data.suggestions : [];
        cacheRef.current.set(q.toLowerCase(), list);
        setSuggestions(list);
        setOpen(true);
      } catch (e) {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoadingSuggest(false);
      }
    }, 500);
    return () => clearTimeout(id);
  }, [searchTerm]);

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

  const handleSelectSuggestion = (s: { name: string; lat: number; lon: number }) => {
    suppressOpenRef.current = true;
    setSearchTerm(s.name);
    setSuggestions([]);
    setOpen(false);
    // Use coordinates for best accuracy
    onLocationSearch(s.lat, s.lon);
    inputRef.current?.blur();
  };

  return (
    <div className="mb-6 sm:mb-8 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <input
            type="search"
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a city..."
            className="w-full min-w-0 px-4 py-3 sm:py-3.5 text-base sm:text-lg rounded-lg bg-white/15 backdrop-blur-sm border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-white/60 focus:border-transparent transition-all"
            inputMode="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            aria-label="Search for a city"
            onFocus={() => {
              if (suggestions.length > 0) setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(false);
            }}
          />
          {open && (suggestions.length > 0 || loadingSuggest) && (
            <div className="absolute z-20 mt-2 w-full rounded-lg border border-white/20 bg-slate-900/90 backdrop-blur-md text-white shadow-xl max-h-72 overflow-auto">
              {loadingSuggest && (
                <div className="px-4 py-3 text-sm text-gray-300">Searching…</div>
              )}
              {!loadingSuggest && suggestions.map((s, i) => (
                <button
                  key={`${s.name}-${s.lat}-${s.lon}-${i}`}
                  type="button"
                  onMouseDown={(e) => {
                    // handle on mousedown to avoid input blur race
                    e.preventDefault();
                    handleSelectSuggestion(s);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-white/10 focus:bg-white/10 transition-colors"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-gray-300">{s.state ? `, ${s.state}` : ''}{s.country ? `, ${s.country}` : ''}</span>
                </button>
              ))}
              {!loadingSuggest && suggestions.length === 0 && (
                <div className="px-4 py-3 text-sm text-gray-300">No results</div>
              )}
            </div>
          )}
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

