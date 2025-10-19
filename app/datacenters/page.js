'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/layout/Navigation';
import StatusBar from '@/components/layout/StatusBar';
import Card from '@/components/ui/Card';
import { Server, Zap, Building2, Calendar, MapPin, Activity } from 'lucide-react';

export default function DataCenters() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

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

  // Dummy commissioned data centers
  const dataCenters = [
    {
      id: 1,
      name: 'VoltEdge Dallas DC-1',
      location: 'Dallas, TX',
      type: 'Hyperscale',
      commissionedDate: '2023-03-15',
      capacity: 75,
      sqft: 187500,
      utilizationRate: 82,
      status: 'Operational',
      uptime: 99.99,
      pue: 1.35,
    },
    {
      id: 2,
      name: 'VoltEdge Silicon Valley Edge',
      location: 'San Jose, CA',
      type: 'Edge Computing',
      commissionedDate: '2023-07-22',
      capacity: 15,
      sqft: 37500,
      utilizationRate: 95,
      status: 'Operational',
      uptime: 99.95,
      pue: 1.28,
    },
    {
      id: 3,
      name: 'VoltEdge Atlanta Metro',
      location: 'Atlanta, GA',
      type: 'Colocation',
      commissionedDate: '2022-11-08',
      capacity: 50,
      sqft: 125000,
      utilizationRate: 78,
      status: 'Operational',
      uptime: 99.98,
      pue: 1.42,
    },
    {
      id: 4,
      name: 'VoltEdge Seattle DC-2',
      location: 'Seattle, WA',
      type: 'Hyperscale',
      commissionedDate: '2024-01-10',
      capacity: 100,
      sqft: 250000,
      utilizationRate: 65,
      status: 'Operational',
      uptime: 100.0,
      pue: 1.25,
    },
    {
      id: 5,
      name: 'VoltEdge Miami Edge',
      location: 'Miami, FL',
      type: 'Edge Computing',
      commissionedDate: '2023-09-30',
      capacity: 20,
      sqft: 50000,
      utilizationRate: 88,
      status: 'Operational',
      uptime: 99.92,
      pue: 1.38,
    },
    {
      id: 6,
      name: 'VoltEdge Denver Campus',
      location: 'Denver, CO',
      type: 'Enterprise',
      commissionedDate: '2023-05-18',
      capacity: 40,
      sqft: 100000,
      utilizationRate: 72,
      status: 'Operational',
      uptime: 99.96,
      pue: 1.45,
    },
  ];

  const getTypeColor = (type) => {
    switch (type) {
      case 'Hyperscale':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Edge Computing':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Colocation':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'Enterprise':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const totalCapacity = dataCenters.reduce((sum, dc) => sum + dc.capacity, 0);
  const totalArea = dataCenters.reduce((sum, dc) => sum + dc.sqft, 0);
  const avgUtilization = (dataCenters.reduce((sum, dc) => sum + dc.utilizationRate, 0) / dataCenters.length).toFixed(1);
  const avgUptime = (dataCenters.reduce((sum, dc) => sum + dc.uptime, 0) / dataCenters.length).toFixed(2);

  return (
    <div className="min-h-screen flex flex-col bg-[#f3f2f1]">
      <Navigation />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              My Data Centers
            </h1>
            <p className="text-sm text-gray-600">
              Overview of your commissioned and operational data centers
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded">
                  <Server className="text-[#0078d4]" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total DCs</p>
                  <p className="text-xl font-semibold text-gray-900">{dataCenters.length}</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded">
                  <Zap className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Capacity</p>
                  <p className="text-xl font-semibold text-gray-900">{totalCapacity} MW</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded">
                  <Activity className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Avg Utilization</p>
                  <p className="text-xl font-semibold text-gray-900">{avgUtilization}%</p>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-50 rounded">
                  <Building2 className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Total Area</p>
                  <p className="text-xl font-semibold text-gray-900">{(totalArea / 1000).toFixed(0)}K sqft</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Data Centers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {dataCenters.map((dc) => (
              <Card key={dc.id}>
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {dc.name}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin size={14} />
                        {dc.location}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded border text-xs font-medium ${getTypeColor(dc.type)}`}>
                      {dc.type}
                    </span>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Zap size={14} className="text-gray-600" />
                        <p className="text-xs text-gray-600">Capacity</p>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{dc.capacity} MW</p>
                    </div>

                    <div className="p-3 bg-gray-50 rounded">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 size={14} className="text-gray-600" />
                        <p className="text-xs text-gray-600">Size</p>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">{dc.sqft.toLocaleString()} sqft</p>
                    </div>
                  </div>

                  {/* Utilization Bar */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">Utilization Rate</span>
                      <span className="text-xs font-medium text-gray-900">{dc.utilizationRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${dc.utilizationRate}%` }}
                      />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-600">Uptime</p>
                      <p className="text-sm font-medium text-gray-900">{dc.uptime}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">PUE</p>
                      <p className="text-sm font-medium text-gray-900">{dc.pue}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Status</p>
                      <p className="text-sm font-medium text-green-600">{dc.status}</p>
                    </div>
                  </div>

                  {/* Commissioned Date */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 border-t border-gray-100">
                    <Calendar size={12} />
                    <span>Commissioned: {new Date(dc.commissionedDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}
