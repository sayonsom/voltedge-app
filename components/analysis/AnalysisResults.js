'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Download, FileText, MapPin, Maximize2 } from 'lucide-react';
import { downloadAndSavePDF } from '@/services/report.service';

/**
 * Analysis Results Component
 * Displays completed analysis results
 */
export default function AnalysisResults({ result, onNewAnalysis }) {
  const [downloading, setDownloading] = useState(false);

  if (!result) {
    return null;
  }

  const { site_info, results, visualizations, analysis_id } = result;

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      await downloadAndSavePDF(analysis_id, site_info.site_name);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Site Info Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              {site_info.site_name}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin size={16} />
              <span>{site_info.location?.address || 'Location'}</span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <span>Coordinates: {site_info.location?.latitude?.toFixed(6)}, {site_info.location?.longitude?.toFixed(6)}</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleDownloadPDF}
              disabled={downloading}
              icon={<Download size={16} />}
            >
              {downloading ? 'Downloading...' : 'Download PDF'}
            </Button>
            
            <Button
              onClick={onNewAnalysis}
              icon={<FileText size={16} />}
            >
              New Analysis
            </Button>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-1">Total Area</div>
          <div className="text-3xl font-semibold text-gray-900">
            {results.total_area_acres?.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600 mt-1">acres</div>
        </Card>

        <Card className="p-6 border-[#0078d4] border-2">
          <div className="text-sm text-gray-600 mb-1">Buildable Area</div>
          <div className="text-3xl font-semibold text-[#0078d4]">
            {results.buildable_area?.buildable_acres?.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            acres ({results.buildable_area?.buildable_percentage?.toFixed(1)}%)
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-sm text-gray-600 mb-1">Non-Buildable</div>
          <div className="text-3xl font-semibold text-gray-900">
            {(results.total_area_acres - results.buildable_area?.buildable_acres)?.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600 mt-1">acres</div>
        </Card>
      </div>

      {/* Visualizations */}
      {visualizations && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Maps</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {visualizations.buildable_area_map && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Buildable Area Map</div>
                <div className="relative group">
                  <img
                    src={visualizations.buildable_area_map}
                    alt="Buildable Area Map"
                    className="w-full h-auto rounded border border-gray-200"
                  />
                  <button
                    onClick={() => window.open(visualizations.buildable_area_map, '_blank')}
                    className="absolute top-2 right-2 p-2 bg-white rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
            )}

            {visualizations.slope_map && (
              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Slope Analysis Map</div>
                <div className="relative group">
                  <img
                    src={visualizations.slope_map}
                    alt="Slope Map"
                    className="w-full h-auto rounded border border-gray-200"
                  />
                  <button
                    onClick={() => window.open(visualizations.slope_map, '_blank')}
                    className="absolute top-2 right-2 p-2 bg-white rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Maximize2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Detailed Results */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Analysis</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Slope Analysis */}
          {results.slope_analysis && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Slope Analysis</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mean Slope:</span>
                  <span className="font-medium">{results.slope_analysis.mean_slope?.toFixed(2)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Max Slope:</span>
                  <span className="font-medium">{results.slope_analysis.max_slope?.toFixed(2)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Buildable by Slope:</span>
                  <span className="font-medium text-green-600">
                    {results.slope_analysis.buildable_percentage?.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Water Analysis */}
          {results.water_analysis && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Water Bodies</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Water Coverage:</span>
                  <span className="font-medium">{results.water_analysis.water_percentage?.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Water Area:</span>
                  <span className="font-medium">{results.water_analysis.water_area_acres?.toFixed(2)} acres</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Analysis Metadata */}
      <Card className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Analysis ID:</span>
            <p className="font-mono text-xs mt-1">{analysis_id}</p>
          </div>
          <div>
            <span className="text-gray-600">Created:</span>
            <p className="mt-1">{new Date(result.created_at).toLocaleString()}</p>
          </div>
          <div>
            <span className="text-gray-600">Status:</span>
            <p className="mt-1">
              <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                Completed
              </span>
            </p>
          </div>
          <div>
            <span className="text-gray-600">Processing Time:</span>
            <p className="mt-1">{result.processing_time_seconds?.toFixed(1)}s</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
