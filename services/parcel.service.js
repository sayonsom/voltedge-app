import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';
import { logError } from '@/utils/error-handler';
import { getParcelById as getMockParcelById, MOCK_PARCELS } from '@/utils/mockParcelData';

/**
 * Parcel Service
 * Handles parcel search, retrieval, and related project/search history
 */

/**
 * Search parcels with comprehensive filters
 * @param {Object} params - Search parameters
 * @param {string} [params.query] - Text search (owner, address, city)
 * @param {number} [params.latitude] - Center point latitude
 * @param {number} [params.longitude] - Center point longitude
 * @param {number} [params.radius_miles=10] - Search radius in miles
 * @param {number} [params.min_acres] - Minimum parcel size
 * @param {number} [params.max_acres] - Maximum parcel size
 * @param {string[]} [params.use_codes] - Use codes (A, R, C, I)
 * @param {boolean} [params.qoz_only=false] - QOZ only
 * @param {string} [params.county] - County name
 * @param {string} [params.state] - State code
 * @param {string} [params.zip_code] - ZIP code
 * @param {number} [params.limit=50] - Results limit
 * @param {number} [params.offset=0] - Pagination offset
 * @returns {Promise<Object>} { parcels, total_count, returned_count, has_more }
 */
export async function searchParcels(params = {}) {
  try {
    const response = await apiClient.getClient().post(
      API_ENDPOINTS.parcels.search,
      params
    );

    return response.data;
  } catch (error) {
    logError('searchParcels', error, { params });
    throw error;
  }
}

/**
 * Get detailed parcel information
 * @param {string} parcelNumber - Parcel number or ID
 * @returns {Promise<Object>} Detailed parcel data
 */
export async function getParcelById(parcelNumber) {
  // Try mock data first
  const mockParcel = getMockParcelById(parcelNumber);
  if (mockParcel) {
    return Promise.resolve(mockParcel);
  }

  // Fall back to API if not found in mock data
  try {
    const response = await apiClient.getClient().get(
      API_ENDPOINTS.parcels.byId(parcelNumber)
    );
    return response.data;
  } catch (error) {
    logError('getParcelById', error, { parcelNumber });
    throw error;
  }
}

/**
 * Get parcel as GeoJSON feature
 * @param {string} parcelNumber - Parcel number
 * @returns {Promise<Object>} GeoJSON Feature
 */
export async function getParcelGeoJSON(parcelNumber) {
  try {
    const response = await apiClient.getClient().get(
      API_ENDPOINTS.parcels.geojson(parcelNumber)
    );
    return response.data;
  } catch (error) {
    logError('getParcelGeoJSON', error, { parcelNumber });
    throw error;
  }
}

/**
 * Search parcels and get GeoJSON FeatureCollection
 * @param {Object} params - Same params as searchParcels
 * @returns {Promise<Object>} GeoJSON FeatureCollection
 */
export async function searchParcelsGeoJSON(params = {}) {
  try {
    const response = await apiClient.getClient().get(
      API_ENDPOINTS.parcels.searchGeoJSON,
      { params }
    );
    return response.data;
  } catch (error) {
    logError('searchParcelsGeoJSON', error, { params });
    throw error;
  }
}

/**
 * Get active projects for current user
 * @returns {Promise<Array>} projects
 */
export async function getActiveProjects() {
  try {
    const response = await apiClient.getClient().get(
      API_ENDPOINTS.projects.active
    );
    return response.data?.results || response.data || [];
  } catch (error) {
    logError('getActiveProjects', error);
    return [];
  }
}

/**
 * Get recent searches for pins
 * @param {number} limit
 * @returns {Promise<Array>} recent searches
 */
export async function getRecentSearches(limit = 10) {
  try {
    const response = await apiClient.getClient().get(
      API_ENDPOINTS.searches.recent,
      { params: { limit } }
    );
    return response.data?.results || response.data || [];
  } catch (error) {
    logError('getRecentSearches', error, { limit });
    return [];
  }
}
