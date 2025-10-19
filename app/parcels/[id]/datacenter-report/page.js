"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/layout/Navigation';
import StatusBar from '@/components/layout/StatusBar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ComparisonSummaryCards from '@/components/datacenter/ComparisonSummaryCards';
import PowerPhaseGantt from '@/components/datacenter/PowerPhaseGantt';
import WaterAvailability from '@/components/datacenter/WaterAvailability';
import EnergyProcurement from '@/components/datacenter/EnergyProcurement';
import MapWithInfrastructure from '@/components/datacenter/MapWithInfrastructure';
import RiskAnalysisCards from '@/components/datacenter/RiskAnalysisCards';
import DataCenterSizeConfigurator from '@/components/datacenter/DataCenterSizeConfigurator';
import VendorEquipmentTable from '@/components/datacenter/VendorEquipmentTable';
import FinancialCharts from '@/components/datacenter/FinancialCharts';
import PermittingRequirements from '@/components/datacenter/PermittingRequirements';
import MarketRiskAnalysis from '@/components/datacenter/MarketRiskAnalysis';

import { getParcelById } from '@/services/parcel.service';
import { getDataCenterAnalysis, recalculateForSize } from '@/services/datacenter-analysis.service';

import { Download, ArrowLeft, Loader, Building2, MapPin, Heart } from 'lucide-react';

