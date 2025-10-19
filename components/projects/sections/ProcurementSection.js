'use client';

import { useState } from 'react';
import FolderSection from '../FolderSection';
import { Package, Server, Cpu, Wind, Monitor } from 'lucide-react';
import { getStatusColor } from '@/lib/mockData/projects';

export default function ProcurementSection({ data }) {
  const [activeTab, setActiveTab] = useState('servers');

  if (!data) {
    return (
      <FolderSection title="Procurement" icon={Package} badge="0 items">
        <p className="text-sm text-gray-500 italic">No procurement data available</p>
      </FolderSection>
    );
  }

  const totalItems =
    (data.servers?.length || 0) +
    (data.gpus?.length || 0) +
    (data.cooling?.length || 0) +
    (data.displays?.length || 0);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const tabs = [
    { id: 'servers', name: 'Servers', icon: Server, count: data.servers?.length || 0 },
    { id: 'gpus', name: 'GPUs', icon: Cpu, count: data.gpus?.length || 0 },
    { id: 'cooling', name: 'Cooling', icon: Wind, count: data.cooling?.length || 0 },
    { id: 'displays', name: 'Displays', icon: Monitor, count: data.displays?.length || 0 },
  ];

  const renderItems = (items) => {
    if (!items || items.length === 0) {
      return <p className="text-sm text-gray-500 italic py-4">No items in this category</p>;
    }

    return (
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded p-3 border border-gray-200">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h5 className="font-medium text-gray-900">{item.vendor}</h5>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${getStatusColor(item.status)}`}>
                    {item.status.replace(/-/g, ' ')}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.model}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(item.totalPrice)}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-600">Quantity</p>
                <p className="text-sm font-medium text-gray-900">{item.quantity}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Unit Price</p>
                <p className="text-sm font-medium text-gray-900">{formatCurrency(item.unitPrice)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Expected Delivery</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(item.expectedDelivery).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <FolderSection title="Procurement" icon={Package} badge={`${totalItems} items`}>
      <div className="space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          {tabs.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-[#0078d4] text-[#0078d4]'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <TabIcon size={16} />
                {tab.name}
                {tab.count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'servers' && renderItems(data.servers)}
          {activeTab === 'gpus' && renderItems(data.gpus)}
          {activeTab === 'cooling' && renderItems(data.cooling)}
          {activeTab === 'displays' && renderItems(data.displays)}
        </div>
      </div>
    </FolderSection>
  );
}
