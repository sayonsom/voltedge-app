import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';
import { logError } from '@/utils/error-handler';

/**
 * Search Service
 * Handles searching and listing analysis history
 */

/**
 * Search for analyses
 * @param {Object} params - Search parameters
 * @param {string} [params.query] - Search query
 * @param {string} [params.status] - Filter by status
 * @param {string} [params.start_date] - Filter by start date
 * @param {string} [params.end_date] - Filter by end date
 * @param {number} [params.limit=50] - Maximum results
 * @param {number} [params.offset=0] - Offset for pagination
 * @returns {Promise<Array>} Array of analyses
 */
export async function searchAnalyses(params = {}) {
  try {
    const queryParams = {
      limit: 50,
      offset: 0,
      ...params,
    };

    const response = await apiClient.getClient().get(
      API_ENDPOINTS.analyses,
      { params: queryParams }
    );
    
    console.log('[Search Service] Found analyses:', response.data.results?.length || 0);
    return response.data.results || [];
  } catch (error) {
    logError('searchAnalyses', error, { params });
    throw error;
  }
}

/**
 * Get recent analyses
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} Array of recent analyses
 */
export async function getRecentAnalyses(limit = 10) {
  try {
    const results = await searchAnalyses({ limit });
    return results;
  } catch (error) {
    logError('getRecentAnalyses', error, { limit });
    throw error;
  }
}

/**
 * Get analyses by status
 * @param {string} status - Status to filter by (completed, failed, pending, processing)
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} Array of analyses
 */
export async function getAnalysesByStatus(status, limit = 50) {
  try {
    const results = await searchAnalyses({ status, limit });
    return results;
  } catch (error) {
    logError('getAnalysesByStatus', error, { status, limit });
    throw error;
  }
}

/**
 * Get analyses by date range
 * @param {string} startDate - Start date (ISO format)
 * @param {string} endDate - End date (ISO format)
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} Array of analyses
 */
export async function getAnalysesByDateRange(startDate, endDate, limit = 50) {
  try {
    const results = await searchAnalyses({
      start_date: startDate,
      end_date: endDate,
      limit,
    });
    return results;
  } catch (error) {
    logError('getAnalysesByDateRange', error, { startDate, endDate, limit });
    throw error;
  }
}

/**
 * Search analyses by site name
 * @param {string} query - Search query
 * @param {number} limit - Number of results
 * @returns {Promise<Array>} Array of matching analyses
 */
export async function searchBySiteName(query, limit = 50) {
  try {
    const results = await searchAnalyses({ query, limit });
    return results;
  } catch (error) {
    logError('searchBySiteName', error, { query, limit });
    throw error;
  }
}

/**
 * Get analysis statistics
 * @returns {Promise<Object>} Statistics object
 */
export async function getAnalysisStatistics() {
  try {
    // Get all analyses to calculate stats
    const allAnalyses = await searchAnalyses({ limit: 1000 });
    
    const stats = {
      total: allAnalyses.length,
      completed: allAnalyses.filter(a => a.status === 'completed').length,
      failed: allAnalyses.filter(a => a.status === 'failed').length,
      pending: allAnalyses.filter(a => a.status === 'pending').length,
      processing: allAnalyses.filter(a => a.status === 'processing').length,
    };
    
    // Calculate success rate
    stats.successRate = stats.total > 0 
      ? ((stats.completed / stats.total) * 100).toFixed(1)
      : 0;
    
    return stats;
  } catch (error) {
    logError('getAnalysisStatistics', error);
    throw error;
  }
}
