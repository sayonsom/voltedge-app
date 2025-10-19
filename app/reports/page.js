"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useJobStatus } from '@/context/JobStatusContext';
import LeftSidebar from '@/components/layout/LeftSidebar';
import Card from '@/components/ui/Card';
import { searchAnalyses, getAnalysisStatus } from '@/services/analysis.service';
import { Loader, RefreshCw, Search } from 'lucide-react';

export default function ReportsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { job: activeJob, startJob, updateJob, clearJob } = useJobStatus();
  const [analyses, setAnalyses] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [jobStatuses, setJobStatuses] = useState({}); // Track status for each job
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  const fetchAnalyses = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setListLoading(true);
      const data = await searchAnalyses({ limit: 50 });

      const fetchedAnalyses = data.analyses || [];
      setAnalyses(fetchedAnalyses);
      setError('');

      // Check if the active job now appears in the list
      // If so, clear it to stop polling/displaying synthetic rows
      if (activeJob?.jobId && fetchedAnalyses.some(a => a.id === activeJob.jobId)) {
        clearJob();
      }
    } catch (err) {
      console.error('[Reports] Failed to fetch analyses:', err);
      setError('Failed to load reports');
    } finally {
      // Always mark initial load as complete
      setIsInitialLoad(false);
      if (showLoading) setListLoading(false);
    }
  }, [activeJob, clearJob]);

  // Fetch analyses on mount
  useEffect(() => {
    if (user) {
      // If we have an active job (just redirected), fetch silently to keep UX snappy
      // Otherwise show loading
      const showLoading = !activeJob;
      fetchAnalyses(showLoading);
    }
  }, [user]); // Only run on mount or user change

  // Refresh analyses silently when a new job is started
  useEffect(() => {
    // Don't start refreshing until initial load is complete
    if (isInitialLoad) return;
    if (!activeJob) return;

    // Refresh every 5 seconds while a job is active
    const interval = setInterval(() => {
      fetchAnalyses(false); // Silent refresh - don't show loading
    }, 5000);

    return () => clearInterval(interval);
  }, [activeJob, fetchAnalyses, isInitialLoad]);

  // Capture job_id or temp_id from URL to show immediate status row after redirect
  useEffect(() => {
    const jid = searchParams?.get('job_id');
    const tempId = searchParams?.get('temp_id');
    const siteName = searchParams?.get('site_name');

    if (jid) {
      // Real job ID received
      startJob(jid, { status: 'pending', progress: 0, message: 'Starting analysis...', siteName });
    } else if (tempId) {
      // Temporary ID - show "Getting Ready" state
      startJob(tempId, { status: 'getting_ready', progress: 0, message: 'Preparing analysis...', siteName: siteName || 'New Analysis' });
    }
  }, [searchParams, startJob]);

  // Poll for status of recent analyses (created in last hour)
  useEffect(() => {
    if (analyses.length === 0) return;

    const recentAnalyses = analyses.filter(a => {
      const createdAt = new Date(a.created_at);
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
      return createdAt > hourAgo;
    });

    if (recentAnalyses.length === 0) return;

    const pollStatuses = async () => {
      for (const analysis of recentAnalyses) {
        try {
          const status = await getAnalysisStatus(analysis.id);
          setJobStatuses(prev => ({
            ...prev,
            [analysis.id]: {
              status: status.status,
              progress: status.progress || 0,
              message: status.message,
            }
          }));
        } catch (err) {
          console.error(`Failed to get status for ${analysis.id}:`, err);
        }
      }
    };

    pollStatuses();
    const interval = setInterval(pollStatuses, 3000); // Poll every 3 seconds

    return () => clearInterval(interval);
  }, [analyses]);

  // Poll for the actively-started job if provided via query param
  useEffect(() => {
    if (!activeJob?.jobId) return;

    let cancelled = false;
    const pollActive = async () => {
      try {
        const status = await getAnalysisStatus(activeJob.jobId);
        if (!cancelled) {
          updateJob({ status: status.status, progress: status.progress, message: status.message });

          // If completed or failed, clear after a short delay
          if (status.status === 'completed' || status.status === 'failed') {
            setTimeout(() => {
              if (!cancelled) {
                clearJob();
                fetchAnalyses(false); // Refresh list to show completed job
              }
            }, 2000);
          }
        }
      } catch (e) {
        console.error('Failed to get active job status', e);
        // If job not found (404), clear it
        if (e.response?.status === 404) {
          clearJob();
        }
      }
    };

    pollActive();
    const interval = setInterval(pollActive, 3000);
    return () => { cancelled = true; clearInterval(interval); };
  }, [activeJob?.jobId, updateJob, clearJob, fetchAnalyses]);

  if (loading) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center">
        <Loader size={48} className="text-[#0078d4] animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const getDisplayStatus = (analysis) => {
    const jobStatus = jobStatuses[analysis.id];
    if (jobStatus) {
      return {
        status: jobStatus.status,
        progress: jobStatus.progress,
        message: jobStatus.message,
      };
    }
    // Default to completed if no status info
    return { status: 'completed', progress: 100, message: null };
  };

  // Filter analyses based on search query
  const filteredAnalyses = analyses.filter(analysis => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      analysis.site_name?.toLowerCase().includes(query) ||
      analysis.formatted_address?.toLowerCase().includes(query) ||
      analysis.county?.toLowerCase().includes(query)
    );
  });

  // Pagination
  const totalPages = Math.ceil(filteredAnalyses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAnalyses = filteredAnalyses.slice(startIndex, endIndex);

  return (
    <div className="relative w-full min-h-screen bg-[#f3f2f1]">
      <LeftSidebar />
      
      <main className="ml-16 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Reports</h1>
              <p className="text-sm text-gray-600 mt-1">Buildable area analysis history</p>
            </div>
            <button
              onClick={() => router.push('/analysis')}
              className="bg-[#0078d4] hover:bg-[#106ebe] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              New Analysis
            </button>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by site name, address, or county..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
              />
            </div>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
            >
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
              <option value={100}>All</option>
            </select>
          </div>

          {error && (
            <Card className="p-4 border-red-200 bg-red-50">
              <p className="text-red-800">{error}</p>
            </Card>
          )}

          {/* Active job status banner */}
          {activeJob && (activeJob.status === 'getting_ready' || activeJob.status === 'pending' || activeJob.status === 'processing') && (
            <Card className="p-4 border-blue-200 bg-blue-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Loader size={18} className="text-blue-600 animate-spin" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      {activeJob.status === 'getting_ready' ? 'Getting analysis ready...' : 'Analysis in progress'}
                    </p>
                    <p className="text-xs text-blue-800">
                      {activeJob.siteName || 'New Analysis'} — {activeJob.message || 'Processing...'}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-blue-800">
                  {activeJob.status === 'getting_ready' ? (
                    <span className="animate-pulse">Starting...</span>
                  ) : (
                    <span>{activeJob.progress ?? 0}%</span>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Reports Table */}
          <Card className="overflow-hidden">
            {isInitialLoad && listLoading && analyses.length === 0 ? (
              <div className="p-8 text-center">
                <Loader size={32} className="text-[#0078d4] animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600">Loading reports...</p>
              </div>
            ) : analyses.length === 0 && !isInitialLoad ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 mb-4">No analyses found</p>
                <button
                  onClick={() => router.push('/analysis')}
                  className="text-[#0078d4] hover:underline text-sm"
                >
                  Create your first analysis
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Site Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Location</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Status</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Buildable Area</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-700">Created</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Synthetic row for active job (not yet in list) */}
                    {activeJob && (activeJob.status === 'getting_ready' || activeJob.status === 'pending' || activeJob.status === 'processing') && (
                      <tr className="border-t border-gray-100 bg-blue-50/40">
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{activeJob.siteName || 'New Analysis'}</div>
                          <div className="text-xs text-gray-600">
                            {activeJob.status === 'getting_ready' ? 'Preparing analysis...' : 'Analysis in progress...'}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-gray-400 text-xs">—</div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Loader size={14} className="text-blue-600 animate-spin" />
                            <span className="inline-block px-2 py-1 text-xs rounded-full font-medium bg-blue-100 text-blue-800">
                              {activeJob.status === 'getting_ready' ? 'Getting Ready' : activeJob.status}
                              {activeJob.progress !== undefined && activeJob.status !== 'getting_ready' && ` (${activeJob.progress}%)`}
                            </span>
                          </div>
                          {activeJob.message && (
                            <div className="text-xs text-gray-500 mt-1">{activeJob.message}</div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">—</td>
                        <td className="px-4 py-3 text-gray-400 text-xs">Just now</td>
                        <td className="px-4 py-3 text-right">
                          <button
                            disabled
                            className="text-gray-400 cursor-not-allowed font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    )}

                    {paginatedAnalyses.map((analysis) => {
                      const displayStatus = getDisplayStatus(analysis);
                      const isProcessing = displayStatus.status === 'pending' || displayStatus.status === 'processing';
                      const isCompleted = displayStatus.status === 'completed';
                      const isFailed = displayStatus.status === 'failed';

                      return (
                        <tr 
                          key={analysis.id} 
                          className="border-t border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => router.push(`/reports/${analysis.id}`)}
                        >
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{analysis.site_name}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-gray-600 text-xs">
                              {analysis.county}, {analysis.formatted_address?.split(',').pop()?.trim()}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {isProcessing && (
                                <Loader size={14} className="text-blue-600 animate-spin" />
                              )}
                              <span className={`inline-block px-2 py-1 text-xs rounded-full font-medium ${
                                isCompleted ? 'bg-green-100 text-green-800' :
                                isProcessing ? 'bg-blue-100 text-blue-800' :
                                isFailed ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {displayStatus.status}
                                {isProcessing && displayStatus.progress !== undefined && ` (${displayStatus.progress}%)`}
                              </span>
                            </div>
                            {(isProcessing || isFailed) && displayStatus.message && (
                              <div className={`text-xs mt-1 ${isFailed ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                {displayStatus.message}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {isCompleted ? (
                              <div>
                                <div className="font-medium text-gray-900">
                                  {analysis.net_buildable_acres?.toFixed(1) || '0'} acres
                                </div>
                                {analysis.buildable_percentage > 0 && (
                                  <div className="text-xs text-gray-500">
                                    {analysis.buildable_percentage?.toFixed(0)}% buildable
                                  </div>
                                )}
                              </div>
                            ) : isFailed ? (
                              <span className="text-red-600 text-xs font-medium">Failed</span>
                            ) : (
                              <span className="text-gray-400 text-xs">Processing...</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">
                            {new Date(analysis.created_at).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/reports/${analysis.id}`);
                              }}
                              className="text-[#0078d4] hover:text-[#106ebe] font-medium"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, filteredAnalyses.length)} of {filteredAnalyses.length} results
                {searchQuery && ` (filtered from ${analyses.length} total)`}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Refresh Button */}
          <div className="flex justify-center">
            <button
              onClick={fetchAnalyses}
              disabled={listLoading}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50"
            >
              <RefreshCw size={16} className={listLoading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
