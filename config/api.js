// API Configuration for DEM Microservice Backend

export const API_CONFIG = {
  // Backend URLs
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001',
  wsURL: process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8001',
  
  // Request timeout (10 minutes for long-running DEM analysis)
  timeout: 600000,
  
  // Default headers
  headers: {
    'Content-Type': 'application/json',
  },
  
  // Polling configuration
  polling: {
    interval: 3000, // 3 seconds (reduced frequency to avoid overwhelming backend)
    maxAttempts: 600, // 30 minutes max (600 * 3s = 1800s = 30 min)
  },
  
  // WebSocket configuration
  websocket: {
    reconnectAttempts: 5,
    reconnectDelay: 2000,
    pingInterval: 25000, // 25 seconds
  },
  
  // Cache configuration
  cache: {
    expiryDays: 7,
    storageKey: 'voltedge_analysis_cache',
  },
  
  // Rate limiting
  rateLimit: {
    maxRetries: 3,
    backoffMultiplier: 2,
  },
};

// API Endpoints
// NOTE: Using /buildable-area/* prefix for all DEM analysis operations
export const API_ENDPOINTS = {
  // Analysis Creation (buildable-area prefix)
  analyze: '/api/v1/buildable-area/analyze',
  status: (jobId) => `/api/v1/buildable-area/status/${jobId}`,
  results: (jobId) => `/api/v1/buildable-area/results/${jobId}`,
  download: (jobId, filename) => `/api/v1/buildable-area/download/${jobId}/${filename}`,
  health: '/api/v1/buildable-area/health',

  // Analysis Retrieval (buildable-area prefix)
  analysis: (analysisId) => `/api/v1/buildable-area/analysis/${analysisId}`,
  search: '/api/v1/buildable-area/search',
  report: (analysisId) => `/api/v1/buildable-area/report/${analysisId}.pdf`,
  batchAnalyze: '/api/v1/buildable-area/batch-analyze',
  batchStatus: (batchId) => `/api/v1/buildable-area/batch-status/${batchId}`,
  metricsSummary: '/api/v1/buildable-area/metrics-summary',

  // Artifacts & Attachments
  artifacts: (analysisId) => `/api/v1/buildable-area/artifacts/${analysisId}`,
  attachments: (analysisId) => `/api/v1/buildable-area/analysis/${analysisId}/attachments`,
  files: (analysisId) => `/api/v1/buildable-area/analysis/${analysisId}/files`,

  // WebSocket
  wsJob: (jobId) => `/api/v1/buildable-area/ws/job/${jobId}`,

  // Parcels (comprehensive search API - IMPLEMENTED)
  parcels: {
    search: '/api/v1/parcels/search',
    searchGeoJSON: '/api/v1/parcels/search/geojson',
    byId: (id) => `/api/v1/parcels/${id}`,
    geojson: (id) => `/api/v1/parcels/${id}/geojson`,
    autocomplete: '/api/v1/parcels/autocomplete',
  },

  // Projects & Searches (not yet implemented)
  projects: {
    active: '/api/v1/projects/active',
  },
  searches: {
    recent: '/api/v1/searches/recent',
  },

  // Map (not yet implemented)
  map: {
    pins: '/api/v1/map/pins',
  },
};
