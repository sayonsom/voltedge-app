"use client";

import { Zap } from 'lucide-react';

const QUICK_FILTERS = [
  {
    id: 'large_ag',
    label: '🌾 Large Agricultural',
    icon: '🌾',
    filters: { use_codes: ['A'], min_acres: 10, limit: 50 },
    color: 'green',
  },
  {
    id: 'qoz',
    label: '⭐ QOZ Properties',
    icon: '⭐',
    filters: { qoz_only: true, min_acres: 5, limit: 50 },
    color: 'yellow',
  },
  {
    id: 'residential_small',
    label: '🏠 Residential < 5 acres',
    icon: '🏠',
    filters: { use_codes: ['R'], max_acres: 5, limit: 50 },
    color: 'blue',
  },
  {
    id: 'commercial',
    label: '🏢 Commercial',
    icon: '🏢',
    filters: { use_codes: ['C'], limit: 50 },
    color: 'orange',
  },
  {
    id: 'large_undeveloped',
    label: '📐 Large Undeveloped',
    icon: '📐',
    filters: { min_acres: 20, limit: 50 },
    color: 'gray',
  },
];

export default function QuickFilters({ onSelectFilter, activeFilterId }) {
  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <div className="text-xs font-semibold text-gray-700 flex items-center gap-1 mr-2">
        <Zap size={14} className="text-[#0078d4]" />
        Quick Filters:
      </div>
      {QUICK_FILTERS.map((qf) => (
        <button
          key={qf.id}
          onClick={() => onSelectFilter(qf)}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
            activeFilterId === qf.id
              ? 'bg-[#0078d4] text-white shadow-sm'
              : 'bg-white text-gray-700 border border-gray-200 hover:border-[#0078d4] hover:bg-blue-50'
          }`}
        >
          <span className="mr-1">{qf.icon}</span>
          {qf.label}
        </button>
      ))}
    </div>
  );
}
