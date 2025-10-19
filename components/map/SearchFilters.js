'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Search, X, Filter } from 'lucide-react';

const US_STATES = ['VA', 'NC', 'TX', 'IL', 'CA', 'GA', 'OH', 'AZ', 'OR', 'WA', 'NV', 'CO', 'PA', 'MD'];
const ZONING_TYPES = ['I-1', 'I-2', 'M-1', 'M-2', 'C-2', 'PD', 'MXD', 'AG-1'];

export default function SearchFilters({ onSearch, onReset, initialCriteria = {} }) {
  const [criteria, setCriteria] = useState({
    state: initialCriteria.state || [],
    minAcreage: initialCriteria.minAcreage || '',
    maxAcreage: initialCriteria.maxAcreage || '',
    maxPricePerAcre: initialCriteria.maxPricePerAcre || '',
    maxPowerDistance: initialCriteria.maxPowerDistance || '',
    maxFiberDistance: initialCriteria.maxFiberDistance || '',
    waterRequired: initialCriteria.waterRequired || false,
    opportunityZoneOnly: initialCriteria.opportunityZoneOnly || false,
    minOverallScore: initialCriteria.minOverallScore || '',
    zoning: initialCriteria.zoning || []
  });

  const [isExpanded, setIsExpanded] = useState(true);

  const handleStateToggle = (state) => {
    setCriteria(prev => ({
      ...prev,
      state: prev.state.includes(state)
        ? prev.state.filter(s => s !== state)
        : [...prev.state, state]
    }));
  };

  const handleZoningToggle = (zone) => {
    setCriteria(prev => ({
      ...prev,
      zoning: prev.zoning.includes(zone)
        ? prev.zoning.filter(z => z !== zone)
        : [...prev.zoning, zone]
    }));
  };

  const handleInputChange = (field, value) => {
    setCriteria(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Convert string inputs to numbers
    const searchCriteria = {
      ...criteria,
      minAcreage: criteria.minAcreage ? parseFloat(criteria.minAcreage) : undefined,
      maxAcreage: criteria.maxAcreage ? parseFloat(criteria.maxAcreage) : undefined,
      maxPricePerAcre: criteria.maxPricePerAcre ? parseFloat(criteria.maxPricePerAcre) : undefined,
      maxPowerDistance: criteria.maxPowerDistance ? parseFloat(criteria.maxPowerDistance) : undefined,
      maxFiberDistance: criteria.maxFiberDistance ? parseFloat(criteria.maxFiberDistance) : undefined,
      minOverallScore: criteria.minOverallScore ? parseFloat(criteria.minOverallScore) : undefined
    };
    onSearch(searchCriteria);
  };

  const handleReset = () => {
    const resetCriteria = {
      state: [],
      minAcreage: '',
      maxAcreage: '',
      maxPricePerAcre: '',
      maxPowerDistance: '',
      maxFiberDistance: '',
      waterRequired: false,
      opportunityZoneOnly: false,
      minOverallScore: '',
      zoning: []
    };
    setCriteria(resetCriteria);
    onReset();
  };

  const activeFilterCount =
    criteria.state.length +
    criteria.zoning.length +
    (criteria.minAcreage ? 1 : 0) +
    (criteria.maxAcreage ? 1 : 0) +
    (criteria.maxPricePerAcre ? 1 : 0) +
    (criteria.maxPowerDistance ? 1 : 0) +
    (criteria.maxFiberDistance ? 1 : 0) +
    (criteria.waterRequired ? 1 : 0) +
    (criteria.opportunityZoneOnly ? 1 : 0) +
    (criteria.minOverallScore ? 1 : 0);

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-[#0078d4]" />
          <h3 className="font-semibold text-gray-900">Search Filters</h3>
          {activeFilterCount > 0 && (
            <span className="px-2 py-0.5 bg-[#0078d4] text-white text-xs rounded-full font-semibold">
              {activeFilterCount}
            </span>
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm text-[#0078d4] hover:underline"
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          {/* State Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              States
            </label>
            <div className="flex flex-wrap gap-2">
              {US_STATES.map(state => (
                <button
                  key={state}
                  onClick={() => handleStateToggle(state)}
                  className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                    criteria.state.includes(state)
                      ? 'bg-[#0078d4] text-white border-[#0078d4]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#0078d4]'
                  }`}
                >
                  {state}
                </button>
              ))}
            </div>
          </div>

          {/* Acreage Range */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Acres
              </label>
              <input
                type="number"
                value={criteria.minAcreage}
                onChange={(e) => handleInputChange('minAcreage', e.target.value)}
                placeholder="e.g., 10"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Acres
              </label>
              <input
                type="number"
                value={criteria.maxAcreage}
                onChange={(e) => handleInputChange('maxAcreage', e.target.value)}
                placeholder="e.g., 200"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
              />
            </div>
          </div>

          {/* Price Per Acre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price Per Acre ($)
            </label>
            <input
              type="number"
              value={criteria.maxPricePerAcre}
              onChange={(e) => handleInputChange('maxPricePerAcre', e.target.value)}
              placeholder="e.g., 50000"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
            />
          </div>

          {/* Infrastructure Proximity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Power Distance (km)
              </label>
              <input
                type="number"
                value={criteria.maxPowerDistance}
                onChange={(e) => handleInputChange('maxPowerDistance', e.target.value)}
                placeholder="e.g., 10"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Fiber Distance (km)
              </label>
              <input
                type="number"
                value={criteria.maxFiberDistance}
                onChange={(e) => handleInputChange('maxFiberDistance', e.target.value)}
                placeholder="e.g., 5"
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
              />
            </div>
          </div>

          {/* Min Overall Score */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Overall Score
            </label>
            <input
              type="number"
              value={criteria.minOverallScore}
              onChange={(e) => handleInputChange('minOverallScore', e.target.value)}
              placeholder="e.g., 70"
              min="0"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
            />
          </div>

          {/* Zoning Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zoning Types
            </label>
            <div className="flex flex-wrap gap-2">
              {ZONING_TYPES.map(zone => (
                <button
                  key={zone}
                  onClick={() => handleZoningToggle(zone)}
                  className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                    criteria.zoning.includes(zone)
                      ? 'bg-[#0078d4] text-white border-[#0078d4]'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-[#0078d4]'
                  }`}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={criteria.waterRequired}
                onChange={(e) => handleInputChange('waterRequired', e.target.checked)}
                className="w-4 h-4 text-[#0078d4] border-gray-300 rounded focus:ring-[#0078d4]"
              />
              <span className="text-sm text-gray-700">Water Available Required</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={criteria.opportunityZoneOnly}
                onChange={(e) => handleInputChange('opportunityZoneOnly', e.target.checked)}
                className="w-4 h-4 text-[#0078d4] border-gray-300 rounded focus:ring-[#0078d4]"
              />
              <span className="text-sm text-gray-700">Opportunity Zones Only</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              onClick={handleSearch}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Search size={16} />
              Search
            </Button>
            <Button
              onClick={handleReset}
              variant="secondary"
              className="flex items-center justify-center gap-2"
            >
              <X size={16} />
              Reset
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
