/**
 * SearchBar View Component
 * Reusable and responsive search bar with location suggestions
 */

'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import { LocationSuggestion } from '@/src/models/location.model';
import { LocationService } from '@/src/services/location.service';
import { SEARCH_DEBOUNCE_MS, MIN_SEARCH_LENGTH, MAX_SUGGESTIONS } from '@/src/utils/constants';
import { Input } from '@/src/components/ui/Input';
import { Button } from '@/src/components/ui/Button';
import { GLASSMORPHISM, SPACING, COLORS } from '@/src/utils/theme';

export interface SearchBarViewProps {
  onSearch: (city: string) => void;
  onLocationSearch: (lat: number, lon: number) => void;
  isLoading?: boolean;
}

export const SearchBarView: React.FC<SearchBarViewProps> = ({
  onSearch,
  onLocationSearch,
  isLoading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loadingSuggest, setLoadingSuggest] = useState(false);
  const [open, setOpen] = useState(false);
  const cacheRef = useRef<Map<string, LocationSuggestion[]>>(new Map());
  const suppressOpenRef = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Debounced suggestion fetch
  useEffect(() => {
    const q = searchTerm.trim();
    if (suppressOpenRef.current) {
      suppressOpenRef.current = false;
      return;
    }
    if (q.length < MIN_SEARCH_LENGTH) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    const cached = cacheRef.current.get(q.toLowerCase());
    if (cached) {
      setSuggestions(cached);
      setOpen(true);
      return;
    }

    setLoadingSuggest(true);
    const id = setTimeout(async () => {
      try {
        const list = await LocationService.searchLocations(q, MAX_SUGGESTIONS);
        cacheRef.current.set(q.toLowerCase(), list);
        setSuggestions(list);
        setOpen(true);
      } catch (e) {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoadingSuggest(false);
      }
    }, SEARCH_DEBOUNCE_MS);
    
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
    LocationService.getCurrentLocation()
      .then((coords) => {
        onLocationSearch(coords.lat, coords.lon);
      })
      .catch((error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please enable location services.');
      });
  };

  const handleSelectSuggestion = (s: LocationSuggestion) => {
    suppressOpenRef.current = true;
    setSearchTerm(s.name);
    setSuggestions([]);
    setOpen(false);
    onLocationSearch(s.lat, s.lon);
    inputRef.current?.blur();
  };

  return (
    <div className="mb-6 sm:mb-8 w-full">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a city..."
            inputMode="search"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
            aria-label="Search for a city"
            disabled={isLoading}
            onFocus={() => {
              if (suggestions.length > 0) setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(false);
            }}
          />
          {open && (suggestions.length > 0 || loadingSuggest) && (
            <div className={`absolute z-20 mt-2 w-full ${GLASSMORPHISM.roundedSmall} ${GLASSMORPHISM.borderMedium} bg-slate-900/90 ${GLASSMORPHISM.blur} ${COLORS.textPrimary} ${GLASSMORPHISM.shadow} max-h-72 overflow-auto`}>
              {loadingSuggest && (
                <div className={`px-4 py-3 text-sm ${COLORS.textTertiary}`}>Searching…</div>
              )}
              {!loadingSuggest && suggestions.map((s, i) => (
                <button
                  key={`${s.name}-${s.lat}-${s.lon}-${i}`}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    handleSelectSuggestion(s);
                  }}
                  className={`w-full text-left px-4 py-3 ${GLASSMORPHISM.bgHover} focus:bg-white/10 ${GLASSMORPHISM.transitionFast}`}
                >
                  <span className="font-medium">{s.name}</span>
                  <span className={COLORS.textTertiary}>
                    {s.state ? `, ${s.state}` : ''}{s.country ? `, ${s.country}` : ''}
                  </span>
                </button>
              ))}
              {!loadingSuggest && suggestions.length === 0 && (
                <div className={`px-4 py-3 text-sm ${COLORS.textTertiary}`}>No results</div>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-3 sm:gap-4">
          <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-none">
            Search
          </Button>
          <Button
            type="button"
            onClick={handleLocationClick}
            disabled={isLoading}
            className="flex-1 sm:flex-none"
            aria-label="Use current location"
          >
            <span className="sm:hidden text-xl">📍</span>
            <span className="hidden sm:inline">📍 Use Location</span>
          </Button>
        </div>
      </form>
    </div>
  );
};

