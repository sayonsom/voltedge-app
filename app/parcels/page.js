'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Navigation from '@/components/layout/Navigation';
import StatusBar from '@/components/layout/StatusBar';
import Card from '@/components/ui/Card';
import { MapPin, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import { parcelService } from '@/services/api';

export default function ParcelsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      fetchParcels();
    }
  }, [user, page]);

  const fetchParcels = async () => {
    try {
      setLoading(true);
      const response = await parcelService.getAllParcels(page, 10);
      setParcels(response.data.data);
      setTotalPages(response.data.pagination.totalPages);
      setError(null);
    } catch (err) {
      console.error('Error fetching parcels:', err);
      setError('Failed to load parcels. Please ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (parcelId) => {
    router.push(`/parcels/${parcelId}`);
  };

  if (authLoading) {
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
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Datacenter Parcels
            </h1>
            <p className="text-sm text-gray-600">
              Browse available datacenter parcels and their details
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded text-red-700">
              {error}
            </div>
          )}

          {/* Search and Filter Bar */}
          <Card className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search parcels by name, city, or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-[#0078d4] focus:border-transparent"
                />
              </div>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded hover:bg-[#f3f2f1] transition-colors flex items-center gap-2">
                <Filter size={20} />
                <span>Filters</span>
              </button>
            </div>
          </Card>

          {/* Parcels List */}
          <Card>
            {loading ? (
              <div className="text-center py-12">
                <div className="text-gray-600">Loading parcels...</div>
              </div>
            ) : parcels.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="mx-auto mb-4 text-gray-400" size={48} />
                <p className="text-gray-600">No parcels found</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#f3f2f1]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Parcel Number
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Site Name
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Area (acres)
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Land Cost
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {parcels.map((parcel) => (
                        <tr key={parcel.id} className="hover:bg-[#f3f2f1] transition-colors">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {parcel.parcel_number}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                            {parcel.site_address}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {parcel.site_city}, {parcel.site_state}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            {parseFloat(parcel.gis_acres).toFixed(2)} acres
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                            ${(parcel.total_price / 1000000).toFixed(2)}M
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded ${
                              parcel.status === 'available'
                                ? 'bg-green-50 text-green-700'
                                : parcel.status === 'pending'
                                ? 'bg-yellow-50 text-yellow-700'
                                : 'bg-gray-50 text-gray-700'
                            }`}>
                              {parcel.status || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <button
                              onClick={() => handleViewDetails(parcel.id)}
                              className="text-[#0078d4] hover:text-[#106ebe] font-medium"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
                  <div className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage(page - 1)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded hover:bg-[#f3f2f1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <ChevronLeft size={16} />
                      Previous
                    </button>
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage(page + 1)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded hover:bg-[#f3f2f1] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      Next
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </Card>
        </div>
      </main>

      <StatusBar />
    </div>
  );
}
