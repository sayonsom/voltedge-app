import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api';
import { logError } from '@/utils/error-handler';

/**
 * Report Service
 * Handles PDF report generation and download
 */

/**
 * Download PDF report for an analysis
 * @param {string} analysisId - Analysis ID
 * @returns {Promise<Blob>} PDF blob
 */
export async function downloadPDFReport(analysisId) {
  try {
    const response = await apiClient.getClient().get(
      API_ENDPOINTS.report(analysisId),
      {
        responseType: 'blob',
      }
    );
    
    console.log('[Report Service] PDF downloaded:', analysisId);
    return response.data;
  } catch (error) {
    logError('downloadPDFReport', error, { analysisId });
    throw error;
  }
}

/**
 * Download and save PDF to user's device
 * @param {string} analysisId - Analysis ID
 * @param {string} siteName - Site name for filename
 * @returns {Promise<Object>} Result object with success status
 */
export async function downloadAndSavePDF(analysisId, siteName) {
  try {
    const blob = await downloadPDFReport(analysisId);
    
    // Create filename
    const timestamp = new Date().toISOString().split('T')[0];
    const safeSiteName = siteName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = `${safeSiteName}_analysis_${timestamp}_${analysisId.slice(0, 8)}.pdf`;
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('[Report Service] PDF saved:', fileName);
    return { success: true, fileName };
  } catch (error) {
    logError('downloadAndSavePDF', error, { analysisId, siteName });
    return { success: false, error: error.message };
  }
}

/**
 * Check if report is available for an analysis
 * @param {string} analysisId - Analysis ID
 * @returns {Promise<boolean>} True if report is available
 */
export async function isReportAvailable(analysisId) {
  try {
    // Try HEAD request first to check if report exists
    await apiClient.getClient().head(
      API_ENDPOINTS.report(analysisId)
    );
    return true;
  } catch (error) {
    if (error.response?.status === 404) {
      return false;
    }
    logError('isReportAvailable', error, { analysisId });
    throw error;
  }
}

/**
 * Open PDF report in new tab
 * @param {string} analysisId - Analysis ID
 * @returns {Promise<Object>} Result object
 */
export async function openPDFInNewTab(analysisId) {
  try {
    const blob = await downloadPDFReport(analysisId);
    const url = window.URL.createObjectURL(blob);
    
    window.open(url, '_blank');
    
    // Cleanup after a delay (PDF needs time to load)
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
    }, 100);
    
    return { success: true };
  } catch (error) {
    logError('openPDFInNewTab', error, { analysisId });
    return { success: false, error: error.message };
  }
}
