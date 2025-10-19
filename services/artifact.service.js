import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';
import { logError } from '@/utils/error-handler';

/**
 * Artifact Service
 * Handles fetching analysis artifacts (PDFs, images, GeoJSON) from GCP Storage
 */

/**
 * Get all artifacts for an analysis with signed URLs
 * @param {string} analysisId
 * @returns {Promise<Array>} artifacts with signed URLs
 */
export async function getAnalysisArtifacts(analysisId) {
  try {
    const response = await apiClient.getClient().get(
      API_ENDPOINTS.artifacts(analysisId)
    );
    return response.data?.artifacts || [];
  } catch (error) {
    logError('getAnalysisArtifacts', error, { analysisId });
    throw error;
  }
}

/**
 * Get GeoJSON overlay for map rendering
 * @param {string} analysisId
 * @returns {Promise<Object>} GeoJSON FeatureCollection
 */
export async function getAnalysisGeoJSON(analysisId) {
  try {
    const response = await apiClient.getClient().get(
      API_ENDPOINTS.geojson(analysisId)
    );
    return response.data;
  } catch (error) {
    logError('getAnalysisGeoJSON', error, { analysisId });
    throw error;
  }
}

/**
 * Get artifact by type
 * @param {string} analysisId
 * @param {string} type - 'pdf', 'png', 'geojson', etc.
 * @returns {Promise<Object|null>} artifact or null if not found
 */
export async function getArtifactByType(analysisId, type) {
  try {
    const artifacts = await getAnalysisArtifacts(analysisId);
    return artifacts.find(a => a.type === type) || null;
  } catch (error) {
    logError('getArtifactByType', error, { analysisId, type });
    return null;
  }
}

/**
 * Get all attachments (images, PDFs) for an analysis with signed GCP URLs
 * This queries the file_metadata table which has gcp_path and signed URLs
 * @param {string} analysisId
 * @returns {Promise<Array>} attachments with signed URLs
 */
export async function getAnalysisAttachments(analysisId) {
  // Try multiple endpoints to get file metadata with GCP URLs
  const endpoints = [
    { name: 'files', url: API_ENDPOINTS.files(analysisId), dataKey: 'files' },
    { name: 'artifacts', url: API_ENDPOINTS.artifacts(analysisId), dataKey: 'artifacts' },
    { name: 'attachments', url: API_ENDPOINTS.attachments(analysisId), dataKey: 'attachments' }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`[Artifact Service] Trying ${endpoint.name} endpoint:`, endpoint.url);
      const response = await apiClient.getClient().get(endpoint.url, { skipAuth: true });

      const data = response.data?.[endpoint.dataKey] || response.data;

      if (Array.isArray(data) && data.length > 0) {
        console.log(`[Artifact Service] Success! Got ${data.length} files from ${endpoint.name}:`, data);

        // Transform to expected format with gcp_url
        return data.map(file => {
          let filename = file.filename || file.file_name || file.name;
          let gcpUrl = file.gcp_url || file.signed_url || file.url || file.gcp_path;

          // Fix backend bug: files are saved as "slope_heatmap.png.png" in DB
          // but actually exist as "slope_heatmap.png" in GCP
          // Remove double extension from filename and URL
          if (filename && filename.match(/\.(png|jpg|jpeg)\.png$/i)) {
            const correctedFilename = filename.replace(/\.(png|jpg|jpeg)$/i, '');
            console.log(`[Artifact Service] 🔧 Fixing double extension: "${filename}" → "${correctedFilename}"`);

            // Fix the signed URL by replacing the double extension in the path
            if (gcpUrl) {
              const originalUrl = gcpUrl;
              gcpUrl = gcpUrl.replace(encodeURIComponent(filename), encodeURIComponent(correctedFilename));
              gcpUrl = gcpUrl.replace(filename, correctedFilename);
              console.log(`[Artifact Service] 🔧 URL before: ${originalUrl.substring(0, 150)}...`);
              console.log(`[Artifact Service] 🔧 URL after:  ${gcpUrl.substring(0, 150)}...`);
            }

            filename = correctedFilename;
          }

          // Clean up type - remove .png suffix if it's in the type field
          const rawType = file.type || file.file_type || getFileType(filename);
          const cleanType = rawType.replace(/\.png$/i, '').replace(/\.jpg$/i, '').replace(/\.jpeg$/i, '');

          return {
            filename: filename,
            type: cleanType,
            description: file.description || getFileDescription(filename),
            gcp_url: gcpUrl,
            local_path: file.local_path || file.path,
            size: file.size || file.file_size,
            created_at: file.created_at
          };
        });
      }
    } catch (error) {
      console.warn(`[Artifact Service] ${endpoint.name} endpoint failed:`, error.message);
    }
  }

  console.warn('[Artifact Service] All endpoints failed, returning empty array');
  return [];
}

/**
 * Helper to determine file type from filename
 */
function getFileType(filename) {
  if (!filename) return 'unknown';
  if (filename.includes('slope_heatmap')) return 'slope_heatmap';
  if (filename.includes('suitability_map')) return 'suitability_map';
  if (filename.includes('buildable_area_map')) return 'buildable_area_map';
  if (filename.includes('elevation_profile')) return 'elevation_profile';
  return 'other';
}

/**
 * Helper to get description from filename
 */
function getFileDescription(filename) {
  if (!filename) return 'File';
  if (filename.includes('slope_heatmap')) return 'Slope Analysis Heatmap';
  if (filename.includes('suitability_map')) return 'Solar Suitability Map';
  if (filename.includes('buildable_area_map')) return 'Buildable Area Map';
  if (filename.includes('elevation_profile')) return 'Elevation Profile';
  return filename;
}
