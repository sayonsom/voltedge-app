import { API_CONFIG } from '@/config/api';

/**
 * Cache Management for Analysis Results
 * Uses localStorage to cache completed analyses
 */

const CACHE_KEY = API_CONFIG.cache.storageKey;
const CACHE_EXPIRY_MS = API_CONFIG.cache.expiryDays * 24 * 60 * 60 * 1000;

/**
 * Cache an analysis result
 * @param {string} analysisId - Analysis ID
 * @param {Object} data - Analysis data to cache
 */
export function cacheAnalysis(analysisId, data) {
  try {
    const cache = getCacheStore();
    cache[analysisId] = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + CACHE_EXPIRY_MS,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to cache analysis:', error);
  }
}

/**
 * Get cached analysis
 * @param {string} analysisId - Analysis ID
 * @returns {Object|null} Cached analysis data or null
 */
export function getCachedAnalysis(analysisId) {
  try {
    const cache = getCacheStore();
    const cached = cache[analysisId];
    
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }
    
    // Remove expired entry
    if (cached) {
      delete cache[analysisId];
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
    
    return null;
  } catch (error) {
    console.warn('Failed to get cached analysis:', error);
    return null;
  }
}

/**
 * Remove analysis from cache
 * @param {string} analysisId - Analysis ID
 */
export function removeCachedAnalysis(analysisId) {
  try {
    const cache = getCacheStore();
    delete cache[analysisId];
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.warn('Failed to remove cached analysis:', error);
  }
}

/**
 * Clear all cached analyses
 */
export function clearCache() {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.warn('Failed to clear cache:', error);
  }
}

/**
 * Clean up expired cache entries
 */
export function cleanupExpiredCache() {
  try {
    const cache = getCacheStore();
    const now = Date.now();
    let cleaned = false;
    
    Object.keys(cache).forEach(key => {
      if (cache[key].expiresAt < now) {
        delete cache[key];
        cleaned = true;
      }
    });
    
    if (cleaned) {
      localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    }
  } catch (error) {
    console.warn('Failed to cleanup cache:', error);
  }
}

/**
 * Get cache statistics
 * @returns {Object} Cache stats
 */
export function getCacheStats() {
  try {
    const cache = getCacheStore();
    const now = Date.now();
    const entries = Object.values(cache);
    
    return {
      total: entries.length,
      valid: entries.filter(e => e.expiresAt > now).length,
      expired: entries.filter(e => e.expiresAt <= now).length,
      sizeKB: Math.round(
        new Blob([JSON.stringify(cache)]).size / 1024
      ),
    };
  } catch (error) {
    console.warn('Failed to get cache stats:', error);
    return { total: 0, valid: 0, expired: 0, sizeKB: 0 };
  }
}

/**
 * Get the cache store object
 * @returns {Object} Cache store
 */
function getCacheStore() {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to parse cache store:', error);
    return {};
  }
}

/**
 * Check if localStorage is available
 * @returns {boolean}
 */
export function isStorageAvailable() {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (error) {
    return false;
  }
}

// Auto-cleanup on module load
if (typeof window !== 'undefined' && isStorageAvailable()) {
  cleanupExpiredCache();
}