export default function DataCenterReportPage({ params }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = params || {};

  const [parcel, setParcel] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(true);
  const [recalculating, setRecalculating] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      try {
        // Fetch parcel data
        const parcelData = await getParcelById(id);
        setParcel(parcelData);

        // Generate comprehensive data center analysis
        const analysisData = await getDataCenterAnalysis(id, parcelData);
        setAnalysis(analysisData);
      } catch (e) {
        setError(e.message || 'Failed to load parcel data');
      } finally {
        setLoadingData(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSizeChange = async (newSize) => {
    if (!analysis) return;
    setRecalculating(true);
    try {
      const updatedAnalysis = await recalculateForSize(analysis, newSize);
      setAnalysis(updatedAnalysis);
    } catch (e) {
      console.error('Failed to recalculate:', e);
    } finally {
      setRecalculating(false);
    }
  };

  const handleDownloadReport = () => {
    // In a real implementation, this would generate a PDF
    alert('PDF report generation coming soon!');
  };

  const handleAddToMyList = () => {
    // In a real implementation, this would add to user's saved list
    alert('Added to My List successfully!');
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f2f1]">
        <div className="text-center">
          <Loader size={48} className="text-[#0078d4] animate-spin mx-auto mb-4" />
          <div className="text-gray-600">Loading data center analysis...</div>
        </div>
      </div>
    );
  }

  if (!user) return null;

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f3f2f1]">
        <Navigation />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <Card className="p-6 border-red-200 bg-red-50">
              <p className="text-red-800">{error}</p>
              <Button onClick={() => router.push(`/parcels/${id}`)} className="mt-4">
                Back to Parcel Details
              </Button>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (!parcel || !analysis) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f2f1]">
      <Navigation />

      <main className="flex-1 p-6 print:p-0">
        <div className="max-w-[1600px] mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between print:hidden">
            <div>
              <button
                onClick={() => router.push(`/parcels/${id}`)}
                className="text-sm text-[#0078d4] hover:underline mb-2 flex items-center gap-1"
              >
                <ArrowLeft size={16} />
                Back to Parcel Details
              </button>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {parcel.site_address || 'Land Parcel'}, {parcel.site_city}, {parcel.site_state}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>ULPIN: {analysis.ulpin}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Building2 size={16} />
                  <span>{parcel.gis_acres?.toFixed(1)} acres</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddToMyList}>
                <Heart size={16} className="mr-2" />
                Add to My List
              </Button>
              <Button variant="secondary" onClick={handleDownloadReport}>
                <Download size={16} className="mr-2" />
                Download PDF
              </Button>
            </div>
          </div>

          {/* Print-only header */}
          <div className="hidden print:block mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              VoltEdge Data Center Development Analysis
            </h1>
            <p className="text-sm text-gray-600">
              ULPIN: {analysis.ulpin} | {parcel.gis_acres?.toFixed(1)} acres |
              {parcel.site_address}, {parcel.site_city}, {parcel.site_state}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Generated: {new Date(analysis.generatedAt).toLocaleString()}
            </p>
          </div>

          {/* Recalculating Overlay */}
          {recalculating && (
            <Card className="p-4 bg-blue-50 border-l-4 border-l-[#0078d4]">
              <div className="flex items-center gap-3">
                <Loader size={20} className="text-[#0078d4] animate-spin" />
                <span className="text-sm text-blue-900 font-semibold">
                  Recalculating analysis for selected data center size...
                </span>
              </div>
            </Card>
          )}

          {/* 1. Comparison Summary - Top Level */}
          <ComparisonSummaryCards comparison={analysis.comparison} />

          {/* 2. Land Parcel Overview & Infrastructure */}
          <Card className="p-6 border border-gray-300">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Land Parcel Overview</h2>
              <p className="text-sm text-gray-700">
                Comprehensive site information and suitability assessment
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Side - Parcel Details */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded border border-gray-300">
                    <p className="text-xs text-gray-600 mb-1">Total Acreage</p>
                    <p className="text-2xl font-bold text-gray-900">{parcel.gis_acres?.toFixed(1)}</p>
                    <p className="text-xs text-gray-600 mt-1">acres</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border border-gray-300">
                    <p className="text-xs text-gray-600 mb-1">Coordinates</p>
                    <p className="text-sm font-semibold text-gray-900">{analysis.site.coordinates}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border border-gray-300">
                    <p className="text-xs text-gray-600 mb-1">Zoning</p>
                    <p className="text-lg font-semibold text-gray-900">{parcel.zoning || 'Commercial'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded border border-gray-300">
                    <p className="text-xs text-gray-600 mb-1">Terrain Suitability</p>
                    <p className="text-sm font-semibold text-gray-900">{analysis.terrain.suitability}</p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded border border-gray-300">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Slope Analysis</h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Average Slope: </span>
                      <span className="font-bold text-gray-900">{analysis.terrain.averageSlope}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Max Slope: </span>
                      <span className="font-bold text-gray-900">{analysis.terrain.maxSlope}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Assessment: </span>
                      <span className="font-bold text-gray-900">Favorable conditions</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Auto-generated Design Layout */}
              <div className="bg-gray-50 p-4 rounded border border-gray-300">
                <div className="mb-3">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Auto-generated Data Center Design Layout</h3>
                  <p className="text-xs text-gray-600">AI-powered optimal facility placement and infrastructure design</p>
                </div>
                <div className="bg-white rounded border-2 border-orange-200 overflow-hidden">
                  <img
                    src="/sample_landanalysis.png"
                    alt="Auto-generated Data Center Design Layout"
                    className="w-full h-auto"
                  />
                </div>
                <div className="mt-3 text-xs text-gray-600">
                  <p>Layout optimized for:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Power infrastructure proximity</li>
                    <li>Cooling efficiency and natural airflow</li>
                    <li>Future expansion capability</li>
                    <li>Emergency access and utilities routing</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>

          {/* 3. Feasibility Studies - Phased Power Approach (NEW - FIRST) */}
          <PowerPhaseGantt site={analysis.site} />

          {/* 4. Water Availability (NEW) */}
          <WaterAvailability site={analysis.site} waterData={analysis.water} />

          {/* 5. Energy Procurement Innovations (NEW) */}
          <EnergyProcurement site={analysis.site} />

          {/* 6. Map with Infrastructure */}
          <MapWithInfrastructure site={analysis.site} infrastructure={analysis.infrastructure} />

          {/* 7. Risk Analysis Cards */}
          <RiskAnalysisCards risks={analysis.risks} />

          {/* 8. Data Center Size Configurator */}
          <DataCenterSizeConfigurator
            dcSizes={analysis.dcSizes}
            selectedSize={analysis.selectedSize}
            onSizeChange={handleSizeChange}
            acreage={parcel.gis_acres}
          />

          {/* 9. Vendor Equipment Table */}
          <VendorEquipmentTable
            equipment={analysis.equipment}
            selectedSize={analysis.selectedSize}
          />

          {/* 10. Permitting Requirements */}
          <PermittingRequirements
            permitting={analysis.permitting}
            costs={analysis.costs}
          />

          {/* 11. Financial Projections */}
          <FinancialCharts financials={analysis.financials} />

          {/* 12. Market Risk Analysis with 2x2 Matrix */}
          <MarketRiskAnalysis marketRisk={analysis.marketRisk} />

          {/* Final CTA */}
          <Card className="p-8 bg-gray-100 border border-gray-300 print:hidden">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Move Forward?</h2>
              <p className="text-lg text-gray-700 mb-6">
                Accelerate your data center development by up to 2x while reducing risks and costs.
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => router.push('/projects')}
                  className="bg-gray-800 text-white hover:bg-gray-900"
                >
                  Start a Project
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleDownloadReport}
                  className="border-2 border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
                >
                  Download Full Report
                </Button>
              </div>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 py-6 border-t border-gray-200">
            <p>© 2024 VoltEdge. All rights reserved.</p>
            <p className="mt-1">
              This analysis is based on preliminary data and should not be considered final engineering or financial advice.
            </p>
          </div>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}
