import { useState, useCallback, useEffect } from 'react';
import { 
  searchAnalyses, 
  getRecentAnalyses,
  getAnalysesByStatus,
  getAnalysisStatistics 
} from '@/services/search.service';
import { handleAPIError } from '@/utils/error-handler';

/**
 * React Hook for Analysis History and Search
 * 
 * @param {Object} options - Configuration options
 * @returns {Object} History state and controls
 */
export function useAnalysisHistory(options = {}) {
  const { autoLoad = false, defaultLimit = 50 } = options;
  
  const [analyses, setAnalyses] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useState({
    query: '',
    status: '',
    limit: defaultLimit,
    offset: 0,
  });

  /**
   * Search analyses
   */
  const search = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    const searchOptions = { ...searchParams, ...params };
    setSearchParams(searchOptions);
    
    try {
      const results = await searchAnalyses(searchOptions);
      setAnalyses(results);
      setLoading(false);
      return { success: true, results };
    } catch (err) {
      const errorObj = handleAPIError(err);
      setError(errorObj.message);
      setLoading(false);
      return { success: false, error: errorObj.message };
    }
  }, [searchParams]);

  /**
   * Load recent analyses
   */
  const loadRecent = useCallback(async (limit = 10) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await getRecentAnalyses(limit);
      setAnalyses(results);
      setLoading(false);
      return { success: true, results };
    } catch (err) {
      const errorObj = handleAPIError(err);
      setError(errorObj.message);
      setLoading(false);
      return { success: false, error: errorObj.message };
    }
  }, []);

  /**
   * Filter by status
   */
  const filterByStatus = useCallback(async (status, limit = 50) => {
    setLoading(true);
    setError(null);
    
    try {
      const results = await getAnalysesByStatus(status, limit);
      setAnalyses(results);
      setSearchParams(prev => ({ ...prev, status }));
      setLoading(false);
      return { success: true, results };
    } catch (err) {
      const errorObj = handleAPIError(err);
      setError(errorObj.message);
      setLoading(false);
      return { success: false, error: errorObj.message };
    }
  }, []);

  /**
   * Load statistics
   */
  const loadStatistics = useCallback(async () => {
    try {
      const statistics = await getAnalysisStatistics();
      setStats(statistics);
      return { success: true, statistics };
    } catch (err) {
      const errorObj = handleAPIError(err);
      console.error('Failed to load statistics:', errorObj.message);
      return { success: false, error: errorObj.message };
    }
  }, []);

  /**
   * Refresh current view
   */
  const refresh = useCallback(async () => {
    if (searchParams.query || searchParams.status) {
      return await search(searchParams);
    } else {
      return await loadRecent(searchParams.limit);
    }
  }, [searchParams, search, loadRecent]);

  /**
   * Clear filters and reload
   */
  const clearFilters = useCallback(async () => {
    setSearchParams({
      query: '',
      status: '',
      limit: defaultLimit,
      offset: 0,
    });
    return await loadRecent(defaultLimit);
  }, [defaultLimit, loadRecent]);

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad) {
      loadRecent(defaultLimit);
      loadStatistics();
    }
  }, [autoLoad, defaultLimit, loadRecent, loadStatistics]);

  return {
    // State
    analyses,
    stats,
    loading,
    error,
    searchParams,
    
    // Actions
    search,
    loadRecent,
    filterByStatus,
    loadStatistics,
    refresh,
    clearFilters,
    
    // Computed
    hasAnalyses: analyses.length > 0,
    totalAnalyses: analyses.length,
  };
}

export default useAnalysisHistory;
