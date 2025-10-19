"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, MapPin, TrendingUp, X } from 'lucide-react';
import { getRecentParcels, removeRecentParcel, clearRecentParcels } from '@/utils/recentParcels';

export default function RecentParcelsWidget({ onViewParcel }) {
  const router = useRouter();
  const [recentParcels, setRecentParcels] = useState([]);

  // Load recent parcels on mount
  useEffect(() => {
    setRecentParcels(getRecentParcels(5)); // Show top 5
  }, []);

  const handleRemove = (parcelNumber, e) => {
    e.stopPropagation();
    removeRecentParcel(parcelNumber);
    setRecentParcels(getRecentParcels(5));
  };

  const handleClearAll = () => {
    if (confirm('Clear all recent parcels?')) {
      clearRecentParcels();
      setRecentParcels([]);
    }
  };

  const handleViewParcel = (parcel) => {
    if (onViewParcel) {
      onViewParcel(parcel);
    } else {
      // Default: navigate to parcel detail page
      router.push(`/parcel/${parcel.parcel_number}`);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (recentParcels.length === 0) {
    return (
      <div className="bg-white rounded border border-gray-200 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Clock size={20} className="text-[#0078d4]" />
          <h3 className="text-base font-semibold text-gray-900">Recent Parcels</h3>
        </div>
        <div className="text-center py-8 text-gray-500 text-sm">
          <Clock size={32} className="mx-auto mb-2 opacity-40" />
          <p>No recent parcels viewed yet</p>
          <p className="text-xs mt-1">Your recently viewed parcels will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded border border-gray-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock size={20} className="text-[#0078d4]" />
          <h3 className="text-base font-semibold text-gray-900">Recent Parcels</h3>
        </div>
        <button
          onClick={handleClearAll}
          className="text-xs text-gray-600 hover:text-[#0078d4] transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Parcel List */}
      <div className="space-y-2">
        {recentParcels.map((parcel) => (
          <div
            key={parcel.parcel_number}
            onClick={() => handleViewParcel(parcel)}
            className="border border-gray-200 rounded p-3 hover:border-[#0078d4] hover:shadow-sm transition-all cursor-pointer group"
          >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-gray-900 truncate">
                    {parcel.parcel_number}
                  </span>
                  {parcel.qualified_opportunity_zone && (
                    <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded font-medium">
                      QOZ
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Clock size={12} />
                  <span>{formatDate(parcel.viewed_at)}</span>
                </div>
              </div>
              <button
                onClick={(e) => handleRemove(parcel.parcel_number, e)}
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
              >
                <X size={14} className="text-gray-500" />
              </button>
            </div>

            {/* Address */}
            {parcel.site_address && (
              <div className="flex items-start gap-1.5 mb-2">
                <MapPin size={12} className="text-gray-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-700 line-clamp-1">
                  {parcel.site_address}
                  {parcel.site_city && `, ${parcel.site_city}`}
                  {parcel.site_state && `, ${parcel.site_state}`}
                </span>
              </div>
            )}

            {/* Owner */}
            {parcel.owner_name && (
              <div className="text-xs text-gray-600 mb-2 truncate">
                Owner: {parcel.owner_name}
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <div className="text-gray-500">Acres</div>
                <div className="font-medium text-gray-900">
                  {parcel.gis_acres?.toFixed(2) || 'N/A'}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Value</div>
                <div className="font-medium text-gray-900">
                  {formatCurrency(parcel.total_value)}
                </div>
              </div>
              <div>
                <div className="text-gray-500">Use</div>
                <div className="font-medium text-gray-900 truncate" title={parcel.use_description}>
                  {parcel.use_description || 'N/A'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Link */}
      {recentParcels.length >= 5 && (
        <button
          onClick={() => router.push('/recent')}
          className="w-full mt-3 text-sm text-[#0078d4] hover:text-[#106ebe] font-medium text-center"
        >
          View All Recent Parcels →
        </button>
      )}
    </div>
  );
}
