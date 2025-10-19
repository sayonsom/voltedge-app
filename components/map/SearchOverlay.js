"use client";

import { useState } from 'react';
import { Search, X, Filter, MapPin, Sliders, ChevronDown, Navigation, Zap, Server } from 'lucide-react';

const USE_CODES = [
  { value: 'A', label: 'Agricultural', icon: '🌾' },
  { value: 'R', label: 'Residential', icon: '🏠' },
  { value: 'C', label: 'Commercial', icon: '🏢' },
  { value: 'I', label: 'Industrial', icon: '🏭' },
];

const DATA_CENTER_SIZES = [
  { value: '1-10', label: '1-10 MW', description: 'Small edge data center' },
  { value: '10-50', label: '10-50 MW', description: 'Medium enterprise DC' },
  { value: '50-100', label: '50-100 MW', description: 'Large colocation DC' },
  { value: '100-500', label: '100-500 MW', description: 'Hyperscale DC' },
  { value: '500+', label: '500+ MW', description: 'Mega hyperscale DC' },
];

const FEASIBILITY_SCORES = [
  { value: 'excellent', label: 'Excellent', min: 80, color: 'bg-green-500' },
  { value: 'good', label: 'Good', min: 60, color: 'bg-blue-500' },
  { value: 'fair', label: 'Fair', min: 40, color: 'bg-yellow-500' },
  { value: 'poor', label: 'Poor', min: 0, color: 'bg-red-500' },
];

/**
 * Component for entering and parsing lat/lon coordinates
 * Supports multiple formats: decimal degrees, comma-separated, space-separated
 */
