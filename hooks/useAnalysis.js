import { useState, useCallback } from 'react';
import { 
  startAnalysis, 
  getAnalysisStatus, 
  getAnalysis,
  pollAnalysisStatus,
  validateAnalysisRequest 
} from '@/services/analysis.service';
import { handleAPIError } from '@/utils/error-handler';
import { useWebSocket } from './useWebSocket';

/**
 * React Hook for Analysis Operations
 * Manages the complete analysis lifecycle
 * 
 * @param {Object} options - Configuration options
 * @returns {Object} Analysis state and controls
 */
export function useAnalysis(options = {}) {
  const { useWebSocketUpdates = true } = options;
  
  const [jobId, setJobId] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [status, setStatus] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  // WebSocket for real-time updates
  const { lastMessage, isConnected: wsConnected } = useWebSocket(jobId, {
    autoConnect: useWebSocketUpdates && !!jobId,
    onComplete: (data) => {
      setResult(data.result);
      setStatus('completed');
      setProgress(100);
      setLoading(false);
      if (data.result?.analysis_id) {
        setAnalysisId(data.result.analysis_id);
      }
    },
    onError: (errorMsg) => {
      setError(errorMsg);
      setStatus('failed');
      setLoading(false);
    },
  });

  // Update progress from WebSocket
  useState(() => {
    if (lastMessage?.type === 'progress') {
      setProgress(lastMessage.progress || 0);
      setStatus(lastMessage.status || 'processing');
    }
  }, [lastMessage]);

  /**
   * Start a new analysis
   */
  const start = useCallback(async (request) => {
    setError(null);
    setLoading(true);
    setProgress(0);
    setStatus('pending');
    setResult(null);
    setJobId(null);
    setAnalysisId(null);

    // Validate request
    const validation = validateAnalysisRequest(request);
    if (!validation.valid) {
      setError(validation.errors.join(', '));
      setLoading(false);
      return { success: false, errors: validation.errors };
    }

    try {
      const response = await startAnalysis(request);
      setJobId(response.job_id);
      setStatus(response.status);
      
      // If not using WebSocket, start polling
      if (!useWebSocketUpdates) {
        startPolling(response.job_id);
      }
      
      return { success: true, jobId: response.job_id };
    } catch (err) {
      const errorObj = handleAPIError(err);
      setError(errorObj.message);
      setLoading(false);
      setStatus('failed');
      return { success: false, error: errorObj.message };
    }
  }, [useWebSocketUpdates]);

  /**
   * Start polling for status updates (fallback when WebSocket not available)
   */
  const startPolling = useCallback((pollJobId) => {
    const cleanup = pollAnalysisStatus(
      pollJobId,
      (statusData) => {
        setStatus(statusData.status);
        setProgress(statusData.progress || 0);
        
        if (statusData.status === 'completed') {
          setResult(statusData.result);
          setLoading(false);
          if (statusData.result?.analysis_id) {
            setAnalysisId(statusData.result.analysis_id);
          }
        } else if (statusData.status === 'failed') {
          setError(statusData.error || 'Analysis failed');
          setLoading(false);
        }
      }
    );

    return cleanup;
  }, []);

  /**
   * Fetch analysis by ID
   */
  const fetchAnalysis = useCallback(async (id, useCache = true) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getAnalysis(id, useCache);
      setResult(data);
      setAnalysisId(id);
      setStatus(data.status);
      setLoading(false);
      return { success: true, data };
    } catch (err) {
      const errorObj = handleAPIError(err);
      setError(errorObj.message);
      setLoading(false);
      return { success: false, error: errorObj.message };
    }
  }, []);

  /**
   * Check current status
   */
  const checkStatus = useCallback(async () => {
    if (!jobId) {
      setError('No job ID available');
      return { success: false, error: 'No job ID' };
    }

    try {
      const statusData = await getAnalysisStatus(jobId);
      setStatus(statusData.status);
      setProgress(statusData.progress || 0);
      
      if (statusData.status === 'completed' && statusData.result) {
        setResult(statusData.result);
        if (statusData.result.analysis_id) {
          setAnalysisId(statusData.result.analysis_id);
        }
      }
      
      return { success: true, status: statusData };
    } catch (err) {
      const errorObj = handleAPIError(err);
      setError(errorObj.message);
      return { success: false, error: errorObj.message };
    }
  }, [jobId]);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setJobId(null);
    setAnalysisId(null);
    setStatus(null);
    setResult(null);
    setLoading(false);
    setError(null);
    setProgress(0);
  }, []);

  return {
    // State
    jobId,
    analysisId,
    status,
    result,
    loading,
    error,
    progress,
    wsConnected,
    
    // Actions
    start,
    fetchAnalysis,
    checkStatus,
    reset,
    
    // Computed
    isCompleted: status === 'completed',
    isFailed: status === 'failed',
    isProcessing: status === 'processing' || status === 'pending',
  };
}

export default useAnalysis;
