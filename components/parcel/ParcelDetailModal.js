"use client";

import { X, MapPin, Download, ExternalLink, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ParcelDetailModal({ parcel, isOpen, onClose, onAnalyze, onAddToProject }) {
  if (!isOpen || !parcel) return null;

  const formatCurrency = (value) => {
    if (!value) return 'N/A';
    return `$${value.toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 overflow-y-auto animate-slide-in-right">
        {/* Header */}
        <div className="sticky top-0 bg-[#0078d4] text-white p-4 flex items-center justify-between z-10">
          <div className="flex-1">
            <h2 className="text-lg font-semibold">{parcel.site_address || 'Parcel Details'}</h2>
            <p className="text-sm text-blue-100">APN: {parcel.parcel_number}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#106ebe] rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Property Information */}
          <section>
            <h3 className="text-md font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              📋 Property Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Owner</div>
                <div className="font-semibold text-gray-900">{parcel.owner_name || 'N/A'}</div>
              </div>
              {parcel.owner2_name && (
                <div>
                  <div className="text-gray-600">Co-Owner</div>
                  <div className="font-semibold text-gray-900">{parcel.owner2_name}</div>
                </div>
              )}
              <div>
                <div className="text-gray-600">Site Address</div>
                <div className="font-semibold text-gray-900">
                  {parcel.site_address || 'N/A'}
                  {parcel.site_city && <div className="text-xs text-gray-600 mt-0.5">{parcel.site_city}, {parcel.site_state} {parcel.site_zip}</div>}
                </div>
              </div>
              {parcel.mail_address && parcel.mail_address !== parcel.site_address && (
                <div>
                  <div className="text-gray-600">Mailing Address</div>
                  <div className="font-semibold text-gray-900">
                    {parcel.mail_address}
                    {parcel.mail_city && <div className="text-xs text-gray-600 mt-0.5">{parcel.mail_city}, {parcel.mail_state} {parcel.mail_zip}</div>}
                  </div>
                </div>
              )}
              <div>
                <div className="text-gray-600">County</div>
                <div className="font-semibold text-gray-900">{parcel.county_name || 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-600">Census Tract</div>
                <div className="font-semibold text-gray-900">{parcel.census_tract || 'N/A'}</div>
              </div>
            </div>
          </section>

          {/* Land Details */}
          <section>
            <h3 className="text-md font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              📐 Land Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Acreage</div>
                <div className="font-semibold text-gray-900 text-lg">
                  {parcel.gis_acres ? Number(parcel.gis_acres).toFixed(2) : 'N/A'} acres
                </div>
              </div>
              {parcel.calculated_sqft && (
                <div>
                  <div className="text-gray-600">Square Feet</div>
                  <div className="font-semibold text-gray-900">{parcel.calculated_sqft.toLocaleString()} sqft</div>
                </div>
              )}
              <div>
                <div className="text-gray-600">Use Type</div>
                <div className="font-semibold text-gray-900">{parcel.use_description || parcel.use_code || 'N/A'}</div>
              </div>
              <div>
                <div className="text-gray-600">Zoning</div>
                <div className="font-semibold text-gray-900">{parcel.zoning || 'N/A'}</div>
              </div>
              {parcel.year_built && (
                <div>
                  <div className="text-gray-600">Year Built</div>
                  <div className="font-semibold text-gray-900">{parcel.year_built}</div>
                </div>
              )}
              {parcel.subdivision && parcel.subdivision !== 'N/A' && (
                <div>
                  <div className="text-gray-600">Subdivision</div>
                  <div className="font-semibold text-gray-900">{parcel.subdivision}</div>
                </div>
              )}
              {parcel.qualified_opportunity_zone && (
                <div className="col-span-2">
                  <div className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded font-semibold">
                    ⭐ Qualified Opportunity Zone
                    {parcel.qoz_tract && <span className="text-xs font-normal">(Tract: {parcel.qoz_tract})</span>}
                  </div>
                </div>
              )}
            </div>
            {parcel.legal_description && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <div className="text-xs font-semibold text-gray-700 mb-1">Legal Description</div>
                <div className="text-xs text-gray-900">{parcel.legal_description}</div>
              </div>
            )}
          </section>

          {/* Valuation */}
          {(parcel.total_value || parcel.land_value) && (
            <section>
              <h3 className="text-md font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
                💰 Valuation
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {parcel.land_value && (
                  <div>
                    <div className="text-gray-600">Land Value</div>
                    <div className="font-semibold text-gray-900">{formatCurrency(parcel.land_value)}</div>
                  </div>
                )}
                {parcel.improvement_value && (
                  <div>
                    <div className="text-gray-600">Improvement Value</div>
                    <div className="font-semibold text-gray-900">{formatCurrency(parcel.improvement_value)}</div>
                  </div>
                )}
                {parcel.total_value && (
                  <div>
                    <div className="text-gray-600">Total Value</div>
                    <div className="font-semibold text-gray-900 text-lg">{formatCurrency(parcel.total_value)}</div>
                  </div>
                )}
                {parcel.sale_price && (
                  <div>
                    <div className="text-gray-600">Last Sale</div>
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(parcel.sale_price)}
                      {parcel.sale_date && <div className="text-xs text-gray-600 mt-0.5">{formatDate(parcel.sale_date)}</div>}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Location */}
          <section>
            <h3 className="text-md font-semibold text-gray-900 mb-3 border-b border-gray-200 pb-2">
              📍 Location
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Latitude</div>
                <div className="font-mono text-sm text-gray-900">{parcel.latitude?.toFixed(6)}</div>
              </div>
              <div>
                <div className="text-gray-600">Longitude</div>
                <div className="font-mono text-sm text-gray-900">{parcel.longitude?.toFixed(6)}</div>
              </div>
            </div>
            {/* Small embedded map could go here */}
          </section>
        </div>

        {/* Actions Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
          <Button
            onClick={() => onAnalyze?.(parcel)}
            className="flex-1"
            icon={<Zap size={18} />}
          >
            Analyze for Solar
          </Button>
          <Button
            onClick={() => onAddToProject?.(parcel)}
            variant="secondary"
          >
            Add to Project
          </Button>
          {parcel.sdat_web_url && (
            <Button
              variant="secondary"
              onClick={() => window.open(parcel.sdat_web_url, '_blank')}
              icon={<ExternalLink size={16} />}
            >
              SDAT
            </Button>
          )}
          <Button
            variant="secondary"
            icon={<Download size={16} />}
            onClick={() => {
              const blob = new Blob([JSON.stringify(parcel, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `parcel_${parcel.parcel_number}.json`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export
          </Button>
        </div>
      </div>
    </>
  );
}
