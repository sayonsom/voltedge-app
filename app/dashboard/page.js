'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/layout/Navigation';
import StatusBar from '@/components/layout/StatusBar';
import Card from '@/components/ui/Card';
import { Zap, Activity, TrendingUp, AlertTriangle, MapPin, Building2 } from 'lucide-react';
import { dashboardService } from '@/services/api';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardStats();
    }
  }, [user]);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const response = await dashboardService.getStats();
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setStatsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f2f1]">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f2f1]">
      <Navigation />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome to VoltEdge
            </h1>
            <p className="text-sm text-gray-600">
              Power Grid Management Dashboard
            </p>
          </div>

          {/* Stats Grid */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded">
                  <MapPin className="text-[#0078d4]" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Parcels</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {statsLoading ? '...' : stats?.total_parcels || '0'}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded">
                  <Building2 className="text-green-600" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Cities</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {statsLoading ? '...' : stats?.total_cities || '0'}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-50 rounded">
                  <Zap className="text-yellow-600" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Substations</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {statsLoading ? '...' : stats?.total_substations || '0'}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded">
                  <Activity className="text-purple-600" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Water Sources</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {statsLoading ? '...' : stats?.total_water_sources || '0'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 rounded">
                  <TrendingUp className="text-indigo-600" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Land Value</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {statsLoading ? '...' : stats?.total_land_value
                      ? `$${(parseFloat(stats.total_land_value) / 1000000).toFixed(2)}M`
                      : '$0'}
                  </p>
                </div>
              </div>
            </Card>

            <Card className="md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-teal-50 rounded">
                  <TrendingUp className="text-teal-600" size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Average Land Cost</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {statsLoading ? '...' : stats?.avg_land_cost
                      ? `$${(parseFloat(stats.avg_land_cost) / 1000).toFixed(2)}K`
                      : '$0'}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-3">
                  {[
                    { action: 'Grid analysis completed', time: '5 minutes ago', status: 'success' },
                    { action: 'New alert: Substation #12', time: '15 minutes ago', status: 'warning' },
                    { action: 'Power load adjusted', time: '1 hour ago', status: 'info' },
                    { action: 'System backup completed', time: '3 hours ago', status: 'success' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="text-sm text-gray-900">{item.action}</p>
                        <p className="text-xs text-gray-600">{item.time}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        item.status === 'success' ? 'bg-green-50 text-green-700' :
                        item.status === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                        'bg-blue-50 text-blue-700'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => router.push('/map')}
                  className="w-full py-2 px-4 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded text-sm font-medium transition-colors"
                >
                  View Map
                </button>
                <button
                  onClick={() => router.push('/parcels')}
                  className="w-full py-2 px-4 bg-white hover:bg-[#f3f2f1] text-gray-900 border border-gray-200 rounded text-sm font-medium transition-colors"
                >
                  Browse Parcels
                </button>
                <button
                  onClick={() => router.push('/datacenters')}
                  className="w-full py-2 px-4 bg-white hover:bg-[#f3f2f1] text-gray-900 border border-gray-200 rounded text-sm font-medium transition-colors"
                >
                  Datacenters
                </button>
                <button
                  onClick={() => router.push('/reports')}
                  className="w-full py-2 px-4 bg-white hover:bg-[#f3f2f1] text-gray-900 border border-gray-200 rounded text-sm font-medium transition-colors"
                >
                  Reports
                </button>
              </div>
            </Card>
          </div>
          </div>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}
