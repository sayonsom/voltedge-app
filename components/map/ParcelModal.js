"use client";

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function ParcelModal({ parcel, onRunAnalysis, onViewDetails }) {
  const router = useRouter();

  if (!parcel) return null;
  const { id, title, summary, raw, type } = parcel;

  // Use raw parcel data if available
  const parcelData = raw || parcel;
  const parcelId = parcelData.parcel_number || id;
  const displayTitle = parcelData.site_address || title || 'Parcel';
  const displaySummary = summary || `${parcelData.owner_name || ''} • ${parcelData.gis_acres?.toFixed(2) || 0} acres`.trim();
  const qoz = parcelData.qualified_opportunity_zone;
  const isLocationMarker = type === 'location';

  return (
    <div className="text-gray-900">
      <div className="mb-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">{displayTitle}</h3>
          {qoz && <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-medium">⭐ QOZ</span>}
        </div>
        {parcelData.parcel_number && (
          <p className="text-xs text-gray-600 mt-0.5">APN: {parcelData.parcel_number}</p>
        )}
        {displaySummary && (
          <p className="text-xs text-gray-700 mt-1">{displaySummary}</p>
        )}
        {parcelData.use_description && (
          <p className="text-xs text-gray-600 mt-0.5">
            {parcelData.use_description} • {parcelData.zoning || 'N/A'}
          </p>
        )}
        {isLocationMarker && (
          <p className="text-xs text-gray-600 mt-2 bg-blue-50 p-2 rounded border border-blue-200">
            📍 Click "Analyze for Solar" to run analysis on this location
          </p>
        )}
      </div>
      <div className="flex flex-col gap-2 mt-3">
        {!isLocationMarker && (
          <Button onClick={() => onViewDetails?.()} className="text-xs py-1.5">
            View Full Details
          </Button>
        )}
        <Button onClick={() => onRunAnalysis?.(parcel)} variant={isLocationMarker ? "primary" : "secondary"} className="text-xs py-1.5">
          🔆 Analyze for Solar
        </Button>
      </div>
    </div>
  );
}
