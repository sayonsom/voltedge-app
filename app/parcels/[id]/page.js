"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/layout/Navigation';
import StatusBar from '@/components/layout/StatusBar';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { getParcelById } from '@/services/parcel.service';
import { startAnalysis, pollAnalysisStatus } from '@/services/analysis.service';
import { useToast } from '@/context/ToastContext';
import { useJobStatus } from '@/context/JobStatusContext';

export default function ParcelDetailPage({ params }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { push } = useToast();
  const { startJob, updateJob } = useJobStatus();
  const { id } = params || {};

  const [parcel, setParcel] = useState(null);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    async function fetch() {
      if (!id) return;
      try {
        const res = await getParcelById(id);
        setParcel(res);
      } catch (e) {
        setError(e.message || 'Failed to load parcel');
      } finally {
        setLoadingData(false);
      }
    }
    fetch();
  }, [id]);

  const handleRunAnalysis = async () => {
    if (!parcel?.latitude || !parcel?.longitude) return;
    try {
      const req = {
        latitude: parcel.latitude,
        longitude: parcel.longitude,
        site_name: parcel.site_address || `APN ${parcel.parcel_number}`,
        bbox_size_meters: 500,
      };
      const res = await startAnalysis(req);
      const jobId = res.job_id;
      push({ title: 'Buildable Area Analysis Started', description: `Job ID: ${jobId}`, type: 'success' });
      startJob(jobId, { status: res.status || 'pending', progress: 0, message: 'Initializing analysis...' });
      pollAnalysisStatus(jobId, (status) => {
        updateJob({ status: status.status, progress: status.progress || 0, message: status.message });
      });
    } catch (e) {
      push({ title: 'Failed to start analysis', description: e.message, type: 'error' });
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f2f1]">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f2f1]">
      <Navigation />
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">Parcel Details</h1>
            <p className="text-sm text-gray-600">ID: {id}</p>
          </div>

          {error && (
            <Card className="p-4 border-red-200 bg-red-50 text-red-800">{error}</Card>
          )}

          {parcel && (
            <Card className="p-6">
              {/* Owner & Property Info */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Property Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Parcel Number</div>
                    <div className="font-semibold text-gray-900">{parcel.parcel_number}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Owner</div>
                    <div className="font-semibold text-gray-900">{parcel.owner_name || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Site Address</div>
                    <div className="font-semibold text-gray-900">
                      {parcel.site_address || '—'}
                      {parcel.site_city && `, ${parcel.site_city}`}
                      {parcel.site_state && `, ${parcel.site_state}`}
                      {parcel.site_zip && ` ${parcel.site_zip}`}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">Coordinates</div>
                    <div className="font-semibold text-gray-900">
                      {parcel.latitude?.toFixed(6)}, {parcel.longitude?.toFixed(6)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Land Details */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Land Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Acreage</div>
                    <div className="font-semibold text-gray-900">{parcel.gis_acres?.toFixed(2) || '—'} acres</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Square Feet</div>
                    <div className="font-semibold text-gray-900">{parcel.calculated_sqft?.toLocaleString() || '—'} sqft</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Use Type</div>
                    <div className="font-semibold text-gray-900">{parcel.use_description || parcel.use_code || '—'}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Zoning</div>
                    <div className="font-semibold text-gray-900">{parcel.zoning || '—'}</div>
                  </div>
                  {parcel.qualified_opportunity_zone && (
                    <div className="md:col-span-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-100 text-yellow-800 rounded text-sm font-semibold">
                        ⭐ Qualified Opportunity Zone
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Valuation */}
              {(parcel.total_value || parcel.land_value) && (
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Valuation</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {parcel.land_value && (
                      <div>
                        <div className="text-gray-600">Land Value</div>
                        <div className="font-semibold text-gray-900">${parcel.land_value.toLocaleString()}</div>
                      </div>
                    )}
                    {parcel.improvement_value && (
                      <div>
                        <div className="text-gray-600">Improvement Value</div>
                        <div className="font-semibold text-gray-900">${parcel.improvement_value.toLocaleString()}</div>
                      </div>
                    )}
                    {parcel.total_value && (
                      <div>
                        <div className="text-gray-600">Total Value</div>
                        <div className="font-semibold text-gray-900">${parcel.total_value.toLocaleString()}</div>
                      </div>
                    )}
                    {parcel.sale_price && (
                      <div>
                        <div className="text-gray-600">Last Sale</div>
                        <div className="font-semibold text-gray-900">
                          ${parcel.sale_price.toLocaleString()}
                          {parcel.sale_date && ` (${new Date(parcel.sale_date).toLocaleDateString()})`}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button onClick={handleRunAnalysis}>Analyze for Solar</Button>
                <Button
                  onClick={() => router.push(`/parcels/${id}/datacenter-report`)}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Data Center Analysis
                </Button>
                {parcel.sdat_web_url && (
                  <Button
                    variant="secondary"
                    onClick={() => window.open(parcel.sdat_web_url, '_blank')}
                  >
                    View SDAT Record
                  </Button>
                )}
              </div>
            </Card>
          )}
        </div>
      </main>
      <StatusBar />
    </div>
  );
}
