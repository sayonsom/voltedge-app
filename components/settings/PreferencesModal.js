"use client";

import { useState, useEffect } from 'react';
import { X, Download, Upload, RotateCcw, Save } from 'lucide-react';
import { 
  getPreferences, 
  updatePreferences, 
  resetPreferences,
  exportPreferences,
  importPreferences 
} from '@/utils/userPreferences';

export default function PreferencesModal({ isOpen, onClose }) {
  const [preferences, setPreferences] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPreferences(getPreferences());
      setHasChanges(false);
    }
  }, [isOpen]);

  const handleChange = (category, key, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updatePreferences(preferences);
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    if (confirm('Reset all preferences to defaults?')) {
      const defaults = resetPreferences();
      setPreferences(defaults);
      setHasChanges(false);
    }
  };

  const handleExport = () => {
    exportPreferences();
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importPreferences(file);
      setPreferences(imported);
      setHasChanges(false);
      alert('Preferences imported successfully!');
    } catch (error) {
      alert(`Failed to import preferences: ${error.message}`);
    }
    e.target.value = ''; // Reset input
  };

  if (!isOpen || !preferences) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">User Preferences</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Export Preferences */}
          <section>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Export Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Export Format
                </label>
                <select
                  value={preferences.export.format}
                  onChange={(e) => handleChange('export', 'format', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                >
                  <option value="csv">CSV</option>
                  <option value="pdf">PDF</option>
                  <option value="json">JSON</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.export.includeGeometry}
                    onChange={(e) => handleChange('export', 'includeGeometry', e.target.checked)}
                    className="rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]"
                  />
                  <span>Include Geometry Data</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.export.includeValuation}
                    onChange={(e) => handleChange('export', 'includeValuation', e.target.checked)}
                    className="rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]"
                  />
                  <span>Include Valuation Data</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.export.includeOwnership}
                    onChange={(e) => handleChange('export', 'includeOwnership', e.target.checked)}
                    className="rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]"
                  />
                  <span>Include Ownership Data</span>
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.export.includeLandInfo}
                    onChange={(e) => handleChange('export', 'includeLandInfo', e.target.checked)}
                    className="rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]"
                  />
                  <span>Include Land Information</span>
                </label>
              </div>
            </div>
          </section>

          {/* Map Preferences */}
          <section>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Map Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Zoom Level
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={preferences.map.defaultZoom}
                  onChange={(e) => handleChange('map', 'defaultZoom', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marker Style
                </label>
                <select
                  value={preferences.map.markerStyle}
                  onChange={(e) => handleChange('map', 'markerStyle', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                >
                  <option value="default">Default</option>
                  <option value="clusters">Clustered</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.map.autoSearch}
                  onChange={(e) => handleChange('map', 'autoSearch', e.target.checked)}
                  className="rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]"
                />
                <span>Auto-search on map movement</span>
              </label>
            </div>
          </section>

          {/* Search Preferences */}
          <section>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Search Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Result Limit
                </label>
                <input
                  type="number"
                  min="10"
                  max="500"
                  step="10"
                  value={preferences.search.defaultLimit}
                  onChange={(e) => handleChange('search', 'defaultLimit', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Default Search Radius (miles)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={preferences.search.defaultRadius}
                  onChange={(e) => handleChange('search', 'defaultRadius', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.search.saveSearchHistory}
                  onChange={(e) => handleChange('search', 'saveSearchHistory', e.target.checked)}
                  className="rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]"
                />
                <span>Save search history</span>
              </label>
            </div>
          </section>

          {/* Display Preferences */}
          <section>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Display Settings</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  value={preferences.display.theme}
                  onChange={(e) => handleChange('display', 'theme', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark (Coming Soon)</option>
                </select>
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.display.compactMode}
                  onChange={(e) => handleChange('display', 'compactMode', e.target.checked)}
                  className="rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]"
                />
                <span>Compact mode</span>
              </label>

              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={preferences.display.showTableByDefault}
                  onChange={(e) => handleChange('display', 'showTableByDefault', e.target.checked)}
                  className="rounded border-gray-300 text-[#0078d4] focus:ring-[#0078d4]"
                />
                <span>Show table view by default</span>
              </label>
            </div>
          </section>

          {/* Import/Export Actions */}
          <section>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Backup & Restore</h3>
            <div className="flex gap-2">
              <button
                onClick={handleExport}
                className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors"
              >
                <Download size={16} />
                Export Preferences
              </button>
              <label className="flex-1">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <div className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-900 py-2 px-4 rounded flex items-center justify-center gap-2 transition-colors cursor-pointer">
                  <Upload size={16} />
                  Import Preferences
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={handleReset}
            className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
          >
            <RotateCcw size={14} />
            Reset to Defaults
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`px-4 py-2 rounded flex items-center gap-2 transition-colors ${
                hasChanges
                  ? 'bg-[#0078d4] hover:bg-[#106ebe] text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
