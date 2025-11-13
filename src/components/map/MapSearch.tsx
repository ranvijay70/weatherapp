/**
 * Map Search Component
 * Search for locations on the map
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { LocationSuggestion } from '@/src/models/location.model';
import { LocationService } from '@/src/services/location.service';
import { SEARCH_DEBOUNCE_MS, MIN_SEARCH_LENGTH, MAX_SUGGESTIONS } from '@/src/utils/constants';
import { Input } from '@/src/components/ui/Input';
import { GLASSMORPHISM, COLORS, SPACING } from '@/src/utils/theme';

export interface MapSearchProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void;
}

export const MapSearch: React.FC<MapSearchProps> = ({ onLocationSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = searchTerm.trim();
    if (q.length < MIN_SEARCH_LENGTH) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    const id = setTimeout(async () => {
      try {
        const list = await LocationService.searchLocations(q, MAX_SUGGESTIONS);
        setSuggestions(list);
        setOpen(list.length > 0);
      } catch (e) {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(id);
  }, [searchTerm]);

  const handleSelect = (suggestion: LocationSuggestion) => {
    setSearchTerm(suggestion.name);
    setOpen(false);
    onLocationSelect(suggestion.lat, suggestion.lon, suggestion.name);
    inputRef.current?.blur();
  };

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        type="search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search location..."
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
        }}
        onBlur={() => {
          // Delay to allow click on suggestion
          setTimeout(() => setOpen(false), 200);
        }}
      />
      {open && (suggestions.length > 0 || loading) && (
        <div className={`absolute z-50 mt-2 w-full ${GLASSMORPHISM.roundedSmall} ${GLASSMORPHISM.borderMedium} bg-slate-900/95 ${GLASSMORPHISM.blur} ${COLORS.textPrimary} ${GLASSMORPHISM.shadow} max-h-60 overflow-auto`}>
          {loading && (
            <div className={`px-4 py-3 text-sm ${COLORS.textTertiary}`}>Searching...</div>
          )}
          {!loading && suggestions.map((s, i) => (
            <button
              key={`${s.name}-${s.lat}-${s.lon}-${i}`}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelect(s);
              }}
              className={`w-full text-left px-4 py-3 ${GLASSMORPHISM.bgHover} ${GLASSMORPHISM.transitionFast}`}
            >
              <span className="font-medium">{s.name}</span>
              <span className={COLORS.textTertiary}>
                {s.state ? `, ${s.state}` : ''}{s.country ? `, ${s.country}` : ''}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

