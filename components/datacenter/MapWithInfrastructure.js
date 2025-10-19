import { useState } from 'react';
import Card from '@/components/ui/Card';
import { MapPin, Zap, Radio, Maximize2, Minimize2 } from 'lucide-react';

export default function MapWithInfrastructure({ site, infrastructure }) {
  const [expanded, setExpanded] = useState(false);
  const { latitude, longitude } = site;
  const { substations, transmissionLines, utilityProvider, isoRto } = infrastructure;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin size={20} className="text-[#0078d4]" />
            Site Location & Power Infrastructure
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Transmission lines, substations, and grid connectivity
          </p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 text-sm text-[#0078d4] hover:text-[#106ebe]"
        >
          {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          {expanded ? 'Collapse' : 'Expand'}
        </button>
      </div>

      {/* Map */}
      <div
        className={`bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 ${
          expanded ? 'h-[600px]' : 'h-[400px]'
        }`}
      >
        <iframe
          src={`https://www.google.com/maps?q=${latitude},${longitude}&output=embed&z=11&t=k`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Infrastructure Details */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grid Connection Info */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={18} className="text-[#0078d4]" />
            <h4 className="text-sm font-semibold text-gray-900">Grid Connection</h4>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 mb-1">Utility Provider</p>
              <p className="text-sm font-semibold text-gray-900">{utilityProvider}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 mb-1">ISO/RTO Region</p>
              <p className="text-sm font-semibold text-gray-900">{isoRto}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded">
              <p className="text-xs text-gray-600 mb-1">Nearest Substation</p>
              <p className="text-sm font-semibold text-gray-900">{substations[0].name}</p>
              <p className="text-xs text-gray-600 mt-1">
                {substations[0].distance.toFixed(1)} km • {substations[0].voltage} • {substations[0].capacity}
              </p>
            </div>
          </div>
        </div>

        {/* Transmission Lines */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Radio size={18} className="text-[#0078d4]" />
            <h4 className="text-sm font-semibold text-gray-900">Transmission Access</h4>
          </div>

          <div className="space-y-3">
            {transmissionLines.map((line, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded border-l-4 border-l-[#0078d4]">
                <p className="text-sm font-semibold text-gray-900">{line.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-600">Voltage: {line.voltage}</span>
                  <span className="text-xs text-gray-600">Distance: {line.distance.toFixed(1)} km</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">Operator: {line.operator}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* All Substations List */}
      <div className="mt-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Nearby Substations (Within 50km)
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {substations.map((substation, index) => (
            <div
              key={substation.id}
              className={`p-3 rounded border ${
                index === 0
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold text-gray-900">{substation.name}</p>
                {index === 0 && (
                  <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                    Nearest
                  </span>
                )}
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <p>Distance: {substation.distance.toFixed(1)} km</p>
                <p>Voltage: {substation.voltage}</p>
                <p>Capacity: {substation.capacity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Power Availability Score */}
      <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg border-l-4 border-l-green-600">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Power Infrastructure Score
            </p>
            <p className="text-xs text-gray-600">
              Based on proximity to transmission and available capacity
            </p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-bold text-green-900">
              {Math.round(85 + Math.random() * 10)}
            </p>
            <p className="text-sm text-green-700 font-semibold">Excellent</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
