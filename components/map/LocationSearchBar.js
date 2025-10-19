"use client";

import { useRef, useState, useEffect } from 'react';
import { Search, MapPin, X } from 'lucide-react';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

/**
 * LocationSearchBar Component
 * Uses Mapbox Geocoding API to search for locations
 */
export default function LocationSearchBar({ onLocationSelect, placeholder = "Search for a location..." }) {
  const [query, setQuery] = useState('');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef(null);
  const wrapperRef = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Search for locations using Mapbox Geocoding API
  const searchLocations = async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchQuery)}.json?access_token=${MAPBOX_TOKEN}&types=address,place,locality,neighborhood,poi&limit=5`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch locations');
      }

      const data = await response.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error fetching locations:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with debouncing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for search
    timeoutRef.current = setTimeout(() => {
      searchLocations(value);
    }, 300);
  };

  // Handle suggestion selection
  const handleSelectSuggestion = (feature) => {
    const [lng, lat] = feature.center;
    const location = {
      lat,
      lng,
      address: feature.place_name,
      placeId: feature.id,
    };

    setSelectedPlace(location);
    setQuery(feature.place_name);
    setSuggestions([]);
    setShowSuggestions(false);
    onLocationSelect?.(location);
  };

  const handleClear = () => {
    setQuery('');
    setSelectedPlace(null);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="animate-spin h-4 w-4 border-2 border-[#0078d4] border-t-transparent rounded-full"></div>
            Searching...
          </div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto z-50">
          {suggestions.map((feature) => (
            <button
              key={feature.id}
              onClick={() => handleSelectSuggestion(feature)}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-start gap-2 border-b border-gray-100 last:border-b-0"
            >
              <MapPin size={16} className="text-[#0078d4] mt-1 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 truncate">{feature.text}</p>
                <p className="text-xs text-gray-600 truncate">{feature.place_name}</p>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Selected place info */}
      {selectedPlace && (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
          <MapPin size={16} className="text-[#0078d4] mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">
              {selectedPlace.address}
            </p>
            <p className="text-xs text-gray-600">
              {selectedPlace.lat.toFixed(6)}, {selectedPlace.lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
