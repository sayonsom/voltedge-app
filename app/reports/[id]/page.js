"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import LeftSidebar from '@/components/layout/LeftSidebar';
import Card from '@/components/ui/Card';
import DetailedAnalysisReport from '@/components/reports/DetailedAnalysisReport';
import { getAnalysis, getAnalysisResults } from '@/services/analysis.service';
import { getAnalysisAttachments } from '@/services/artifact.service';
import { MapPin, Loader } from 'lucide-react';

export default function ReportDetailPage({ params }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = params || {};
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchAnalysis() {
      if (!id) return;
      try {
        console.log('[Report Detail] ====== FETCHING ANALYSIS ======');
        console.log('[Report Detail] URL Parameter ID:', id);
        console.log('[Report Detail] Full params:', params);

        const response = await getAnalysis(id, false); // Don't use cache to get latest
        console.log('[Report Detail] Analysis response received');
        console.log('[Report Detail] Response keys:', response ? Object.keys(response) : 'null');
        console.log('[Report Detail] Full response:', response);
        console.log('[Report Detail] Result keys:', response?.result ? Object.keys(response.result) : 'no result');
        console.log('[Report Detail] Result data:', response?.result);

        // Try multiple methods to get attachments
        let attachments = [];

        // Method 1: Try getAnalysisResults (includes attachments)
        try {
          console.log('[Report Detail] Analysis ID:', id);
          console.log('[Report Detail] Trying results endpoint...');
          const resultsData = await getAnalysisResults(id);
          console.log('[Report Detail] Results data:', resultsData);
          if (resultsData?.attachments && Array.isArray(resultsData.attachments)) {
            attachments = resultsData.attachments;
            console.log('[Report Detail] Got attachments from results:', attachments);
          }
        } catch (resultsError) {
          console.warn('[Report Detail] Results endpoint failed:', resultsError.message);
        }

        // Method 2: Try getAnalysisAttachments
        if (attachments.length === 0) {
          try {
            console.log('[Report Detail] Trying attachments endpoint for ID:', id);
            attachments = await getAnalysisAttachments(id);
            console.log('[Report Detail] Got attachments from service:', attachments);

            // Verify the attachments are for the correct analysis
            attachments.forEach(att => {
              console.log('[Report Detail] Attachment GCP URL:', att.gcp_url);
              if (att.gcp_url && !att.gcp_url.includes(id)) {
                console.warn('[Report Detail] ⚠️ WARNING: Attachment URL does not contain expected analysis ID!');
                console.warn('[Report Detail] Expected ID:', id);
                console.warn('[Report Detail] URL:', att.gcp_url);
              }
            });
          } catch (attachmentError) {
            console.warn('[Report Detail] Attachments endpoint failed:', attachmentError.message);
          }
        }

        // The analysis endpoint returns the full analysis response directly,
        // not wrapped in a status object. Wrap it for consistency.
        if (response.site_identification) {
          // This is a full analysis response, treat as completed
          setData({
            job_id: id,
            status: 'completed',
            progress: 100,
            message: 'Analysis complete',
            result: {
              ...response,
              attachments: attachments.length > 0 ? attachments : response.attachments
            },
            error: null
          });
        } else {
          // This is a status response from job endpoint
          setData({
            ...response,
            result: response.result ? {
              ...response.result,
              attachments: attachments.length > 0 ? attachments : response.result?.attachments
            } : response.result
          });
        }
      } catch (e) {
        console.error('Failed to fetch analysis:', e);
        setError(e.message || 'Failed to load analysis');
      } finally {
        setLoadingData(false);
      }
    }
    fetchAnalysis();
    
    // Poll if still processing
    const interval = setInterval(() => {
      if (data?.status === 'processing' || data?.status === 'pending') {
        fetchAnalysis();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [id, data?.status]);

  if (loading || loadingData) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center">
        <Loader size={48} className="text-[#0078d4] animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const result = data?.result;
  const isProcessing = data?.status === 'processing' || data?.status === 'pending';
  const isCompleted = data?.status === 'completed';
  const isFailed = data?.status === 'failed';

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-[#f3f2f1]">
      <LeftSidebar />
      
      <main className="ml-16 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <button
                onClick={() => router.push('/reports')}
                className="text-sm text-[#0078d4] hover:underline mb-2"
              >
                ← Back to Reports
              </button>
              <h1 className="text-3xl font-semibold text-gray-900">
                {result?.site_identification?.site_name || 'Analysis Report'}
              </h1>
              {result?.site_identification?.location?.address && (
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-1">
                  <MapPin size={14} />
                  {result.site_identification.location.address}
                </p>
              )}
            </div>
            <div className="text-right">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                isCompleted ? 'bg-green-100 text-green-800' :
                isProcessing ? 'bg-blue-100 text-blue-800' :
                isFailed ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {data?.status || 'Unknown'}
              </div>
              <p className="text-xs text-gray-500 mt-1">Job ID: {id}</p>
            </div>
          </div>

          {error && (
            <Card className="p-4 border-red-200 bg-red-50">
              <p className="text-red-800">{error}</p>
            </Card>
          )}

          {isProcessing && (
            <Card className="p-6 border-blue-200 bg-blue-50">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Loader size={24} className="text-blue-600 animate-spin" />
                  <div className="flex-1">
                    <p className="font-semibold text-blue-900">Analysis in Progress</p>
                    <p className="text-sm text-blue-700">
                      {data?.message || 'Processing buildable area analysis...'}
                    </p>
                  </div>
                </div>
                {data?.progress !== undefined && (
                  <div>
                    <div className="w-full bg-blue-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${Math.max(data.progress, 5)}%` }}
                      >
                        {data.progress >= 10 && (
                          <span className="text-xs text-white font-semibold">{data.progress}%</span>
                        )}
                      </div>
                    </div>
                    {data.progress < 10 && (
                      <p className="text-xs text-blue-600 mt-1 font-semibold">{data.progress}%</p>
                    )}
                  </div>
                )}
                <div className="text-xs text-blue-600 bg-blue-100 rounded p-3">
                  <p className="font-medium mb-1">💡 Estimated Time:</p>
                  <p>Small sites (&lt;50 acres): 5-7 minutes</p>
                  <p>Medium sites (50-200 acres): 8-12 minutes</p>
                  <p>Large sites (&gt;200 acres): 12-20 minutes</p>
                </div>
              </div>
            </Card>
          )}

          {isFailed && (
            <Card className="p-6 border-red-200 bg-red-50">
              <h3 className="font-semibold text-red-900 mb-2">Analysis Failed</h3>
              <p className="text-sm text-red-700 mb-4">{data?.error || data?.message || 'An error occurred during analysis'}</p>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/analysis')}
                  className="bg-[#0078d4] hover:bg-[#106ebe] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Try New Analysis
                </button>
                <details className="mt-4">
                  <summary className="text-xs text-red-600 cursor-pointer hover:underline">
                    Technical Details
                  </summary>
                  <pre className="mt-2 text-xs bg-red-100 p-3 rounded overflow-auto max-h-48">
                    {JSON.stringify({
                      job_id: id,
                      status: data?.status,
                      error: data?.error,
                      message: data?.message,
                      created_at: data?.created_at,
                      completed_at: data?.completed_at
                    }, null, 2)}
                  </pre>
                </details>
              </div>
            </Card>
          )}

          {isCompleted && result && (
            <DetailedAnalysisReport analysis={result} jobId={id} />
          )}
        </div>
      </main>
    </div>
  );
}
