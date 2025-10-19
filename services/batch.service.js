import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS, API_CONFIG } from '@/config/api';
import { logError } from '@/utils/error-handler';

/**
 * Batch Analysis Service
 * Handles batch processing of multiple site analyses
 */

/**
 * Start batch analysis for multiple sites
 * @param {Array<Object>} sites - Array of site analysis requests
 * @returns {Promise<Object>} Batch response with batch_id
 */
export async function startBatchAnalysis(sites) {
  try {
    const response = await apiClient.getClient().post(
      API_ENDPOINTS.batchAnalyze,
      { sites }
    );
    
    console.log('[Batch Service] Batch started:', response.data.batch_id);
    return response.data;
  } catch (error) {
    logError('startBatchAnalysis', error, { siteCount: sites.length });
    throw error;
  }
}

/**
 * Get batch analysis status
 * @param {string} batchId - Batch ID
 * @returns {Promise<Object>} Batch status with all jobs
 */
export async function getBatchStatus(batchId) {
  try {
    const response = await apiClient.getClient().get(
      API_ENDPOINTS.batchStatus(batchId)
    );
    return response.data;
  } catch (error) {
    logError('getBatchStatus', error, { batchId });
    throw error;
  }
}

/**
 * Poll batch status until completion
 * @param {string} batchId - Batch ID to monitor
 * @param {Function} onUpdate - Callback for status updates
 * @param {Object} options - Polling options
 * @returns {Function} Cleanup function to stop polling
 */
export function pollBatchStatus(batchId, onUpdate, options = {}) {
  const interval = options.interval || API_CONFIG.polling.interval * 1.5; // Slightly longer for batch
  const maxAttempts = options.maxAttempts || API_CONFIG.polling.maxAttempts;
  
  let attempts = 0;
  let stopped = false;
  
  const pollInterval = setInterval(async () => {
    if (stopped) {
      clearInterval(pollInterval);
      return;
    }
    
    attempts++;
    
    try {
      const status = await getBatchStatus(batchId);
      onUpdate(status);
      
      // Stop polling if batch is done or max attempts reached
      const isDone = [
        'completed',
        'failed', 
        'partially_completed'
      ].includes(status.overall_status);
      
      if (isDone || attempts >= maxAttempts) {
        clearInterval(pollInterval);
        stopped = true;
      }
    } catch (error) {
      logError('pollBatchStatus', error, { batchId, attempts });
      
      // Stop on critical errors
      if (error.response?.status === 404 || error.response?.status === 401) {
        clearInterval(pollInterval);
        stopped = true;
        onUpdate({ 
          overall_status: 'failed', 
          error: 'Batch not found or access denied' 
        });
      }
    }
  }, interval);
  
  return () => {
    stopped = true;
    clearInterval(pollInterval);
  };
}

/**
 * Cancel a batch analysis
 * @param {string} batchId - Batch ID to cancel
 * @returns {Promise<Object>} Cancellation result
 */
export async function cancelBatchAnalysis(batchId) {
  try {
    const response = await apiClient.getClient().delete(
      API_ENDPOINTS.batchStatus(batchId)
    );
    
    console.log('[Batch Service] Batch cancelled:', batchId);
    return response.data;
  } catch (error) {
    logError('cancelBatchAnalysis', error, { batchId });
    throw error;
  }
}

/**
 * Validate batch request
 * @param {Array<Object>} sites - Sites array to validate
 * @returns {Object} Validation result
 */
export function validateBatchRequest(sites) {
  const errors = [];
  
  if (!Array.isArray(sites)) {
    return {
      valid: false,
      errors: ['Sites must be an array']
    };
  }
  
  if (sites.length === 0) {
    errors.push('At least one site is required');
  }
  
  if (sites.length > 100) {
    errors.push('Maximum 100 sites per batch');
  }
  
  // Validate each site
  sites.forEach((site, index) => {
    if (!site.site_name) {
      errors.push(`Site ${index + 1}: Name is required`);
    }
    if (typeof site.latitude !== 'number') {
      errors.push(`Site ${index + 1}: Valid latitude required`);
    }
    if (typeof site.longitude !== 'number') {
      errors.push(`Site ${index + 1}: Valid longitude required`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}
