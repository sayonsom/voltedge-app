"use client";

import { useState } from 'react';
import { ChevronDown, Download, BarChart3, GitCompare, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ResultsTable({ parcels, onSelectParcel, onBulkExport, onBulkAnalyze, onCompare }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortBy, setSortBy] = useState('parcel_number');
  const [sortOrder, setSortOrder] = useState('asc');

  const toggleSelect = (parcelNumber) => {
    setSelectedIds(prev =>
      prev.includes(parcelNumber)
        ? prev.filter(id => id !== parcelNumber)
        : [...prev, parcelNumber]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === parcels.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(parcels.map(p => p.parcel_number));
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const sortedParcels = [...parcels].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (aVal === bVal) return 0;
    const comparison = aVal < bVal ? -1 : 1;
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const formatCurrency = (value) => value ? `$${value.toLocaleString()}` : 'N/A';

  const handleBulkAction = (action) => {
    const selected = parcels.filter(p => selectedIds.includes(p.parcel_number));
    switch (action) {
      case 'export-csv':
        onBulkExport?.(selected, 'csv');
        break;
      case 'export-pdf':
        onBulkExport?.(selected, 'pdf');
        break;
      case 'analyze':
        onBulkAnalyze?.(selected);
        break;
      case 'compare':
        onCompare?.(selected);
        break;
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded shadow-sm">
      {/* Bulk Actions Bar */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border-b border-blue-200 p-3 flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">
            {selectedIds.length} parcel(s) selected
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => handleBulkAction('export-csv')}
              variant="secondary"
              className="text-xs py-1.5 px-3"
              icon={<Download size={14} />}
            >
              Export CSV
            </Button>
            <Button
              onClick={() => handleBulkAction('export-pdf')}
              variant="secondary"
              className="text-xs py-1.5 px-3"
              icon={<Download size={14} />}
            >
              Export PDF
            </Button>
            <Button
              onClick={() => handleBulkAction('analyze')}
              variant="secondary"
              className="text-xs py-1.5 px-3"
              icon={<BarChart3 size={14} />}
            >
              Batch Analyze
            </Button>
            {selectedIds.length >= 2 && selectedIds.length <= 3 && (
              <Button
                onClick={() => handleBulkAction('compare')}
                variant="secondary"
                className="text-xs py-1.5 px-3"
                icon={<GitCompare size={14} />}
              >
                Compare
              </Button>
            )}
            <Button
              onClick={() => setSelectedIds([])}
              variant="secondary"
              className="text-xs py-1.5 px-3"
              icon={<Trash2 size={14} />}
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
            <tr>
              <th className="px-3 py-2 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === parcels.length && parcels.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]"
                />
              </th>
              <th
                className="px-3 py-2 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('parcel_number')}
              >
                <div className="flex items-center gap-1">
                  APN
                  {sortBy === 'parcel_number' && <ChevronDown size={12} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
                </div>
              </th>
              <th
                className="px-3 py-2 text-left cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('owner_name')}
              >
                <div className="flex items-center gap-1">
                  Owner
                  {sortBy === 'owner_name' && <ChevronDown size={12} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
                </div>
              </th>
              <th className="px-3 py-2 text-left">Address</th>
              <th
                className="px-3 py-2 text-right cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('gis_acres')}
              >
                <div className="flex items-center justify-end gap-1">
                  Acres
                  {sortBy === 'gis_acres' && <ChevronDown size={12} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
                </div>
              </th>
              <th className="px-3 py-2 text-left">Use Type</th>
              <th
                className="px-3 py-2 text-right cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('total_value')}
              >
                <div className="flex items-center justify-end gap-1">
                  Value
                  {sortBy === 'total_value' && <ChevronDown size={12} className={sortOrder === 'desc' ? 'rotate-180' : ''} />}
                </div>
              </th>
              <th className="px-3 py-2 text-center">QOZ</th>
            </tr>
          </thead>
          <tbody>
            {sortedParcels.map((parcel) => (
              <tr
                key={parcel.parcel_number}
                className={`border-t border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                  selectedIds.includes(parcel.parcel_number) ? 'bg-blue-50' : ''
                }`}
                onClick={() => onSelectParcel?.(parcel)}
              >
                <td className="px-3 py-2" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(parcel.parcel_number)}
                    onChange={() => toggleSelect(parcel.parcel_number)}
                    className="rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]"
                  />
                </td>
                <td className="px-3 py-2 font-mono text-[#0078d4] font-semibold">
                  {parcel.parcel_number}
                </td>
                <td className="px-3 py-2 text-gray-900">{parcel.owner_name || 'N/A'}</td>
                <td className="px-3 py-2 text-gray-700">
                  {parcel.site_address || 'N/A'}
                  {parcel.site_city && (
                    <div className="text-[10px] text-gray-500">
                      {parcel.site_city}, {parcel.site_state}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-right font-semibold text-gray-900">
                  {parcel.gis_acres?.toFixed(2) || 'N/A'}
                </td>
                <td className="px-3 py-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${
                    parcel.use_code === 'A' ? 'bg-green-100 text-green-800' :
                    parcel.use_code === 'R' ? 'bg-blue-100 text-blue-800' :
                    parcel.use_code === 'C' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {parcel.use_description || parcel.use_code || 'N/A'}
                  </span>
                </td>
                <td className="px-3 py-2 text-right text-gray-900">
                  {formatCurrency(parcel.total_value)}
                </td>
                <td className="px-3 py-2 text-center">
                  {parcel.qualified_opportunity_zone && (
                    <span className="text-yellow-600">⭐</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {parcels.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No parcels found. Try adjusting your search criteria.
        </div>
      )}
    </div>
  );
}
