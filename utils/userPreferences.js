/**
 * User Preferences Utility
 * Manages user settings and preferences in localStorage
 */

const STORAGE_KEY = 'voltedge_user_preferences';

// Default preferences
const DEFAULT_PREFERENCES = {
  export: {
    format: 'csv', // 'csv', 'pdf', 'json'
    includeGeometry: true,
    includeValuation: true,
    includeOwnership: true,
    includeLandInfo: true,
  },
  map: {
    defaultCenter: { lat: 39.06, lng: -76.06 }, // Maryland
    defaultZoom: 10,
    markerStyle: 'default', // 'default', 'clusters'
    autoSearch: true, // Auto-search on map move
  },
  search: {
    defaultLimit: 50,
    defaultRadius: 10, // miles
    saveSearchHistory: true,
  },
  display: {
    theme: 'light', // 'light', 'dark'
    compactMode: false,
    showTableByDefault: false,
  },
};

/**
 * Get all user preferences
 * @returns {Object} User preferences
 */
export function getPreferences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...DEFAULT_PREFERENCES };
    
    const preferences = JSON.parse(stored);
    // Merge with defaults to ensure all keys exist
    return {
      export: { ...DEFAULT_PREFERENCES.export, ...preferences.export },
      map: { ...DEFAULT_PREFERENCES.map, ...preferences.map },
      search: { ...DEFAULT_PREFERENCES.search, ...preferences.search },
      display: { ...DEFAULT_PREFERENCES.display, ...preferences.display },
    };
  } catch (error) {
    console.error('Failed to load preferences:', error);
    return { ...DEFAULT_PREFERENCES };
  }
}

/**
 * Get a specific preference category
 * @param {string} category - Category name (export, map, search, display)
 * @returns {Object} Preference category
 */
export function getPreferenceCategory(category) {
  const prefs = getPreferences();
  return prefs[category] || {};
}

/**
 * Update preferences (partial update)
 * @param {Object} updates - Partial preferences to update
 */
export function updatePreferences(updates) {
  try {
    const current = getPreferences();
    const updated = {
      ...current,
      ...updates,
      // Deep merge each category
      export: { ...current.export, ...updates.export },
      map: { ...current.map, ...updates.map },
      search: { ...current.search, ...updates.search },
      display: { ...current.display, ...updates.display },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Failed to update preferences:', error);
    return getPreferences();
  }
}

/**
 * Update a specific preference category
 * @param {string} category - Category name
 * @param {Object} updates - Updates to apply to category
 */
export function updatePreferenceCategory(category, updates) {
  const current = getPreferences();
  return updatePreferences({
    [category]: { ...current[category], ...updates }
  });
}

/**
 * Reset preferences to defaults
 */
export function resetPreferences() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
    return { ...DEFAULT_PREFERENCES };
  } catch (error) {
    console.error('Failed to reset preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

/**
 * Export preferences as JSON file
 */
export function exportPreferences() {
  try {
    const prefs = getPreferences();
    const json = JSON.stringify(prefs, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `voltedge-preferences-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export preferences:', error);
  }
}

/**
 * Import preferences from JSON file
 * @param {File} file - JSON file containing preferences
 * @returns {Promise<Object>} Imported preferences
 */
export function importPreferences(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        const updated = updatePreferences(imported);
        resolve(updated);
      } catch (error) {
        reject(new Error('Invalid preferences file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
