'use client';

import FolderSection from '../FolderSection';
import FileItem from '../FileItem';
import { Receipt } from 'lucide-react';

export default function TaxIncentivesSection({ data }) {
  if (!data) {
    return (
      <FolderSection title="Tax Incentives" icon={Receipt} badge="0 items">
        <p className="text-sm text-gray-500 italic">No tax incentive data available</p>
      </FolderSection>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const totalEstimated = data.items?.reduce((sum, item) => sum + (item.estimatedValue || 0), 0) || 0;

  return (
    <FolderSection
      title="Tax Incentives"
      icon={Receipt}
      badge={`${data.items?.length || 0} items`}
    >
      <div className="space-y-4">
        {/* Summary */}
        {data.totalIncentives > 0 && (
          <div className="bg-white rounded p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Approved Incentives</p>
                <p className="text-2xl font-semibold text-green-600">{formatCurrency(data.totalIncentives)}</p>
              </div>
              {totalEstimated > data.totalIncentives && (
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">Potential Additional</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatCurrency(totalEstimated - data.totalIncentives)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Documents with estimated values */}
        {data.items && data.items.length > 0 && (
          <div className="space-y-2">
            {data.items.map((item) => (
              <div key={item.id} className="bg-white rounded p-3 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{item.size}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">
                        {new Date(item.uploadedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {item.estimatedValue > 0 && (
                    <div className="text-right ml-3">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(item.estimatedValue)}
                      </p>
                      <p className="text-xs text-gray-500">Estimated Value</p>
                    </div>
                  )}
                </div>
                {item.status && (
                  <div className="pt-2 border-t border-gray-100">
                    <span className={`inline-block text-xs px-2 py-1 rounded font-medium ${
                      item.status === 'approved' ? 'bg-green-50 text-green-700' :
                      item.status === 'pending' || item.status === 'under-review' ? 'bg-yellow-50 text-yellow-700' :
                      'bg-gray-50 text-gray-700'
                    }`}>
                      {item.status.replace(/-/g, ' ')}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </FolderSection>
  );
}
