'use client';

import FolderSection from '../FolderSection';
import FileItem from '../FileItem';
import { DollarSign } from 'lucide-react';

export default function FinancialModelSection({ data }) {
  if (!data) {
    return (
      <FolderSection title="Financial Model" icon={DollarSign} badge="0 items">
        <p className="text-sm text-gray-500 italic">No financial data available</p>
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

  const spentPercentage = data.totalBudget ? (data.spent / data.totalBudget) * 100 : 0;

  return (
    <FolderSection
      title="Financial Model"
      icon={DollarSign}
      badge={`${data.items?.length || 0} items`}
    >
      <div className="space-y-4">
        {/* Budget Overview */}
        <div className="bg-white rounded p-3 space-y-3">
          <h4 className="text-sm font-medium text-gray-900">Budget Overview</h4>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Total Budget</p>
              <p className="text-lg font-semibold text-gray-900">{formatCurrency(data.totalBudget)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Spent</p>
              <p className="text-lg font-semibold text-blue-600">{formatCurrency(data.spent)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Remaining</p>
              <p className="text-lg font-semibold text-green-600">
                {formatCurrency(data.totalBudget - data.spent)}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-gray-600">Budget Utilization</span>
              <span className="text-xs font-medium text-gray-900">{spentPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${spentPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Documents */}
        {data.items && data.items.length > 0 && (
          <div className="space-y-1">
            {data.items.map((item) => (
              <FileItem key={item.id} file={item} />
            ))}
          </div>
        )}
      </div>
    </FolderSection>
  );
}
