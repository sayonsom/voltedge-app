'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import {
  Download,
  FileText,
  MapPin,
  Zap,
  TrendingUp,
  Mountain,
  Grid3x3,
  DollarSign,
  Calendar,
  Maximize2,
  Minimize2,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

/**
 * Detailed Analysis Report Component
 * Displays comprehensive buildable area analysis with all data fields and images
 */
export default function DetailedAnalysisReport({ analysis, jobId }) {
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    images: true,
    topography: true,
    exclusions: true,
    constraints: true,
    buildable: true,
    arrayLayout: true,
    capacity: true,
    grid: true,
    solar: true,
    financial: true,
    dataSources: true,
    recommendations: true
  });
  const [expandedMapCard, setExpandedMapCard] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Extract data from analysis
  const site = analysis?.site_identification || {};
  const location = site?.location || {};
  const totalArea = analysis?.total_site_area || {};
  const buildable = analysis?.buildable_area_summary || {};
  const capacity = analysis?.site_capacity_estimate || {};
  const topography = analysis?.topography_analysis || {};
  const grid = analysis?.grid_connection || {};
  const solar = analysis?.solar_resource || analysis?.solar_resource_analysis || {};
  const financial = analysis?.financial_metrics || analysis?.financial_summary || {};
  const recommendations = analysis?.recommendations || {};
  const exclusionZones = analysis?.exclusion_zones || {};
  const constraintZones = analysis?.constraint_zones || {};
  const solarArrayLayout = analysis?.solar_array_layout || {};
  const dataSources = analysis?.data_sources || {};
  const warnings = analysis?.warnings || [];

  // Handle different attachment structures
  // Could be: analysis.attachments[] OR analysis.attachments.maps[]
  let attachments = [];
  if (analysis?.attachments) {
    if (Array.isArray(analysis.attachments)) {
      attachments = analysis.attachments;
    } else if (Array.isArray(analysis.attachments.maps)) {
      attachments = analysis.attachments.maps;
    }
  }

  // If no attachments found but we have an analysis ID, construct default image paths
  // The backend saves images to GCP with predictable filenames
  if (attachments.length === 0 && jobId) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';
    console.log('[DetailedAnalysisReport] Constructing image URLs for jobId:', jobId);
    console.log('[DetailedAnalysisReport] Base URL:', baseUrl);

    const imageNames = [
      { filename: 'slope_heatmap.png', type: 'slope_heatmap', description: 'Slope Analysis Heatmap' },
      { filename: 'suitability_map.png', type: 'suitability_map', description: 'Solar Suitability Map' },
      { filename: 'buildable_area_map.png', type: 'buildable_area_map', description: 'Buildable Area Map' },
      { filename: 'elevation_profile.png', type: 'elevation_profile', description: 'Elevation Profile' }
    ];

    attachments = imageNames.map(img => {
      const url = `${baseUrl}/api/v1/buildable-area/download/${jobId}/${img.filename}`;
      console.log('[DetailedAnalysisReport] Constructed URL:', url);
      return {
        filename: img.filename,
        type: img.type,
        description: img.description,
        gcp_url: url,
        local_path: url
      };
    });
  }

  // Filter attachments to only include the 4 visualizations (exclude JSON files and any other non-image types)
  const carouselImages = attachments.filter(att =>
    att.type === 'slope_heatmap' ||
    att.type === 'suitability_map' ||
    att.type === 'buildable_area_map' ||
    att.type === 'elevation_profile'
  );

  // Debug logging
  console.log('[DetailedAnalysisReport] Job ID from props:', jobId);
  console.log('[DetailedAnalysisReport] Analysis data:', analysis);
  console.log('[DetailedAnalysisReport] Analysis keys:', analysis ? Object.keys(analysis) : 'null');
  console.log('[DetailedAnalysisReport] Attachments found:', attachments.length, attachments);
  console.log('[DetailedAnalysisReport] Grid data:', grid, 'Keys:', Object.keys(grid).length);
  console.log('[DetailedAnalysisReport] Solar data:', solar, 'Keys:', Object.keys(solar).length);
  console.log('[DetailedAnalysisReport] Financial data:', financial, 'Keys:', Object.keys(financial).length);
  console.log('[DetailedAnalysisReport] Data sources:', dataSources, 'Keys:', Object.keys(dataSources).length);
  console.log('[DetailedAnalysisReport] Exclusion zones:', exclusionZones, 'Keys:', Object.keys(exclusionZones).length);
  console.log('[DetailedAnalysisReport] Constraint zones:', constraintZones, 'Keys:', Object.keys(constraintZones).length);

  // CRITICAL CHECK: Verify attachments match the jobId
  if (attachments.length > 0 && jobId) {
    attachments.forEach((att, idx) => {
      if (att.gcp_url && !att.gcp_url.includes(jobId)) {
        console.error(`[DetailedAnalysisReport] ❌ WRONG ANALYSIS! Attachment ${idx} belongs to different analysis!`);
        console.error(`[DetailedAnalysisReport] Expected ID in URL: ${jobId}`);
        console.error(`[DetailedAnalysisReport] Actual URL: ${att.gcp_url}`);
      }
    });
  }

  // Image types mapping
  const imageTypes = {
    slope_heatmap: { title: 'Slope Analysis Heatmap', icon: Mountain },
    suitability_map: { title: 'Solar Suitability Map', icon: Zap },
    buildable_area_map: { title: 'Buildable Area Map', icon: Grid3x3 },
    elevation_profile: { title: 'Elevation Profile', icon: TrendingUp }
  };

  const handleDownloadPDF = () => {
    if (jobId) {
      const pdfUrl = `/api/v1/buildable-area/report/${jobId}.pdf`;
      window.open(pdfUrl, '_blank');
    }
  };

  const SectionHeader = ({ title, icon: Icon, section, children }) => (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
        {Icon && <Icon size={20} className="text-[#0078d4]" />}
        {title}
      </h3>
      {section && (
        <button
          onClick={() => toggleSection(section)}
          className="text-gray-500 hover:text-gray-700"
        >
          {expandedSections[section] ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
      )}
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* PDF Download Button */}
      <div className="flex justify-end">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-[#0078d4] hover:bg-[#106ebe] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Download size={16} />
          Download PDF Report
        </button>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1">Total Site Area</p>
          <p className="text-3xl font-bold text-gray-900">
            {totalArea?.total_acres?.toFixed(2) || '—'}
          </p>
          <p className="text-xs text-gray-500 mt-1">acres</p>
        </Card>

        <Card className="p-4 border-l-4 border-l-[#0078d4] bg-gray-50">
          <p className="text-xs text-gray-600 mb-1">Net Buildable Area</p>
          <p className="text-3xl font-bold text-gray-900">
            {buildable?.net_buildable_acres?.toFixed(2) || '—'}
          </p>
          <p className="text-xs text-gray-600 mt-1">
            {buildable?.buildable_percentage?.toFixed(1) || '—'}% buildable
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
            <Zap size={12} />
            DC Capacity
          </p>
          <p className="text-3xl font-bold text-gray-900">
            {capacity?.estimated_dc_capacity_mw?.toFixed(2) || '—'}
          </p>
          <p className="text-xs text-gray-500 mt-1">MW</p>
        </Card>

        <Card className="p-4">
          <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
            <TrendingUp size={12} />
            Site Suitability
          </p>
          <p className="text-2xl font-bold text-gray-900">
            {recommendations?.site_suitability_score || '—'}
          </p>
          <p className="text-xs text-gray-500 mt-1 capitalize">
            {recommendations?.site_suitability_rating || '—'}
          </p>
        </Card>
      </div>

      {/* Site Overview */}
      <Card className="p-6">
        <SectionHeader title="Site Overview" icon={MapPin} section="overview" />
        {expandedSections.overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600 font-medium">Site Name</span>
                <p className="text-gray-900 mt-1">{site?.site_name || '—'}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Location</span>
                <p className="text-gray-900 mt-1">{location?.address || '—'}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">County</span>
                <p className="text-gray-900 mt-1">{location?.county || '—'}</p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">State</span>
                <p className="text-gray-900 mt-1">{location?.state_code || '—'}</p>
              </div>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600 font-medium">Coordinates</span>
                <p className="text-gray-900 mt-1 font-mono text-xs">
                  {location?.latitude?.toFixed(6) || '—'}, {location?.longitude?.toFixed(6) || '—'}
                </p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Analysis Date</span>
                <p className="text-gray-900 mt-1">
                  {analysis?.created_at ? new Date(analysis.created_at).toLocaleString() : '—'}
                </p>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Dataset Used</span>
                <p className="text-gray-900 mt-1">{topography?.dataset_used || 'DEM 1 meter'}</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Location Map - Expandable */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MapPin size={20} className="text-[#0078d4]" />
            Site Location Map
          </h3>
          <button
            onClick={() => setExpandedMapCard(!expandedMapCard)}
            className="flex items-center gap-2 text-sm text-[#0078d4] hover:text-[#106ebe]"
          >
            {expandedMapCard ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            {expandedMapCard ? 'Collapse' : 'Expand'}
          </button>
        </div>
        <div
          className={`bg-gray-100 rounded-lg overflow-hidden transition-all duration-300 ${
            expandedMapCard ? 'h-[600px]' : 'h-[300px]'
          }`}
        >
          {location?.latitude && location?.longitude ? (
            <iframe
              src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&output=embed&z=15&t=k`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Location coordinates not available</p>
            </div>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-600">
          <a
            href={`https://www.google.com/maps?q=${location?.latitude},${location?.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[#0078d4] hover:underline"
          >
            <ExternalLink size={12} />
            Open in Google Maps
          </a>
        </div>
      </Card>

      {/* Analysis Images Carousel */}
      <Card className="p-6">
        <SectionHeader title="Analysis Visualizations" icon={FileText} section="images" />
        {expandedSections.images && (
          <>
            {carouselImages.length > 0 ? (
              <div className="relative">
                {/* Main Image Display */}
                <div className="relative overflow-hidden rounded-lg">
                  <div
                    className="aspect-video bg-white overflow-hidden cursor-pointer"
                    onClick={() => setSelectedImage(carouselImages[currentImageIndex])}
                  >
                    <img
                      src={carouselImages[currentImageIndex]?.gcp_url || carouselImages[currentImageIndex]?.local_path}
                      alt={carouselImages[currentImageIndex]?.description}
                      className="w-full h-full object-contain transition-opacity duration-300"
                      loading="lazy"
                      onError={(e) => {
                        console.error('[Image Load Error]', carouselImages[currentImageIndex]?.description, carouselImages[currentImageIndex]?.gcp_url);
                        if (!e.target.dataset.errored) {
                          e.target.dataset.errored = 'true';
                          e.target.style.display = 'none';
                          const parent = e.target.parentElement;
                          parent.innerHTML = '<div class="flex items-center justify-center h-full bg-gray-100"><p class="text-gray-500 text-sm">Image failed to load</p></div>';
                        }
                      }}
                    />
                  </div>

                  {/* Navigation Arrows */}
                  {carouselImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1));
                        }}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImageIndex((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1));
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-2 transition-all"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </div>

                {/* Image Title and Actions */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const imageInfo = imageTypes[carouselImages[currentImageIndex]?.type] || { title: carouselImages[currentImageIndex]?.description, icon: FileText };
                      const Icon = imageInfo.icon;
                      return (
                        <>
                          <Icon size={18} className="text-[#0078d4]" />
                          <p className="text-base font-semibold text-gray-900">
                            {carouselImages[currentImageIndex]?.description || imageInfo.title}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                  <div className="flex gap-3">
                    <a
                      href={carouselImages[currentImageIndex]?.gcp_url || carouselImages[currentImageIndex]?.local_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-[#0078d4] hover:underline"
                    >
                      <ExternalLink size={14} />
                      View Full Size
                    </a>
                    <a
                      href={carouselImages[currentImageIndex]?.gcp_url || carouselImages[currentImageIndex]?.local_path}
                      download={carouselImages[currentImageIndex]?.filename}
                      className="flex items-center gap-1 text-sm text-[#0078d4] hover:underline"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </div>
                </div>

                {/* Thumbnail Navigation */}
                {carouselImages.length > 1 && (
                  <div className="mt-4 flex gap-2 justify-center">
                    {carouselImages.map((attachment, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          idx === currentImageIndex
                            ? 'bg-[#0078d4] w-8'
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                <FileText size={48} className="text-yellow-600 mx-auto mb-3" />
                <p className="text-sm font-medium text-yellow-900 mb-2">No Visualization Images Found</p>
                <p className="text-xs text-yellow-700">
                  The analysis may still be processing or images were not generated.
                </p>
                <details className="mt-4">
                  <summary className="text-xs text-yellow-600 cursor-pointer hover:underline">
                    Debug Info (for developers)
                  </summary>
                  <pre className="mt-2 text-left text-xs bg-yellow-100 p-3 rounded overflow-auto max-h-48">
                    {JSON.stringify({
                      hasAttachments: !!analysis?.attachments,
                      attachmentsType: Array.isArray(analysis?.attachments) ? 'array' : typeof analysis?.attachments,
                      attachmentsKeys: analysis?.attachments ? Object.keys(analysis.attachments) : null,
                      sampleData: analysis?.attachments
                    }, null, 2)}
                  </pre>
                </details>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Topography Analysis */}
      {topography && Object.keys(topography).length > 0 && (
        <Card className="p-6">
          <SectionHeader title="Topography Analysis" icon={Mountain} section="topography" />
          {expandedSections.topography && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Elevation Range</span>
                    <span className="text-gray-900 font-semibold">
                      {topography.elevation_range?.min_meters?.toFixed(1) || '—'}m -
                      {topography.elevation_range?.max_meters?.toFixed(1) || '—'}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Mean Elevation</span>
                    <span className="text-gray-900 font-semibold">
                      {topography.elevation_range?.mean_meters?.toFixed(1) || '—'}m
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Elevation Change</span>
                    <span className="text-gray-900 font-semibold">
                      {((topography.elevation_range?.max_meters - topography.elevation_range?.min_meters) || 0).toFixed(1)}m
                    </span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Mean Slope</span>
                    <span className="text-gray-900 font-semibold">
                      {topography.slope_distribution?.mean_slope_degrees?.toFixed(2) || '—'}°
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Max Slope</span>
                    <span className="text-gray-900 font-semibold">
                      {topography.slope_distribution?.max_slope_degrees?.toFixed(2) || '—'}°
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Terrain Variability</span>
                    <span className="text-gray-900 font-semibold capitalize">
                      {topography.terrain_variability || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {topography.slope_distribution?.slope_categories && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">Slope Distribution</p>
                  <div className="space-y-3">
                    {Object.entries(topography.slope_distribution.slope_categories).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <div className="w-40 text-xs text-gray-700 font-medium capitalize">
                          {key.replace(/_/g, ' ').replace(/pct/g, '%').replace(/degrees/g, '°')}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-[#0078d4] h-3 rounded-full transition-all duration-500"
                            style={{ width: `${value}%` }}
                          />
                        </div>
                        <div className="w-16 text-sm text-gray-900 font-semibold text-right">
                          {value?.toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Exclusion Zones */}
      {exclusionZones && Object.keys(exclusionZones).length > 0 && (
        <Card className="p-6">
          <SectionHeader title="Exclusion Zones" icon={Mountain} section="exclusions" />
          {expandedSections.exclusions && (
            <div className="space-y-6">
              {exclusionZones.steep_slopes && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">Steep Slopes (&gt;{exclusionZones.steep_slopes.slope_threshold_percent}%)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-red-600">
                      <p className="text-xs text-gray-700 mb-1">Excluded Area</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {exclusionZones.steep_slopes.area_acres?.toFixed(2)} <span className="text-sm font-normal">acres</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {exclusionZones.steep_slopes.area_square_meters?.toFixed(0)} m²
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Slope Threshold</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {exclusionZones.steep_slopes.slope_threshold_percent}%
                      </p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">Max Slope Observed</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {exclusionZones.steep_slopes.max_slope_observed}°
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {exclusionZones.setbacks_required && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">Required Setbacks</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Property Line Setback</span>
                        <span className="text-gray-900 font-semibold">
                          {exclusionZones.setbacks_required.property_line_setback_meters} m
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Road Setback</span>
                        <span className="text-gray-900 font-semibold">
                          {exclusionZones.setbacks_required.road_setback_meters} m
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">Residence Setback</span>
                        <span className="text-gray-900 font-semibold">
                          {exclusionZones.setbacks_required.residence_setback_meters} m
                        </span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-orange-600">
                      <p className="text-xs text-gray-700 mb-1">Total Setback Area</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {exclusionZones.setbacks_required.total_setback_area_acres?.toFixed(2)} <span className="text-sm font-normal">acres</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {exclusionZones.setbacks_required.total_setback_area_square_meters?.toFixed(0)} m²
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Constraint Zones */}
      {constraintZones && Object.keys(constraintZones).length > 0 && (
        <Card className="p-6">
          <SectionHeader title="Constraint Zones" icon={TrendingUp} section="constraints" />
          {expandedSections.constraints && (
            <div className="space-y-4">
              {constraintZones.moderate_slopes && (
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-yellow-600">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-700 mb-1">Moderate Slope Area ({constraintZones.moderate_slopes.slope_range_percent})</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {constraintZones.moderate_slopes.area_acres?.toFixed(2)} <span className="text-sm font-normal">acres</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {constraintZones.moderate_slopes.area_square_meters?.toFixed(0)} m²
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-700 mb-1">Slope Range</p>
                      <p className="text-xl font-bold text-gray-900">
                        {constraintZones.moderate_slopes.slope_range_percent}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-700 mb-1">Developability Factor</p>
                      <p className="text-xl font-bold text-gray-900">
                        {(constraintZones.moderate_slopes.developability_factor * 100).toFixed(0)}%
                      </p>
                      <p className="text-xs text-gray-600 mt-1">Reduced development efficiency</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Buildable Area Details */}
      {buildable && Object.keys(buildable).length > 0 && (
        <Card className="p-6">
          <SectionHeader title="Buildable Area Summary" icon={Grid3x3} section="buildable" />
          {expandedSections.buildable && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Gross Buildable Area</span>
                    <span className="text-gray-900 font-semibold">
                      {buildable.gross_buildable_acres?.toFixed(2) || '—'} acres
                    </span>
                  </div>
                  {buildable.gross_buildable_square_meters && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium text-xs">Gross (square meters)</span>
                      <span className="text-gray-900 font-semibold">
                        {buildable.gross_buildable_square_meters?.toFixed(0).toLocaleString()} m²
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Net Buildable Area</span>
                    <span className="text-gray-900 font-semibold">
                      {buildable.net_buildable_acres?.toFixed(2) || '—'} acres
                    </span>
                  </div>
                  {buildable.net_buildable_square_meters && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium text-xs">Net (square meters)</span>
                      <span className="text-gray-900 font-semibold">
                        {buildable.net_buildable_square_meters?.toFixed(0).toLocaleString()} m²
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Buildable Percentage</span>
                    <span className="text-gray-900 font-semibold">
                      {buildable.buildable_percentage?.toFixed(1) || '—'}%
                    </span>
                  </div>
                  {buildable.usable_area_after_constraints && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Usable After Constraints</span>
                      <span className="text-gray-900 font-semibold">
                        {buildable.usable_area_after_constraints?.toFixed(2) || '—'} acres
                      </span>
                    </div>
                  )}
                  {buildable.excluded_acres && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Excluded Area</span>
                      <span className="text-gray-900 font-semibold">
                        {buildable.excluded_acres?.toFixed(2) || '—'} acres
                      </span>
                    </div>
                  )}
                  {buildable.setback_acres && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-600 font-medium">Setback Area</span>
                      <span className="text-gray-900 font-semibold">
                        {buildable.setback_acres?.toFixed(2) || '—'} acres
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {buildable.constraints && (
                <div className="col-span-2 mt-4">
                  <p className="text-sm font-semibold text-gray-900 mb-2">Applied Constraints</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(buildable.constraints).map(([key, value]) => (
                      <span key={key} className="px-3 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">
                        {key.replace(/_/g, ' ')}: {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Solar Array Layout */}
      {solarArrayLayout && Object.keys(solarArrayLayout).length > 0 && (
        <Card className="p-6 border-l-4 border-l-[#0078d4]">
          <SectionHeader title="Solar Array Layout" icon={Grid3x3} section="arrayLayout" />
          {expandedSections.arrayLayout && (
            <div className="space-y-6">
              {solarArrayLayout.array_configuration && (
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-[#0078d4]">
                  <p className="text-xs text-gray-700 font-medium mb-1">Array Configuration</p>
                  <p className="text-2xl font-bold text-gray-900">{solarArrayLayout.array_configuration}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-[#0078d4]">
                    <p className="text-xs text-gray-700 font-medium mb-2">Estimated Module Area</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {solarArrayLayout.estimated_module_area_acres?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">acres</p>
                    <p className="text-xs text-gray-600 mt-2">
                      {solarArrayLayout.estimated_module_area_square_meters?.toFixed(0).toLocaleString()} m²
                    </p>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Roads & Access</span>
                    <span className="text-gray-900 font-bold">{solarArrayLayout.roads_and_access_acres?.toFixed(2)} acres</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Inverter Stations</span>
                    <span className="text-gray-900 font-bold">{solarArrayLayout.inverter_stations_acres?.toFixed(2)} acres</span>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Substation Area</span>
                    <span className="text-gray-900 font-bold">{solarArrayLayout.substation_area_acres?.toFixed(2)} acres</span>
                  </div>

                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Ground Coverage Ratio</span>
                    <span className="text-gray-900 font-bold">{(solarArrayLayout.ground_coverage_ratio * 100).toFixed(0)}%</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-green-600">
                    <p className="text-xs text-gray-700 font-medium mb-2">Total Infrastructure Area</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {solarArrayLayout.total_infrastructure_acres?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">acres</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Site Capacity Estimate - Enhanced */}
      {capacity && Object.keys(capacity).length > 0 && (
        <Card className="p-6 border-l-4 border-l-[#0078d4]">
          <SectionHeader title="Site Capacity Estimate" icon={Zap} section="capacity" />
          {expandedSections.capacity && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-l-[#0078d4]">
                  <p className="text-xs text-gray-700 font-medium mb-2">Estimated DC Capacity</p>
                  <p className="text-5xl font-bold text-gray-900">
                    {capacity.estimated_dc_capacity_mw?.toFixed(2)}
                  </p>
                  <p className="text-lg text-gray-600 mt-1">MW (DC)</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-l-green-600">
                  <p className="text-xs text-gray-700 font-medium mb-2">Estimated AC Capacity</p>
                  <p className="text-5xl font-bold text-gray-900">
                    {capacity.estimated_ac_capacity_mw?.toFixed(2)}
                  </p>
                  <p className="text-lg text-gray-600 mt-1">MW (AC)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Specific Yield</span>
                    <span className="text-gray-900 font-bold">{capacity.specific_yield_mw_per_acre?.toFixed(4)} MW/acre</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">DC/AC Ratio</span>
                    <span className="text-gray-900 font-bold">{capacity.dc_ac_ratio?.toFixed(2)}</span>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-700 font-medium">Panel Efficiency</span>
                    <span className="text-gray-900 font-bold">{capacity.panel_efficiency_percent?.toFixed(1)}%</span>
                  </div>
                  {capacity.tracker_type && (
                    <div className="flex justify-between items-center py-3 border-b border-gray-200">
                      <span className="text-gray-700 font-medium">Tracker Type</span>
                      <span className="text-gray-900 font-bold capitalize">{capacity.tracker_type}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Grid Connection */}
      {grid && Object.keys(grid).length > 0 && (
        <Card className="p-6">
          <SectionHeader title="Grid Interconnection" icon={Zap} section="grid" />
          {expandedSections.grid && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium block mb-1">Utility Company</span>
                    <span className="text-gray-900">{grid.utility_name || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium block mb-1">ISO/RTO</span>
                    <span className="text-gray-900">{grid.iso_rto || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium block mb-1">Nearest Substation</span>
                    <span className="text-gray-900">
                      {typeof grid.nearest_substation_name === 'string'
                        ? grid.nearest_substation_name
                        : grid.nearest_substation?.name || '—'}
                    </span>
                    {grid.estimated_distance_km && (
                      <p className="text-xs text-gray-500 mt-1">
                        {grid.estimated_distance_km.toFixed(2)} km away
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600 font-medium block mb-1">Voltage Level</span>
                    <span className="text-gray-900">
                      {grid.estimated_interconnection_voltage_kv || grid.voltage_level || '—'} kV
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 font-medium block mb-1">Est. Timeline</span>
                    <span className="text-gray-900">{grid.estimated_timeline_months || '—'}</span>
                  </div>
                  {grid.estimated_interconnection_cost_usd && (
                    <div>
                      <span className="text-gray-600 font-medium block mb-1">Est. Cost Range</span>
                      <span className="text-gray-900">
                        ${(grid.estimated_interconnection_cost_usd.low / 1000000).toFixed(2)}M -
                        ${(grid.estimated_interconnection_cost_usd.high / 1000000).toFixed(2)}M
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Interconnection Requirements */}
              {grid.interconnection_requirements && grid.interconnection_requirements.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">Interconnection Requirements</p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 bg-blue-50 p-4 rounded-lg">
                    {grid.interconnection_requirements.map((req, idx) => (
                      <li key={idx} className="pl-2">{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Solar Resource */}
      {solar && Object.keys(solar).length > 0 && (
        <Card className="p-6 border-l-4 border-l-[#0078d4]">
          <SectionHeader title="Solar Resource Analysis" icon={Zap} section="solar" />
          {expandedSections.solar && (
            <div className="space-y-6">
              {/* Resource Quality Banner */}
              {solar.solar_resource_quality && (
                <div className={`p-5 rounded-lg border-l-4 bg-gray-50 ${
                  solar.solar_resource_quality === 'excellent' ? 'border-l-green-600' :
                  solar.solar_resource_quality === 'good' ? 'border-l-blue-600' :
                  solar.solar_resource_quality === 'fair' ? 'border-l-yellow-600' :
                  'border-l-orange-600'
                }`}>
                  <p className="text-xs font-medium text-gray-600 mb-1">Solar Resource Quality</p>
                  <p className="text-3xl font-bold capitalize text-gray-900">
                    {solar.solar_resource_quality}
                  </p>
                </div>
              )}

              {/* Annual Irradiance */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Annual Irradiance</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-l-yellow-600">
                    <p className="text-xs text-gray-700 font-semibold mb-2">Global Horizontal Irradiance (GHI)</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {solar.annual_ghi_kwh_m2?.toFixed(1) || '—'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">kWh/m²/year</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-l-orange-600">
                    <p className="text-xs text-gray-700 font-semibold mb-2">Direct Normal Irradiance (DNI)</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {solar.annual_dni_kwh_m2?.toFixed(1) || '—'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">kWh/m²/year</p>
                  </div>
                  <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-l-[#0078d4]">
                    <p className="text-xs text-gray-700 font-semibold mb-2">Latitude Tilt Irradiance</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {solar.annual_lat_tilt_kwh_m2?.toFixed(1) || '—'}
                    </p>
                    <p className="text-xs text-gray-600 mt-1 font-medium">kWh/m²/year</p>
                  </div>
                </div>
              </div>

              {/* Daily Average Irradiance */}
              <div>
                <p className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Daily Average Irradiance</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <span className="text-gray-700 font-medium text-sm">Average GHI</span>
                    <span className="text-gray-900 font-bold text-lg">{solar.average_ghi_kwh_m2_day?.toFixed(2) || '—'} <span className="text-xs">kWh/m²/day</span></span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <span className="text-gray-700 font-medium text-sm">Average DNI</span>
                    <span className="text-gray-900 font-bold text-lg">{solar.average_dni_kwh_m2_day?.toFixed(2) || '—'} <span className="text-xs">kWh/m²/day</span></span>
                  </div>
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <span className="text-gray-700 font-medium text-sm">Average Lat Tilt</span>
                    <span className="text-gray-900 font-bold text-lg">{solar.average_lat_tilt_kwh_m2_day?.toFixed(2) || '—'} <span className="text-xs">kWh/m²/day</span></span>
                  </div>
                </div>
              </div>

              {/* Capacity Factor */}
              {solar.estimated_capacity_factor_percent && (
                <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-l-purple-600">
                  <p className="text-xs text-gray-700 font-medium mb-2">Estimated Capacity Factor</p>
                  <p className="text-5xl font-bold text-gray-900">
                    {solar.estimated_capacity_factor_percent}%
                  </p>
                </div>
              )}

              {/* Data Source */}
              {solar.data_source && (
                <div className="bg-gray-100 p-3 rounded text-xs text-gray-600 border-l-4 border-gray-400">
                  <p><span className="font-semibold">Data Source:</span> {solar.data_source}</p>
                  {solar.last_updated && (
                    <p className="mt-1"><span className="font-semibold">Last Updated:</span> {new Date(solar.last_updated).toLocaleDateString()}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Financial Metrics */}
      {(financial && Object.keys(financial).length > 0) || (recommendations?.estimated_total_project_cost_usd || recommendations?.estimated_development_cost_per_watt_usd) ? (
        <Card className="p-6 border-l-4 border-l-[#0078d4]">
          <SectionHeader title="Financial Metrics" icon={DollarSign} section="financial" />
          {expandedSections.financial && (
            <div className="space-y-6">
              {/* Project Cost Estimate */}
              {(recommendations?.estimated_total_project_cost_usd || recommendations?.estimated_development_cost_per_watt_usd) && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Project Cost Estimate</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recommendations?.estimated_total_project_cost_usd?.low && (
                      <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-l-red-600">
                        <p className="text-xs text-gray-700 font-semibold mb-2">Low Estimate</p>
                        <p className="text-3xl font-bold text-gray-900">
                          ${(recommendations.estimated_total_project_cost_usd.low / 1000000).toFixed(2)}M
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Total Project Cost</p>
                      </div>
                    )}
                    {recommendations?.estimated_total_project_cost_usd?.high && (
                      <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-l-orange-600">
                        <p className="text-xs text-gray-700 font-semibold mb-2">High Estimate</p>
                        <p className="text-3xl font-bold text-gray-900">
                          ${(recommendations.estimated_total_project_cost_usd.high / 1000000).toFixed(2)}M
                        </p>
                        <p className="text-xs text-gray-600 mt-1">Total Project Cost</p>
                      </div>
                    )}
                    {recommendations?.estimated_development_cost_per_watt_usd && (
                      <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-l-[#0078d4]">
                        <p className="text-xs text-gray-700 font-semibold mb-2">Development Cost</p>
                        <p className="text-3xl font-bold text-gray-900">
                          ${recommendations.estimated_development_cost_per_watt_usd?.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-600 mt-1">per Watt (USD)</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Revenue Metrics */}
              {(financial.estimated_revenue_per_acre_usd_annual || financial.estimated_lease_rate_per_acre_usd_annual) && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Revenue Metrics</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {financial.estimated_revenue_per_acre_usd_annual && (
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-green-600">
                          <p className="text-xs text-gray-700 font-medium mb-1">Revenue per Acre (Annual)</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${financial.estimated_revenue_per_acre_usd_annual?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">per acre per year</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3">
                      {financial.estimated_lease_rate_per_acre_usd_annual && (
                        <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-l-teal-600">
                          <p className="text-xs text-gray-700 font-medium mb-1">Lease Rate per Acre (Annual)</p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${financial.estimated_lease_rate_per_acre_usd_annual?.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">per acre per year</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Returns & Performance */}
              {(financial.estimated_project_irr_percent || financial.estimated_payback_period_years) && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wide">Returns & Performance</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3 text-sm">
                      {financial.estimated_project_irr_percent && (
                        <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-l-purple-600">
                          <p className="text-xs text-gray-700 font-semibold mb-2">Estimated Project IRR</p>
                          <p className="text-4xl font-bold text-gray-900">
                            {financial.estimated_project_irr_percent?.toFixed(1)}%
                          </p>
                          <p className="text-xs text-gray-600 mt-2">Internal Rate of Return</p>
                        </div>
                      )}
                    </div>
                    <div className="space-y-3 text-sm">
                      {financial.estimated_payback_period_years && (
                        <div className="bg-gray-50 p-5 rounded-lg border-l-4 border-l-indigo-600">
                          <p className="text-xs text-gray-700 font-semibold mb-2">Estimated Payback Period</p>
                          <p className="text-4xl font-bold text-gray-900">
                            {financial.estimated_payback_period_years?.toFixed(1)}
                          </p>
                          <p className="text-xs text-gray-600 mt-2">years</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>
      ) : null}

      {/* Recommendations */}
      {recommendations && (recommendations.next_steps || recommendations.considerations || recommendations.key_risks || recommendations.optimization_opportunities) && (
        <Card className="p-6">
          <SectionHeader title="Recommendations & Next Steps" icon={FileText} section="recommendations" />
          {expandedSections.recommendations && (
            <div className="space-y-6">
              {/* Site Suitability Summary */}
              {(recommendations.site_suitability_rating || recommendations.site_suitability_score) && (
                <div className={`p-4 rounded-lg bg-gray-50 border-l-4 ${
                  recommendations.site_suitability_rating?.toLowerCase() === 'excellent' ? 'border-l-green-600' :
                  recommendations.site_suitability_rating?.toLowerCase() === 'good' ? 'border-l-blue-600' :
                  'border-l-yellow-600'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-gray-600">Site Suitability Rating</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {recommendations.site_suitability_rating}
                      </p>
                    </div>
                    {recommendations.site_suitability_score && (
                      <div className="text-right">
                        <p className="text-xs font-medium text-gray-600">Score</p>
                        <p className="text-3xl font-bold text-gray-900">
                          {recommendations.site_suitability_score}/100
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Key Risks */}
              {recommendations.key_risks && recommendations.key_risks.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">⚠️ Key Risks</p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border-l-4 border-l-red-600">
                    {recommendations.key_risks.map((risk, idx) => (
                      <li key={idx} className="pl-2">{risk}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Optimization Opportunities */}
              {recommendations.optimization_opportunities && recommendations.optimization_opportunities.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">💡 Optimization Opportunities</p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border-l-4 border-l-[#0078d4]">
                    {recommendations.optimization_opportunities.map((opportunity, idx) => (
                      <li key={idx} className="pl-2">{opportunity}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Steps */}
              {recommendations.next_steps && recommendations.next_steps.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">📋 Recommended Next Steps</p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700 bg-gray-50 p-4 rounded-lg border-l-4 border-l-green-600">
                    {recommendations.next_steps.map((step, idx) => (
                      <li key={idx} className="pl-2">{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Considerations */}
              {recommendations.considerations && recommendations.considerations.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">Key Considerations</p>
                  <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                    {recommendations.considerations.map((consideration, idx) => (
                      <li key={idx} className="pl-2">{consideration}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Data Sources */}
      {dataSources && Object.keys(dataSources).length > 0 && (
        <Card className="p-6">
          <SectionHeader title="Data Sources & Methodology" icon={FileText} section="dataSources" />
          {expandedSections.dataSources && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {dataSources.dem_source && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600 font-medium">DEM Source</p>
                    <p className="text-gray-900">{dataSources.dem_source}</p>
                    {dataSources.dem_resolution_meters && (
                      <p className="text-xs text-gray-500 mt-1">Resolution: {dataSources.dem_resolution_meters}m</p>
                    )}
                  </div>
                )}
                {dataSources.wetlands_database && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600 font-medium">Wetlands Data</p>
                    <p className="text-gray-900">{dataSources.wetlands_database}</p>
                  </div>
                )}
                {dataSources.soil_data_source && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600 font-medium">Soil Data</p>
                    <p className="text-gray-900">{dataSources.soil_data_source}</p>
                  </div>
                )}
                {dataSources.transmission_data_source && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600 font-medium">Transmission Data</p>
                    <p className="text-gray-900">{dataSources.transmission_data_source}</p>
                  </div>
                )}
                {dataSources.imagery_date && (
                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-xs text-gray-600 font-medium">Imagery Date</p>
                    <p className="text-gray-900">{new Date(dataSources.imagery_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>
              {analysis.analysis_version && (
                <div className="text-xs text-gray-500 mt-4">
                  <p>Analysis Version: {analysis.analysis_version}</p>
                </div>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <Card className="p-6 border-yellow-300 bg-yellow-50">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
            ⚠️ Analysis Warnings
          </h3>
          <ul className="list-disc list-inside space-y-2 text-sm text-yellow-800">
            {warnings.map((warning, idx) => (
              <li key={idx} className="pl-2">{warning}</li>
            ))}
          </ul>
        </Card>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-6xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black bg-opacity-50 rounded-full p-2"
            >
              <Minimize2 size={24} />
            </button>
            <img
              src={selectedImage.gcp_url}
              alt={selectedImage.description}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-center">
              <p className="text-white text-lg font-semibold">{selectedImage.description}</p>
              <a
                href={selectedImage.gcp_url}
                download={selectedImage.filename}
                className="inline-flex items-center gap-2 mt-2 text-white hover:text-gray-300"
              >
                <Download size={16} />
                Download {selectedImage.filename}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
