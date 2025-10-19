/**
 * Recent Parcels Utility
 * Manages recently viewed parcels in localStorage
 */

const STORAGE_KEY = 'voltedge_recent_parcels';
const MAX_RECENT = 10;

/**
 * Add a parcel to recent history
 * @param {Object} parcel - Parcel data
 */
export function addRecentParcel(parcel) {
  if (!parcel || !parcel.parcel_number) return;

  try {
    const recent = getRecentParcels();
    
    // Remove if already exists (to move to top)
    const filtered = recent.filter(p => p.parcel_number !== parcel.parcel_number);
    
    // Add to beginning
    const updated = [
      {
        parcel_number: parcel.parcel_number,
        site_address: parcel.site_address,
        site_city: parcel.site_city,
        site_state: parcel.site_state,
        owner_name: parcel.owner_name,
        gis_acres: parcel.gis_acres,
        use_description: parcel.use_description,
        total_value: parcel.total_value,
        qualified_opportunity_zone: parcel.qualified_opportunity_zone,
        latitude: parcel.latitude,
        longitude: parcel.longitude,
        viewed_at: new Date().toISOString(),
      },
      ...filtered
    ].slice(0, MAX_RECENT); // Keep only MAX_RECENT items

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save recent parcel:', error);
  }
}

/**
 * Get recent parcels
 * @param {number} limit - Maximum number to return
 * @returns {Array} Recent parcels
 */
export function getRecentParcels(limit = MAX_RECENT) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const recent = JSON.parse(stored);
    return recent.slice(0, limit);
  } catch (error) {
    console.error('Failed to load recent parcels:', error);
    return [];
  }
}

/**
 * Clear all recent parcels
 */
export function clearRecentParcels() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear recent parcels:', error);
  }
}

/**
 * Remove a specific parcel from recent history
 * @param {string} parcelNumber - Parcel number to remove
 */
export function removeRecentParcel(parcelNumber) {
  try {
    const recent = getRecentParcels();
    const filtered = recent.filter(p => p.parcel_number !== parcelNumber);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to remove recent parcel:', error);
  }
}
