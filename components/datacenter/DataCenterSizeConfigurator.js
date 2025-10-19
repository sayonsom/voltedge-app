import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Server, Zap, Maximize2 } from 'lucide-react';

export default function DataCenterSizeConfigurator({ dcSizes, selectedSize, onSizeChange, acreage }) {
  const [localSelected, setLocalSelected] = useState(selectedSize);

  const handleSizeSelect = (sizeKey) => {
    setLocalSelected(sizeKey);
    if (onSizeChange) {
      onSizeChange(sizeKey);
    }
  };

  const getAcreageFit = (required) => {
    if (acreage >= required.max * 1.3) return { label: 'Excellent Fit', color: 'green' };
    if (acreage >= required.max) return { label: 'Good Fit', color: 'blue' };
    if (acreage >= required.min) return { label: 'Viable', color: 'yellow' };
    return { label: 'Insufficient', color: 'red' };
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Server size={24} className="text-[#0078d4]" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Data Center Size Configuration
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Select the optimal data center scale for this {acreage.toFixed(1)}-acre site
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(dcSizes).map(([key, config]) => {
          const isSelected = key === localSelected;
          const fit = getAcreageFit(config.acresRequired);
          const canBuild = acreage >= config.acresRequired.min;

          return (
            <div
              key={key}
              onClick={() => canBuild && handleSizeSelect(key)}
              className={`relative p-5 rounded-lg border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#0078d4] bg-blue-50 shadow-lg'
                  : canBuild
                  ? 'border-gray-200 hover:border-[#0078d4] hover:shadow-md'
                  : 'border-gray-200 opacity-50 cursor-not-allowed'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <span className="bg-[#0078d4] text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Selected
                  </span>
                </div>
              )}

              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{config.name}</h3>
                <p className="text-xs text-gray-600 line-clamp-2">{config.description}</p>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Zap size={14} />
                    Power
                  </span>
                  <span className="font-semibold text-gray-900">
                    {config.powerRange.min}-{config.powerRange.max} MW
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Maximize2 size={14} />
                    Building
                  </span>
                  <span className="font-semibold text-gray-900">
                    {(config.sqft / 1000).toFixed(0)}k sqft
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Land Need</span>
                  <span className="font-semibold text-gray-900">
                    {config.acresRequired.min}-{config.acresRequired.max} acres
                  </span>
                </div>
              </div>

              {/* Fit indicator */}
              <div
                className={`px-3 py-2 rounded text-center text-sm font-semibold ${
                  fit.color === 'green'
                    ? 'bg-green-100 text-green-800'
                    : fit.color === 'blue'
                    ? 'bg-blue-100 text-blue-800'
                    : fit.color === 'yellow'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {fit.label}
              </div>

              {!canBuild && (
                <p className="text-xs text-red-600 mt-2 text-center">
                  Insufficient acreage
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Size Details */}
      {localSelected && (
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-lg border-l-4 border-l-[#0078d4]">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Selected Configuration: {dcSizes[localSelected].name}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600 mb-1">Power Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {dcSizes[localSelected].powerRange.min}-{dcSizes[localSelected].powerRange.max} MW
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Facility Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {(dcSizes[localSelected].sqft / 1000).toFixed(0)}k sqft
              </p>
            </div>
            <div>
              <p className="text-gray-600 mb-1">Land Requirement</p>
              <p className="text-2xl font-bold text-gray-900">
                {dcSizes[localSelected].acresRequired.min}-{dcSizes[localSelected].acresRequired.max} acres
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700 mt-4">
            {dcSizes[localSelected].description}
          </p>
        </div>
      )}

      {/* Site Capacity Analysis */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Site Capacity Analysis
        </h3>
        <div className="space-y-2">
          {Object.entries(dcSizes).map(([key, config]) => {
            const canFit = acreage >= config.acresRequired.min;
            const numFacilities = canFit ? Math.floor(acreage / config.acresRequired.max) : 0;

            return (
              <div
                key={key}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <span className="text-sm font-medium text-gray-900">{config.name}</span>
                {canFit ? (
                  <span className="text-sm text-gray-700">
                    Can accommodate up to <span className="font-bold text-[#0078d4]">{numFacilities}</span>{' '}
                    {numFacilities === 1 ? 'facility' : 'facilities'}
                  </span>
                ) : (
                  <span className="text-sm text-red-600 font-medium">
                    Insufficient land area
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
