'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useJobStatus } from '@/context/JobStatusContext';
import LeftSidebar from '@/components/layout/LeftSidebar';
import AnalysisMapWrapper from '@/components/map/AnalysisMapWrapper';
import DrawableMap from '@/components/map/DrawableMap';
import LocationSearchBar from '@/components/map/LocationSearchBar';
import { startAnalysis } from '@/services/analysis.service';
import { validateGeoJSON } from '@/utils/geojson';
import { Play, Loader, CheckCircle } from 'lucide-react';

/**
 * Analysis Page
 * Interactive map with drawing tools for buildable area analysis
 */
export default function AnalysisPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { push } = useToast();
  const { startJob } = useJobStatus();

  const [mapCenter, setMapCenter] = useState({ lat: 28.6139, lng: 77.2090 }); // New Delhi, India
  const [mapZoom, setMapZoom] = useState(12);
  const [geojson, setGeojson] = useState(null);
  const [siteName, setSiteName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  const handleLocationSelect = useCallback((location) => {
    setMapCenter({ lat: location.lat, lng: location.lng });
    setMapZoom(16);
    
    // Auto-set site name if not already set
    if (!siteName) {
      setSiteName(location.address);
    }
  }, [siteName]);

  const handlePolygonComplete = useCallback((newGeojson) => {
    setGeojson(newGeojson);
  }, []);

  const handleSubmitAnalysis = async () => {
    // Validate inputs
    if (!siteName.trim()) {
      push({ title: 'Site name required', description: 'Please enter a name for this analysis', type: 'error' });
      return;
    }

    if (!geojson) {
      push({ title: 'Area required', description: 'Please draw an area on the map for analysis', type: 'error' });
      return;
    }

    // Validate GeoJSON
    const validation = validateGeoJSON(geojson);
    if (!validation.valid) {
      push({
        title: 'Invalid polygon',
        description: validation.errors[0],
        type: 'error'
      });
      return;
    }

    // Generate a temporary ID for instant UI feedback
    const tempId = `temp-${Date.now()}`;

    // Show immediate feedback
    push({
      title: 'Starting Analysis',
      description: `Analyzing ${siteName.trim()}...`,
      type: 'success'
    });

    // Set job status in context immediately
    startJob(tempId, {
      status: 'getting_ready',
      progress: 0,
      message: 'Preparing analysis...',
      siteName: siteName.trim()
    });

    // Redirect IMMEDIATELY (within 200ms) - ultra snappy!
    router.push(`/reports?temp_id=${encodeURIComponent(tempId)}&site_name=${encodeURIComponent(siteName.trim())}&status=getting_ready`);

    // Start analysis in background
    setIsSubmitting(true);

    try {
      const response = await startAnalysis({
        site_name: siteName.trim(),
        geojson: geojson,
      });

      // Update job status with real job ID
      startJob(response.job_id, {
        status: 'pending',
        progress: 0,
        message: 'Starting analysis...',
        siteName: siteName.trim()
      });

      // Update URL with real job_id (replace temp_id)
      router.replace(`/reports?job_id=${encodeURIComponent(response.job_id)}`);

    } catch (error) {
      console.error('Analysis error:', error);
      push({
        title: 'Analysis Failed',
        description: error.message || 'Failed to start analysis',
        type: 'error'
      });
      // Navigate back if analysis failed to start
      router.replace('/reports');
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f2f1]">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <AnalysisMapWrapper>
      <div className="relative w-full h-screen overflow-hidden">
        {/* Left Sidebar */}
        <LeftSidebar />
      
      {/* Search & Analysis Panel */}
      <div className="fixed top-4 left-20 z-20 w-96">
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#0078d4] to-[#106ebe]">
            <h1 className="text-lg font-semibold text-white">Buildable Area Analysis</h1>
            <p className="text-xs text-white/90 mt-1">Draw an area to analyze terrain and buildability</p>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
                {/* Location Search */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Search Location</label>
                  <LocationSearchBar 
                    onLocationSelect={handleLocationSelect}
                    placeholder="Find a location..."
                  />
                </div>

                {/* Site Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Site Name *</label>
                  <input
                    type="text"
                    placeholder="Enter site name"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                  />
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-900 mb-2">How it works:</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-blue-800">
                    <li>Search for a location or navigate the map</li>
                    <li>Click "Draw Area" to outline your analysis region</li>
                    <li>Enter a site name and click "Start Analysis"</li>
                  </ol>
                </div>

                {/* Polygon Info */}
                {geojson && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-xs font-semibold text-green-900 mb-1">✓ Area Selected</p>
                    <p className="text-xs text-green-700">
                      {geojson.properties?.area_acres?.toFixed(2) || 'N/A'} acres
                    </p>
                  </div>
                )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleSubmitAnalysis}
                disabled={!geojson || !siteName.trim() || isSubmitting}
                className="w-full bg-[#0078d4] hover:bg-[#106ebe] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Starting Analysis...
                  </>
                ) : (
                  <>
                    <Play size={16} />
                    Start Analysis
                  </>
                )}
              </button>
            </div>
        </div>
      </div>
      
      {/* Fullscreen Map with Drawing Tools */}
      <div className="absolute inset-0">
        <DrawableMap
          center={mapCenter}
          zoom={mapZoom}
          onPolygonComplete={handlePolygonComplete}
        />
      </div>
      </div>
    </AnalysisMapWrapper>
  );
}
