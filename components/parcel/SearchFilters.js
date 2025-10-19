"use client";

import { useState } from 'react';
import { Search, X, Filter, MapPin } from 'lucide-react';
import Button from '@/components/ui/Button';

const USE_CODES = [
  { value: 'A', label: '🌾 Agricultural', color: 'green' },
  { value: 'R', label: '🏠 Residential', color: 'blue' },
  { value: 'C', label: '🏢 Commercial', color: 'orange' },
  { value: 'I', label: '🏭 Industrial', color: 'gray' },
];

export default function SearchFilters({ onSearch, onClear, initialValues = {} }) {
  const [filters, setFilters] = useState({
    query: initialValues.query || '',
    min_acres: initialValues.min_acres || '',
    max_acres: initialValues.max_acres || '',
    use_codes: initialValues.use_codes || [],
    qoz_only: initialValues.qoz_only || false,
    county: initialValues.county || '',
    state: initialValues.state || '',
    zip_code: initialValues.zip_code || '',
    limit: initialValues.limit || 50,
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const handleSubmit = (e) => {
    e.preventDefault();
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
      limit: 50,
    });
    onClear?.();
  };

  const hasActiveFilters = filters.query || filters.min_acres || filters.max_acres || 
    filters.use_codes.length > 0 || filters.qoz_only || filters.county || 
    filters.state || filters.zip_code;

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded shadow-sm p-4">
      {/* Primary Search */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by owner, address, or city..."
            value={filters.query}
            onChange={(e) => handleChange('query', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
          />
        </div>
        <Button type="submit" className="px-6">
          Search
        </Button>
        {hasActiveFilters && (
          <Button type="button" variant="secondary" onClick={handleClear} icon={<X size={16} />}>
            Clear
          </Button>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={() => setShowAdvanced(!showAdvanced)}
          icon={<Filter size={16} />}
        >
          {showAdvanced ? 'Hide' : 'Filters'}
        </Button>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="pt-3 border-t border-gray-200 space-y-4">
          {/* Acreage Range */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">📐 Acreage Range</label>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Min acres"
                value={filters.min_acres}
                onChange={(e) => handleChange('min_acres', e.target.value ? parseFloat(e.target.value) : '')}
                className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
                step="0.1"
                min="0"
              />
              <input
                type="number"
                placeholder="Max acres"
                value={filters.max_acres}
                onChange={(e) => handleChange('max_acres', e.target.value ? parseFloat(e.target.value) : '')}
                className="px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
                step="0.1"
                min="0"
              />
            </div>
          </div>

          {/* Use Codes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2">🏘️ Property Type</label>
            <div className="flex flex-wrap gap-2">
              {USE_CODES.map((uc) => (
                <button
                  key={uc.value}
                  type="button"
                  onClick={() => toggleUseCode(uc.value)}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    filters.use_codes.includes(uc.value)
                      ? `bg-${uc.color}-100 text-${uc.color}-800 border-${uc.color}-300 border-2`
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {uc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location Filters */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">State</label>
              <input
                type="text"
                placeholder="e.g., MD"
                value={filters.state}
                onChange={(e) => handleChange('state', e.target.value.toUpperCase())}
                maxLength={2}
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">County</label>
              <input
                type="text"
                placeholder="County name"
                value={filters.county}
                onChange={(e) => handleChange('county', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">ZIP Code</label>
              <input
                type="text"
                placeholder="ZIP"
                value={filters.zip_code}
                onChange={(e) => handleChange('zip_code', e.target.value)}
                maxLength={5}
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
              />
            </div>
          </div>

          {/* QOZ & Results Per Page */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.qoz_only}
                onChange={(e) => handleChange('qoz_only', e.target.checked)}
                className="w-4 h-4 text-[#0078d4] border-gray-300 rounded focus:ring-[#0078d4]"
              />
              <span className="text-sm font-medium text-gray-700">⭐ QOZ Only (Qualified Opportunity Zones)</span>
            </label>

            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-gray-700">Results:</label>
              <select
                value={filters.limit}
                onChange={(e) => handleChange('limit', parseInt(e.target.value))}
                className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
