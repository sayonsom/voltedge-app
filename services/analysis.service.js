import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS, API_CONFIG } from '@/config/api';
import { cacheAnalysis, getCachedAnalysis } from '@/utils/cache';
import { logError } from '@/utils/error-handler';

/**
 * Analysis Service
 * Handles all buildable area analysis operations
 */

/**
 * Start a new buildable area analysis
 * @param {Object} request - Analysis parameters
 * @param {string} request.site_name - Name of the site
 * @param {Object} [request.geojson] - GeoJSON polygon for analysis area
 * @param {number} [request.latitude] - Site latitude (used if no geojson)
 * @param {number} [request.longitude] - Site longitude (used if no geojson)
 * @param {number} [request.bbox_size_meters=500] - Bounding box size in meters (used if no geojson)
 * @param {number} [request.capacity_mw=35] - Solar capacity in MW
 * @param {Object} [request.constraints] - Analysis constraints
 * @returns {Promise<Object>} Job status with job_id
 */
export async function startAnalysis(request) {
  try {
    console.log('[Analysis Service] Input request:', request);

    // Build request payload for /api/v1/buildable-area/analyze endpoint
    const payload = {
      site_name: request.site_name || 'Untitled Site',
      project_name: request.site_name || 'Untitled Site',
      include_dem_analysis: true,
      include_grid_analysis: true,
      include_solar_resource: true,
      dataset_preference: 'Digital Elevation Model (DEM) 1 meter'
    };

    // Priority 1: Use GeoJSON if provided
    if (request.geojson) {
      console.log('[Analysis Service] GeoJSON provided:', JSON.stringify(request.geojson, null, 2));

      payload.geojson = request.geojson;

      // Extract center coordinates from GeoJSON for lat/lon fields
      // GeoJSON coordinates are [longitude, latitude]
      let coords = null;

      if (request.geojson.type === 'Polygon' && request.geojson.coordinates?.[0]?.length > 0) {
        coords = request.geojson.coordinates[0];
      } else if (request.geojson.type === 'Feature' && request.geojson.geometry?.type === 'Polygon') {
        coords = request.geojson.geometry.coordinates[0];
        // If it's a Feature, send the geometry as geojson
        payload.geojson = request.geojson.geometry;
      }

      if (coords && coords.length > 0) {
        const lats = coords.map(c => c[1]); // latitude is second element
        const lngs = coords.map(c => c[0]); // longitude is first element
        payload.latitude = parseFloat(((Math.min(...lats) + Math.max(...lats)) / 2).toFixed(6));
        payload.longitude = parseFloat(((Math.min(...lngs) + Math.max(...lngs)) / 2).toFixed(6));

        console.log('[Analysis Service] Extracted coordinates:', {
          latitude: payload.latitude,
          longitude: payload.longitude,
          bbox: {
            minLat: Math.min(...lats),
            maxLat: Math.max(...lats),
            minLng: Math.min(...lngs),
            maxLng: Math.max(...lngs)
          }
        });
      } else {
        console.warn('[Analysis Service] Could not extract coordinates from GeoJSON');
      }

      console.log('[Analysis Service] Using GeoJSON polygon');
    }
    // Priority 2: Use lat/lon if provided
    else if (request.latitude && request.longitude) {
      payload.latitude = request.latitude;
      payload.longitude = request.longitude;
      console.log('[Analysis Service] Using lat/lon coordinates');
    } else {
      throw new Error('Either geojson or latitude/longitude must be provided');
    }

    // Ensure latitude and longitude are always present
    if (!payload.latitude || !payload.longitude) {
      console.error('[Analysis Service] Missing latitude/longitude in payload:', payload);
      throw new Error('Could not determine latitude/longitude from request');
    }

    console.log('[Analysis Service] Sending analysis request');
    console.log('[Analysis Service] Endpoint:', API_ENDPOINTS.analyze);
    console.log('[Analysis Service] Base URL:', apiClient.getClient().defaults.baseURL);
    console.log('[Analysis Service] Payload:', JSON.stringify(payload, null, 2));

    // Backend returns immediately with job_id
    const response = await apiClient.getClient().post(
      API_ENDPOINTS.analyze,
      payload,
      {
        skipAuth: true,
        timeout: 120000, // 120 seconds (2 minutes - backend should return job_id quickly)
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('[Analysis Service] Analysis started successfully');
    console.log('[Analysis Service] Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('[Analysis Service] Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      request: request
    });
    logError('startAnalysis', error, { request });
    throw error;
  }
}

/**
 * Get current status of an analysis job
 * @param {string} jobId - Job ID from startAnalysis
 * @returns {Promise<Object>} Current job status
 */
export async function getAnalysisStatus(jobId) {
  try {
    const response = await apiClient.getClient().get(
      API_ENDPOINTS.status(jobId),
      { skipAuth: true }
    );
    return response.data;
  } catch (error) {
    logError('getAnalysisStatus', error, { jobId });
    throw error;
  }
}

/**
 * Get analysis results (includes attachments with signed URLs)
 * @param {string} jobId - Job ID from startAnalysis
 * @returns {Promise<Object>} Analysis results with attachments
 */
export async function getAnalysisResults(jobId) {
  try {
    const response = await apiClient.getClient().get(
      API_ENDPOINTS.results(jobId),
      { skipAuth: true }
    );
    return response.data;
  } catch (error) {
    logError('getAnalysisResults', error, { jobId });
    throw error;
  }
}

/**
 * Get a completed analysis by ID
 * @param {string} analysisId - Analysis ID
 * @param {boolean} useCache - Whether to use cached data
 * @returns {Promise<Object>} Complete analysis results
 */
export async function getAnalysis(analysisId, useCache = true) {
  try {
    // Check cache first
    if (useCache) {
      const cached = getCachedAnalysis(analysisId);
      if (cached) {
        console.log('[Analysis Service] Returning cached analysis:', analysisId);
        return cached;
      }
    }

    // Try the full analysis endpoint first (for completed analyses by analysis_id)
    try {
      const analysisResponse = await apiClient.getClient().get(
        API_ENDPOINTS.analysis(analysisId),
        { skipAuth: true }
      );
      let analysisData = analysisResponse.data;

      // Check if the response is a string (needs parsing)
      if (typeof analysisData === 'string') {
        console.log('[Analysis Service] Response is a string, parsing as JSON...');
        try {
          analysisData = JSON.parse(analysisData);
          console.log('[Analysis Service] Successfully parsed JSON');
        } catch (parseError) {
          console.error('[Analysis Service] Failed to parse response as JSON:', parseError);
          throw parseError;
        }
      }

      console.log('[Analysis Service] Raw analysis response:', analysisData);
      console.log('[Analysis Service] Analysis data keys:', Object.keys(analysisData || {}));
      console.log('[Analysis Service] Has attachments?', !!analysisData?.attachments);
      console.log('[Analysis Service] Has file_metadata?', !!analysisData?.file_metadata);
      console.log('[Analysis Service] Has maps?', !!analysisData?.maps);
      console.log('[Analysis Service] Has grid_connection?', !!analysisData?.grid_connection);
      console.log('[Analysis Service] Has solar_resource?', !!analysisData?.solar_resource);
      console.log('[Analysis Service] Has financial_metrics?', !!analysisData?.financial_metrics);
      console.log('[Analysis Service] Has data_sources?', !!analysisData?.data_sources);

      // If the response looks like a full analysis (has site_identification), wrap it
      if (analysisData && analysisData.site_identification) {
        const wrapped = {
          job_id: analysisId,
          status: 'completed',
          progress: 100,
          message: 'Analysis complete',
          result: analysisData,
          error: null,
          created_at: analysisData.site_identification?.analysis_date || new Date().toISOString()
        };
        cacheAnalysis(analysisId, wrapped);
        console.log('[Analysis Service] Returning wrapped analysis with full data');
        return wrapped;
      }
    } catch (analysisError) {
      // Continue to try status endpoint
      console.warn('[Analysis Service] Full analysis endpoint failed or not available, trying status endpoint');
    }
    
    // Try the status endpoint (for job IDs)
    try {
      const statusResponse = await apiClient.getClient().get(
        API_ENDPOINTS.status(analysisId),
        { skipAuth: true }
      );
      
      const statusData = statusResponse.data;
      
      // Cache if completed
      if (statusData.status === 'completed' && statusData.result) {
        cacheAnalysis(analysisId, statusData);
      }
      
      return statusData;
    } catch (statusError) {
      // Fallback: Search for analysis by ID
      console.log('[Analysis Service] Status endpoint failed, searching for analysis by ID');
      
      // Search all recent analyses to find this one
      const searchResponse = await apiClient.getClient().post(
        '/api/v1/buildable-area/search',
        { limit: 100 },
        { skipAuth: true }
      );
      
      // Find the analysis with matching ID
      const analyses = searchResponse.data.analyses || [];
      const matchingAnalysis = analyses.find(a => a.id === analysisId);
      
      if (!matchingAnalysis) {
        throw new Error(`Analysis ${analysisId} not found`);
      }
      
      // The search returns summary data; wrap into a completed-like structure
      const wrappedData = {
        job_id: analysisId,
        status: 'completed',
        progress: 100,
        message: 'Analysis complete',
        result: {
          site_identification: {
            site_name: matchingAnalysis.site_name,
            location: {
              latitude: matchingAnalysis.latitude,
              longitude: matchingAnalysis.longitude,
              address: matchingAnalysis.formatted_address,
              county: matchingAnalysis.county,
              state_code: matchingAnalysis.state_code,
            }
          },
          total_site_area: {
            total_acres: matchingAnalysis.total_acres,
          },
          buildable_area_summary: {
            net_buildable_acres: matchingAnalysis.net_buildable_acres,
            buildable_percentage: matchingAnalysis.buildable_percentage,
          },
          site_capacity_estimate: {
            estimated_dc_capacity_mw: matchingAnalysis.estimated_dc_capacity_mw,
          },
          recommendations: {
            site_suitability_rating: matchingAnalysis.site_suitability_rating,
          },
        },
        created_at: matchingAnalysis.created_at,
      };
      
      cacheAnalysis(analysisId, wrappedData);
      return wrappedData;
    }
  } catch (error) {
    logError('getAnalysis', error, { analysisId });
    throw error;
  }
}

/**
 * Poll analysis status until completion
 * @param {string} jobId - Job ID to monitor
 * @param {Function} onUpdate - Callback for status updates (status) => void
 * @param {Object} options - Polling options
 * @param {number} [options.interval] - Polling interval in ms
 * @param {number} [options.maxAttempts] - Maximum polling attempts
 * @returns {Function} Cleanup function to stop polling
 */
export function pollAnalysisStatus(jobId, onUpdate, options = {}) {
  const interval = options.interval || API_CONFIG.polling.interval;
  const maxAttempts = options.maxAttempts || API_CONFIG.polling.maxAttempts;

  let attempts = 0;
  let stopped = false;
  let consecutiveErrors = 0;

  const pollInterval = setInterval(async () => {
    if (stopped) {
      clearInterval(pollInterval);
      return;
    }

    attempts++;
    console.log(`[Polling] Attempt ${attempts}/${maxAttempts} for job ${jobId}`);

    try {
      const status = await getAnalysisStatus(jobId);
      consecutiveErrors = 0; // Reset error count on success
      onUpdate(status);

      // Stop polling if completed, failed, or max attempts reached
      if (
        status.status === 'completed' ||
        status.status === 'failed' ||
        attempts >= maxAttempts
      ) {
        if (attempts >= maxAttempts && status.status !== 'completed') {
          console.warn(`[Polling] Max attempts reached for job ${jobId}, marking as timeout`);
          onUpdate({
            status: 'failed',
            error: 'Analysis timed out after 30 minutes. The backend may still be processing.'
          });
        }
        clearInterval(pollInterval);
        stopped = true;
      }
    } catch (error) {
      consecutiveErrors++;
      console.error(`[Polling] Error ${consecutiveErrors} for job ${jobId}:`, error.message);
      logError('pollAnalysisStatus', error, { jobId, attempts, consecutiveErrors });

      // Stop polling if critical error or too many consecutive errors
      if (
        error.response?.status === 404 ||
        error.response?.status === 401 ||
        consecutiveErrors >= 5
      ) {
        clearInterval(pollInterval);
        stopped = true;

        let errorMessage = 'Analysis not found or access denied';
        if (consecutiveErrors >= 5) {
          errorMessage = 'Backend connection lost. The analysis may have failed or the server restarted.';
        }

        onUpdate({
          status: 'failed',
          error: errorMessage,
          message: errorMessage
        });
      }
    }
  }, interval);

  // Return cleanup function
  return () => {
    stopped = true;
    clearInterval(pollInterval);
  };
}

/**
 * Search for analyses
 * @param {Object} params - Search parameters
 * @param {number} [params.limit] - Maximum number of results
 * @param {number} [params.offset] - Offset for pagination
 * @returns {Promise<Object>} Search results with count and analyses array
 */
export async function searchAnalyses(params = {}) {
  try {
    // Backend uses POST /api/v1/buildable-area/search
    const response = await apiClient.getClient().post(
      API_ENDPOINTS.search,
      params,
      { skipAuth: true }
    );

    return response.data;
  } catch (error) {
    // Log but don't throw - return empty array as fallback
    console.warn('[Analysis Service] Failed to fetch analyses:', error.message);
    logError('searchAnalyses', error, { params });

    // Return empty result structure
    return {
      count: 0,
      analyses: [],
      total: 0
    };
  }
}

/**
 * Cancel an ongoing analysis
 * @param {string} jobId - Job ID to cancel
 * @returns {Promise<Object>} Cancellation result
 */
export async function cancelAnalysis(jobId) {
  try {
    const response = await apiClient.getClient().delete(
      API_ENDPOINTS.status(jobId)
    );
    
    console.log('[Analysis Service] Analysis cancelled:', jobId);
    return response.data;
  } catch (error) {
    logError('cancelAnalysis', error, { jobId });
    throw error;
  }
}

/**
 * Validate analysis request before submission
 * @param {Object} request - Analysis request to validate
 * @returns {Object} Validation result { valid: boolean, errors: Array }
 */
export function validateAnalysisRequest(request) {
  const errors = [];
  
  // Validate latitude
  if (typeof request.latitude !== 'number') {
    errors.push('Latitude must be a number');
  } else if (request.latitude < -90 || request.latitude > 90) {
    errors.push('Latitude must be between -90 and 90');
  }
  
  // Validate longitude
  if (typeof request.longitude !== 'number') {
    errors.push('Longitude must be a number');
  } else if (request.longitude < -180 || request.longitude > 180) {
    errors.push('Longitude must be between -180 and 180');
  }
  
  // Validate site name
  if (!request.site_name || typeof request.site_name !== 'string') {
    errors.push('Site name is required');
  } else if (request.site_name.length < 1) {
    errors.push('Site name cannot be empty');
  } else if (request.site_name.length > 255) {
    errors.push('Site name must be less than 255 characters');
  }
  
  // Validate bbox_size_meters
  if (request.bbox_size_meters !== undefined) {
    if (typeof request.bbox_size_meters !== 'number') {
      errors.push('Bounding box size must be a number');
    } else if (request.bbox_size_meters < 100 || request.bbox_size_meters > 5000) {
      errors.push('Bounding box size must be between 100 and 5000 meters');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
