"use client";

import { useEffect, useMemo, useState, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import LeftSidebar from '@/components/layout/LeftSidebar';
import MapView from '@/components/map/MapView';
import SearchOverlay from '@/components/map/SearchOverlay';
import SearchFilters from '@/components/map/SearchFilters';
import ParcelResultsPanel from '@/components/map/ParcelResultsPanel';
import ParcelModal from '@/components/map/ParcelModal';
import ParcelDetailModal from '@/components/parcel/ParcelDetailModal';
import WelcomeModal from '@/components/modals/WelcomeModal';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useJobStatus } from '@/context/JobStatusContext';
import { getActiveProjects, getRecentSearches, searchParcels } from '@/services/parcel.service';
import { startAnalysis, pollAnalysisStatus } from '@/services/analysis.service';
import { addRecentParcel } from '@/utils/recentParcels';
import { exportToCSV, exportToPDF } from '@/utils/export';
import { MOCK_PARCELS, filterParcels } from '@/utils/mockParcelData';
import { parcelService } from '@/services/api';

function MapPageContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { push } = useToast();
  const { startJob, updateJob } = useJobStatus();

  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // India center
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [showResultsPanel, setShowResultsPanel] = useState(false);
  const [animateToLocation, setAnimateToLocation] = useState(null);
  const [hoveredParcel, setHoveredParcel] = useState(null);
  const [allParcels, setAllParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchTimeoutRef = useRef(null);

  // Load all parcels from API on mount
  useEffect(() => {
    if (user) {
      loadAllParcels();
    }
  }, [user]);

  const loadAllParcels = async () => {
    try {
      setLoading(true);
      // Fetch all parcels from API (adjust page/limit as needed)
      const response = await parcelService.getAllParcels(1, 1000);
      const apiParcels = response.data.data;

      // Store parcels for filtering
      setAllParcels(apiParcels);

      // Convert to markers format
      const allMarkers = apiParcels.map(p => ({
        id: p.id,
        lat: parseFloat(p.latitude),
        lng: parseFloat(p.longitude),
        type: 'parcel',
        title: p.site_address,
        summary: `${p.site_city}, ${p.site_state} • ${parseFloat(p.gis_acres).toFixed(1)} acres`,
        raw: {
          ...p,
          // Ensure all expected fields are present
          latitude: parseFloat(p.latitude),
          longitude: parseFloat(p.longitude),
          overall_score: p.overall_score || 70
        }
      }));

      setMarkers(allMarkers);

      push({
        title: 'Parcels Loaded',
        description: `Loaded ${apiParcels.length} parcels from database`,
        type: 'success'
      });
    } catch (error) {
      console.error('[Map] Error loading parcels:', error);
      push({
        title: 'Failed to Load Parcels',
        description: 'Could not connect to backend API. Make sure the server is running on port 3001.',
        type: 'error'
      });
      // Fallback to mock data
      const fallbackMarkers = MOCK_PARCELS.map(p => ({
        id: p.id,
        lat: p.latitude,
        lng: p.longitude,
        type: 'parcel',
        title: p.site_address,
        summary: `${p.gis_acres.toFixed(1)} acres • Score: ${p.overall_score}`,
        raw: p
      }));
      setMarkers(fallbackMarkers);
      setAllParcels(MOCK_PARCELS);
    } finally {
      setLoading(false);
    }
  };

  // Protect route
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Perform parcel search with mock data
  const performSearch = useCallback((criteria) => {
    setIsSearching(true);
    try {
      // Use mock data filter function
      const filtered = filterParcels(criteria);

      setSearchResults(filtered);

      // Convert to markers
      const parcelMarkers = filtered.map(p => ({
        id: p.id,
        lat: p.latitude,
        lng: p.longitude,
        type: 'parcel',
        title: p.site_address,
        summary: `${p.gis_acres.toFixed(1)} acres • Score: ${p.overall_score}`,
        raw: p
      }));

      setMarkers(parcelMarkers);

      // Show results panel
      setShowResultsPanel(true);

      // Auto-center on first result if we have results
      if (parcelMarkers.length > 0) {
        setAnimateToLocation({
          lat: parcelMarkers[0].lat,
          lng: parcelMarkers[0].lng,
          zoom: 10,
          timestamp: Date.now()
        });
      }

      push({
        title: 'Search Complete',
        description: `Found ${filtered.length} matching parcels`,
        type: 'success'
      });
    } catch (error) {
      console.error('[Map] Search error:', error);
      push({ title: 'Search failed', description: error.message, type: 'error' });
    } finally {
      setIsSearching(false);
    }
  }, [push]);

  // Handle search from filters
  const handleSearch = useCallback((criteria) => {
    performSearch(criteria);
  }, [performSearch]);

  // Handle clear/reset filters
  const handleClearFilters = useCallback(() => {
    // Reset to show all parcels from API
    if (allParcels.length > 0) {
      const allMarkers = allParcels.map(p => ({
        id: p.id,
        lat: parseFloat(p.latitude),
        lng: parseFloat(p.longitude),
        type: 'parcel',
        title: p.site_address,
        summary: `${p.site_city}, ${p.site_state} • ${parseFloat(p.gis_acres).toFixed(1)} acres`,
        raw: {
          ...p,
          latitude: parseFloat(p.latitude),
          longitude: parseFloat(p.longitude),
          overall_score: p.overall_score || 70
        }
      }));
      setMarkers(allMarkers);
    }
    setSearchResults([]);
    setShowResultsPanel(false);
  }, [allParcels]);

  // Handle parcel hover from results panel
  const handleParcelHover = useCallback((parcel) => {
    setHoveredParcel(parcel);
    if (parcel) {
      setAnimateToLocation({
        lat: parcel.latitude,
        lng: parcel.longitude,
        zoom: 15,
        timestamp: Date.now()
      });
    }
  }, []);

  // Handle parcel click from results panel
  const handleParcelClick = useCallback((parcel) => {
    setSelected(parcel.id);
    setAnimateToLocation({
      lat: parcel.latitude,
      lng: parcel.longitude,
      zoom: 18,
      timestamp: Date.now()
    });
  }, []);


  const handleRunAnalysis = async (parcel) => {
    // Extract data from raw parcel or fallback to marker data
    const parcelData = parcel.raw || parcel;
    const site_name = parcelData.site_address || parcel.title || 'Parcel';
    const request = {
      latitude: parcelData.latitude || parcel.lat,
      longitude: parcelData.longitude || parcel.lng,
      site_name,
      bbox_size_meters: 500,
    };

    // Generate a temporary ID for instant UI feedback
    const tempId = `temp-${Date.now()}`;

    // Show immediate feedback
    push({
      title: 'Starting Analysis',
      description: `Analyzing ${site_name}...`,
      type: 'success',
    });

    // Redirect IMMEDIATELY (within 200ms) - ultra snappy!
    router.push(`/reports?temp_id=${encodeURIComponent(tempId)}&site_name=${encodeURIComponent(site_name)}&status=getting_ready`);

    // Start analysis in background
    try {
      const res = await startAnalysis(request);
      const jobId = res.job_id;

      // Update URL with real job_id (replace temp_id)
      router.replace(`/reports?job_id=${encodeURIComponent(jobId)}`);

      // Status bar
      startJob(jobId, { status: res.status || 'pending', progress: 0, message: 'Initializing analysis...' });

      // Poll for progress and update
      pollAnalysisStatus(jobId, (status) => {
        updateJob({ status: status.status, progress: status.progress || 0, message: status.message });
      });
    } catch (err) {
      push({ title: 'Failed to start analysis', description: err.message, type: 'error' });
      // Navigate back if analysis failed to start
      router.replace('/reports');
    }
  };

  const renderInfo = (m) => (
    <ParcelModal 
      parcel={m} 
      onRunAnalysis={handleRunAnalysis}
      onViewDetails={() => {
        const parcelData = m.raw || m;
        addRecentParcel(parcelData);
        setSelectedParcel(parcelData);
        setShowDetailModal(true);
      }}
    />
  );

  const handleAddToProject = useCallback((parcel) => {
    // TODO: Implement project management
    push({ title: 'Added to project', description: `Parcel ${parcel.parcel_number} added`, type: 'success' });
  }, [push]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f2f1]">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f2f1]">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-[#0078d4] border-t-transparent rounded-full mx-auto mb-4"></div>
          <div className="text-gray-600">Loading parcels from database...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <WelcomeModal
          userName={user?.name || user?.email || 'User'}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}

      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Search Filters - Left Side */}
      <div className="fixed top-4 left-20 z-20 w-80">
        <SearchFilters
          onSearch={handleSearch}
          onReset={handleClearFilters}
        />
      </div>

      {/* Results Count Badge - Top Right */}
      {searchResults.length > 0 && (
        <div className="fixed top-4 right-4 z-20">
          <button
            onClick={() => setShowResultsPanel(!showResultsPanel)}
            className="bg-white/95 backdrop-blur-sm shadow-lg rounded-lg px-4 py-2 border border-gray-200 hover:border-[#0078d4] transition-colors"
          >
            <div className="text-sm font-medium text-gray-900">
              {searchResults.length} {searchResults.length === 1 ? 'parcel' : 'parcels'} found
            </div>
            {isSearching && (
              <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                <div className="animate-spin h-3 w-3 border-2 border-[#0078d4] border-t-transparent rounded-full"></div>
                Searching...
              </div>
            )}
            <div className="text-xs text-[#0078d4] mt-1">
              {showResultsPanel ? 'Hide' : 'View'} Results →
            </div>
          </button>
        </div>
      )}

      {/* Fullscreen Map */}
      <div className="absolute inset-0">
        <MapView
          center={center}
          markers={markers}
          selectedId={selected}
          onSelect={(m) => setSelected(m.id)}
          onCloseInfo={() => setSelected(null)}
          renderInfoContent={renderInfo}
          fitToMarkers={false}
          animateToLocation={animateToLocation}
        />
      </div>

      {/* Results Panel - Slide in from right */}
      <ParcelResultsPanel
        parcels={searchResults}
        isOpen={showResultsPanel}
        onClose={() => setShowResultsPanel(false)}
        onParcelHover={handleParcelHover}
        onParcelClick={handleParcelClick}
      />

      {/* Parcel Detail Modal */}
      <ParcelDetailModal
        parcel={selectedParcel}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        onAnalyze={handleRunAnalysis}
        onAddToProject={handleAddToProject}
      />
    </div>
  );
}

export default function MapPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#f3f2f1]">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <MapPageContent />
    </Suspense>
  );
}
