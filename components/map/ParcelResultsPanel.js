'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, ChevronRight, MapPin, TrendingUp, Zap, Droplet, Map as MapIcon, Building2 } from 'lucide-react';

export default function ParcelResultsPanel({ parcels, isOpen, onClose, onParcelHover, onParcelClick }) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState('overall_score'); // overall_score, gis_acres, price_per_acre

  const sortedParcels = [...parcels].sort((a, b) => {
    if (sortBy === 'overall_score') return b.overall_score - a.overall_score;
    if (sortBy === 'gis_acres') return b.gis_acres - a.gis_acres;
    if (sortBy === 'price_per_acre') return a.price_per_acre - b.price_per_acre;
    return 0;
  });

  const getScoreColor = (score) => {
    if (score >= 85) return 'text-green-700 bg-green-100';
    if (score >= 70) return 'text-blue-700 bg-blue-100';
    if (score >= 60) return 'text-yellow-700 bg-yellow-100';
    return 'text-orange-700 bg-orange-100';
  };

  const handleViewDetails = (parcel) => {
    router.push(`/parcels/${parcel.id}`);
  };

  const handleViewDataCenterReport = (parcel, e) => {
    e.stopPropagation();
    router.push(`/parcels/${parcel.id}/datacenter-report`);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[600px] lg:w-[700px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Search Results</h2>
              <p className="text-sm text-gray-600 mt-1">
                {parcels.length} {parcels.length === 1 ? 'parcel' : 'parcels'} found
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Sort Controls */}
          <div className="p-4 border-b border-gray-200 bg-white">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-300 rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0078d4]"
              >
                <option value="overall_score">Overall Score (High to Low)</option>
                <option value="gis_acres">Size (Large to Small)</option>
                <option value="price_per_acre">Price (Low to High)</option>
              </select>
            </div>
          </div>

          {/* Results List */}
          <div className="flex-1 overflow-y-auto">
            {sortedParcels.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
                <MapIcon size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-semibold">No parcels found</p>
                <p className="text-sm mt-2 text-center">
                  Try adjusting your search criteria to see more results
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {sortedParcels.map((parcel, index) => (
                  <div
                    key={parcel.id}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onMouseEnter={() => onParcelHover && onParcelHover(parcel)}
                    onMouseLeave={() => onParcelHover && onParcelHover(null)}
                    onClick={() => onParcelClick && onParcelClick(parcel)}
                  >
                    {/* Parcel Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">
                            {parcel.site_address}
                          </h3>
                          {parcel.qualified_opportunity_zone && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">
                              OZ
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin size={14} />
                          <span>
                            {parcel.city}, {parcel.state} • {parcel.county}
                          </span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(parcel.overall_score)}`}>
                        {parcel.overall_score}
                      </div>
                    </div>

                    {/* Key Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Building2 size={12} />
                          <span>Size</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          {parcel.gis_acres.toFixed(1)} acres
                        </p>
                      </div>

                      <div className="bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <TrendingUp size={12} />
                          <span>Price/Acre</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          ${(parcel.price_per_acre / 1000).toFixed(0)}k
                        </p>
                      </div>

                      <div className="bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Zap size={12} />
                          <span>Power</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          {parcel.power_proximity_km.toFixed(1)} km
                        </p>
                      </div>

                      <div className="bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                          <Droplet size={12} />
                          <span>Water</span>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          {parcel.water_available ? 'Available' : 'Limited'}
                        </p>
                      </div>
                    </div>

                    {/* Scores Row */}
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <span className="text-gray-600">Power: </span>
                          <span className="font-semibold text-gray-900">
                            {parcel.power_score.toFixed(0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Connect: </span>
                          <span className="font-semibold text-gray-900">
                            {parcel.connectivity_score.toFixed(0)}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Location: </span>
                          <span className="font-semibold text-gray-900">
                            {parcel.location_score.toFixed(0)}
                          </span>
                        </div>
                      </div>
                      <div className="text-gray-500">
                        {parcel.zoning}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(parcel);
                        }}
                        className="flex-1 px-3 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white text-sm font-medium rounded transition-colors flex items-center justify-center gap-1"
                      >
                        <span>View Details</span>
                        <ChevronRight size={16} />
                      </button>
                      <button
                        onClick={(e) => handleViewDataCenterReport(parcel, e)}
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded transition-colors"
                      >
                        DC Analysis
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Stats */}
          {parcels.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Avg Size</p>
                  <p className="font-bold text-gray-900">
                    {(parcels.reduce((sum, p) => sum + p.gis_acres, 0) / parcels.length).toFixed(0)} acres
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Avg Score</p>
                  <p className="font-bold text-gray-900">
                    {(parcels.reduce((sum, p) => sum + p.overall_score, 0) / parcels.length).toFixed(0)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Opp Zones</p>
                  <p className="font-bold text-gray-900">
                    {parcels.filter(p => p.qualified_opportunity_zone).length}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