function CoordinateInput({ onNavigate }) {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [parsed, setParsed] = useState(null);

  const parseCoordinates = (text) => {
    if (!text.trim()) {
      setError('');
      setParsed(null);
      return;
    }

    // Try to parse various formats
    // Format 1: "lat, lng" or "lat,lng"
    // Format 2: "lat lng" (space separated)
    // Format 3: Just latitude and longitude numbers

    const cleaned = text.trim().replace(/[°'"]/g, ''); // Remove degree symbols

    // Try comma-separated
    let parts = cleaned.split(',').map(p => p.trim());

    // If no comma, try space-separated
    if (parts.length === 1) {
      parts = cleaned.split(/\s+/);
    }

    if (parts.length !== 2) {
      setError('Enter coordinates as: latitude, longitude');
      setParsed(null);
      return;
    }

    const lat = parseFloat(parts[0]);
    const lng = parseFloat(parts[1]);

    // Validate ranges
    if (isNaN(lat) || isNaN(lng)) {
      setError('Invalid numbers');
      setParsed(null);
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90 and 90');
      setParsed(null);
      return;
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180 and 180');
      setParsed(null);
      return;
    }

    setError('');
    setParsed({ lat, lng });
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);
    parseCoordinates(value);
  };

  const handleGo = () => {
    if (parsed) {
      onNavigate(parsed.lat, parsed.lng);
      setInput('');
      setParsed(null);
      setError('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && parsed) {
      handleGo();
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          type="text"
          placeholder="39.0458, -76.6413 or 39.0458 -76.6413"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
        />
        {parsed && (
          <button
            onClick={handleGo}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#0078d4] text-white p-1.5 rounded hover:bg-[#106ebe] transition-colors"
            title="Navigate to coordinates"
          >
            <Navigation size={14} />
          </button>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}

      {parsed && !error && (
        <div className="text-xs text-gray-600 bg-white p-2 rounded border border-gray-200">
          <div className="font-medium text-gray-900 mb-1">Ready to navigate:</div>
          <div>Latitude: {parsed.lat.toFixed(6)}</div>
          <div>Longitude: {parsed.lng.toFixed(6)}</div>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Enter coordinates in decimal degrees format
      </p>
    </div>
  );
}

export default function SearchOverlay({ onSearch, onClear, isSearching = false }) {
  const [activeTab, setActiveTab] = useState('search');
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const [filters, setFilters] = useState({
    query: '',
    min_acres: '',
    max_acres: '',
    use_codes: [],
    qoz_only: false,
    county: '',
    state: '',
    zip_code: '',
    latitude: null,
    longitude: null,
    limit: 50,
    // Data center specific filters
    dc_size: '',
    min_feasibility_score: '',
    max_powerline_distance: '',
    min_solar_capacity: '',
    min_wind_capacity: '',
    max_substation_distance: '',
    max_fiber_distance: '',
    max_offtaker_distance: '',
    flood_zone_exclude: false,
    earthquake_zone_exclude: false,
    water_access_required: false,
    min_power_availability: '',
  });

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const toggleUseCode = (code) => {
    setFilters(prev => ({
      ...prev,
      use_codes: prev.use_codes.includes(code)
        ? prev.use_codes.filter(c => c !== code)
        : [...prev.use_codes, code],
    }));
  };

  const handleSubmit = () => {
    const cleanFilters = {};
    Object.keys(filters).forEach(key => {
      const val = filters[key];
      if (val !== '' && val !== null && val !== undefined) {
        if (Array.isArray(val) && val.length > 0) cleanFilters[key] = val;
        else if (!Array.isArray(val)) cleanFilters[key] = val;
      }
    });
    onSearch?.(cleanFilters);
  };

  const handleClear = () => {
    setFilters({
      query: '',
      min_acres: '',
      max_acres: '',
      use_codes: [],
      qoz_only: false,
      county: '',
      state: '',
      zip_code: '',
      latitude: null,
      longitude: null,
      limit: 50,
      // Data center specific filters
      dc_size: '',
      min_feasibility_score: '',
      max_powerline_distance: '',
      min_solar_capacity: '',
      min_wind_capacity: '',
      max_substation_distance: '',
      max_fiber_distance: '',
      max_offtaker_distance: '',
      flood_zone_exclude: false,
      earthquake_zone_exclude: false,
      water_access_required: false,
      min_power_availability: '',
    });
    onClear?.();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const hasActiveFilters = filters.query || filters.min_acres || filters.max_acres ||
    filters.use_codes.length > 0 || filters.qoz_only || filters.county ||
    filters.state || filters.zip_code || filters.dc_size || filters.min_feasibility_score ||
    filters.max_powerline_distance || filters.min_solar_capacity || filters.min_wind_capacity ||
    filters.max_substation_distance || filters.max_fiber_distance || filters.max_offtaker_distance ||
    filters.flood_zone_exclude || filters.earthquake_zone_exclude || filters.water_access_required ||
    filters.min_power_availability;

  if (isCollapsed) {
    return (
      <div className="fixed top-4 left-20 z-20">
        <button
          onClick={() => setIsCollapsed(false)}
          className="bg-white shadow-lg rounded-full p-3 hover:shadow-xl transition-all"
        >
          <Search size={24} className="text-[#0078d4]" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed top-4 left-20 z-20 w-96">
      {/* Main Card */}
      <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
        {/* Header with Tabs */}
        <div className="flex items-center border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab('search')}
            className={`py-3 px-3 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'search'
                ? 'text-[#0078d4] border-b-2 border-[#0078d4]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Search size={14} className="inline mr-1" />
            Search
          </button>
          <button
            onClick={() => setActiveTab('datacenter')}
            className={`py-3 px-3 text-xs font-medium transition-colors whitespace-nowrap relative ${
              activeTab === 'datacenter'
                ? 'text-[#0078d4] border-b-2 border-[#0078d4]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Server size={14} className="inline mr-1" />
            Data Center
          </button>
          <button
            onClick={() => setActiveTab('filters')}
            className={`py-3 px-3 text-xs font-medium transition-colors whitespace-nowrap relative ${
              activeTab === 'filters'
                ? 'text-[#0078d4] border-b-2 border-[#0078d4]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Filter size={14} className="inline mr-1" />
            Filters
            {hasActiveFilters && (
              <span className="absolute top-2 right-1 w-2 h-2 bg-[#0078d4] rounded-full"></span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`py-3 px-3 text-xs font-medium transition-colors whitespace-nowrap ${
              activeTab === 'location'
                ? 'text-[#0078d4] border-b-2 border-[#0078d4]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MapPin size={14} className="inline mr-1" />
            Location
          </button>
          <button
            onClick={() => setIsCollapsed(true)}
            className="p-3 hover:bg-gray-100 transition-colors ml-auto"
          >
            <X size={18} className="text-gray-600" />
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          {/* Search Tab */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search by APN, owner, or address..."
                    value={filters.query}
                    onChange={(e) => handleChange('query', e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Quick Property Type Filters */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Property Type</label>
                <div className="flex flex-wrap gap-2">
                  {USE_CODES.map((uc) => (
                    <button
                      key={uc.value}
                      type="button"
                      onClick={() => toggleUseCode(uc.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        filters.use_codes.includes(uc.value)
                          ? 'bg-[#0078d4] text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {uc.icon} {uc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* QOZ Toggle */}
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={filters.qoz_only}
                  onChange={(e) => handleChange('qoz_only', e.target.checked)}
                  className="w-4 h-4 text-[#0078d4] border-gray-300 rounded focus:ring-[#0078d4]"
                />
                <span className="text-sm font-medium text-gray-700">⭐ Qualified Opportunity Zones only</span>
              </label>
            </div>
          )}

          {/* Data Center Tab */}
          {activeTab === 'datacenter' && (
            <div className="space-y-4">
              {/* Data Center Size */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Target Data Center Size</label>
                <select
                  value={filters.dc_size}
                  onChange={(e) => handleChange('dc_size', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                >
                  <option value="">Any size</option>
                  {DATA_CENTER_SIZES.map((size) => (
                    <option key={size.value} value={size.value}>
                      {size.label} - {size.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feasibility Score */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Minimum Feasibility Score</label>
                <div className="space-y-2">
                  <select
                    value={filters.min_feasibility_score}
                    onChange={(e) => handleChange('min_feasibility_score', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  >
                    <option value="">Any score</option>
                    {FEASIBILITY_SCORES.map((score) => (
                      <option key={score.value} value={score.min}>
                        {score.label} ({score.min}+)
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500">Higher scores indicate better suitability for data center development</p>
                </div>
              </div>

              {/* Power Infrastructure */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-xs font-bold text-gray-800 mb-3 flex items-center gap-1">
                  <Zap size={14} className="text-yellow-500" />
                  Power Infrastructure
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Max Distance to Power Lines (miles)</label>
                    <input
                      type="number"
                      placeholder="e.g., 5"
                      value={filters.max_powerline_distance}
                      onChange={(e) => handleChange('max_powerline_distance', e.target.value ? parseFloat(e.target.value) : '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                      step="0.1"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Max Distance to Substation (miles)</label>
                    <input
                      type="number"
                      placeholder="e.g., 10"
                      value={filters.max_substation_distance}
                      onChange={(e) => handleChange('max_substation_distance', e.target.value ? parseFloat(e.target.value) : '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                      step="0.1"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Min Power Availability (MW)</label>
                    <input
                      type="number"
                      placeholder="e.g., 50"
                      value={filters.min_power_availability}
                      onChange={(e) => handleChange('min_power_availability', e.target.value ? parseFloat(e.target.value) : '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                      step="1"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Renewable Energy */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-xs font-bold text-gray-800 mb-3">Renewable Energy Potential</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Min Solar Capacity (MW)</label>
                    <input
                      type="number"
                      placeholder="e.g., 10"
                      value={filters.min_solar_capacity}
                      onChange={(e) => handleChange('min_solar_capacity', e.target.value ? parseFloat(e.target.value) : '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                      step="0.1"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Min Wind Capacity (MW)</label>
                    <input
                      type="number"
                      placeholder="e.g., 5"
                      value={filters.min_wind_capacity}
                      onChange={(e) => handleChange('min_wind_capacity', e.target.value ? parseFloat(e.target.value) : '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                      step="0.1"
                      min="0"
                    />
                  </div>
                </div>
              </div>

              {/* Connectivity & Proximity */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-xs font-bold text-gray-800 mb-3">Connectivity & Market Access</h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Max Distance to Fiber (miles)</label>
                    <input
                      type="number"
                      placeholder="e.g., 2"
                      value={filters.max_fiber_distance}
                      onChange={(e) => handleChange('max_fiber_distance', e.target.value ? parseFloat(e.target.value) : '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                      step="0.1"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Proximity to fiber optic infrastructure</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Max Distance to Offtakers (miles)</label>
                    <input
                      type="number"
                      placeholder="e.g., 50"
                      value={filters.max_offtaker_distance}
                      onChange={(e) => handleChange('max_offtaker_distance', e.target.value ? parseFloat(e.target.value) : '')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                      step="1"
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Distance to major demand centers or enterprise customers</p>
                  </div>
                </div>
              </div>

              {/* Risk Mitigation */}
              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-xs font-bold text-gray-800 mb-3">Risk Mitigation</h3>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.flood_zone_exclude}
                      onChange={(e) => handleChange('flood_zone_exclude', e.target.checked)}
                      className="w-4 h-4 text-[#0078d4] border-gray-300 rounded focus:ring-[#0078d4]"
                    />
                    <span className="text-sm text-gray-700">Exclude flood zones</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.earthquake_zone_exclude}
                      onChange={(e) => handleChange('earthquake_zone_exclude', e.target.checked)}
                      className="w-4 h-4 text-[#0078d4] border-gray-300 rounded focus:ring-[#0078d4]"
                    />
                    <span className="text-sm text-gray-700">Exclude high seismic zones</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={filters.water_access_required}
                      onChange={(e) => handleChange('water_access_required', e.target.checked)}
                      className="w-4 h-4 text-[#0078d4] border-gray-300 rounded focus:ring-[#0078d4]"
                    />
                    <span className="text-sm text-gray-700">Require water access for cooling</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Filters Tab */}
          {activeTab === 'filters' && (
            <div className="space-y-4">
              {/* Acreage Range */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Acreage Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.min_acres}
                    onChange={(e) => handleChange('min_acres', e.target.value ? parseFloat(e.target.value) : '')}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                    step="0.1"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.max_acres}
                    onChange={(e) => handleChange('max_acres', e.target.value ? parseFloat(e.target.value) : '')}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                    step="0.1"
                    min="0"
                  />
                </div>
              </div>

              {/* Results Limit */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Results per search</label>
                <select
                  value={filters.limit}
                  onChange={(e) => handleChange('limit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                >
                  <option value={10}>10 results</option>
                  <option value={25}>25 results</option>
                  <option value={50}>50 results</option>
                  <option value={100}>100 results</option>
                  <option value={200}>200 results</option>
                </select>
              </div>
            </div>
          )}

          {/* Location Tab */}
          {activeTab === 'location' && (
            <div className="space-y-4">
              {/* Lat/Lon Navigation */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Go to Coordinates
                </label>
                <CoordinateInput onNavigate={(lat, lng) => {
                  handleChange('latitude', lat);
                  handleChange('longitude', lng);
                  handleSubmit();
                }} />
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    placeholder="e.g., MD"
                    value={filters.state}
                    onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
                    maxLength={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent uppercase"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">County</label>
                  <input
                    type="text"
                    placeholder="County name"
                    value={filters.county}
                    onChange={(e) => handleChange('county', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-2">ZIP Code</label>
                  <input
                    type="text"
                    placeholder="ZIP code"
                    value={filters.zip_code}
                    onChange={(e) => handleChange('zip_code', e.target.value)}
                    maxLength={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex items-center justify-between gap-2">
          {hasActiveFilters && (
            <button
              onClick={handleClear}
              className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Clear all
            </button>
          )}
          <div className="flex-1"></div>
          <button
            onClick={handleSubmit}
            disabled={isSearching}
            className="bg-[#0078d4] hover:bg-[#106ebe] disabled:bg-gray-400 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            {isSearching ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Searching...
              </>
            ) : (
              <>
                <Search size={16} />
                Search
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
