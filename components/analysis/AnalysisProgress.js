'use client';

import { Loader2, Wifi, WifiOff, CheckCircle2, XCircle } from 'lucide-react';

/**
 * Analysis Progress Component
 * Shows real-time progress of analysis
 */
export default function AnalysisProgress({ 
  progress = 0, 
  status = 'pending',
  message = '',
  wsConnected = false 
}) {
  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'processing':
        return 'bg-[#0078d4]';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="text-green-600" size={24} />;
      case 'failed':
        return <XCircle className="text-red-600" size={24} />;
      case 'processing':
      case 'pending':
        return <Loader2 className="text-[#0078d4] animate-spin" size={24} />;
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'completed':
        return 'Analysis Complete';
      case 'failed':
        return 'Analysis Failed';
      case 'processing':
        return 'Processing...';
      case 'pending':
        return 'Starting...';
      default:
        return 'Unknown Status';
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded p-6 space-y-4">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <div>
            <h3 className="font-semibold text-gray-900">{getStatusText()}</h3>
            {message && (
              <p className="text-sm text-gray-600">{message}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs">
          {wsConnected ? (
            <>
              <Wifi className="text-green-600" size={16} />
              <span className="text-green-600">Live</span>
            </>
          ) : (
            <>
              <WifiOff className="text-gray-400" size={16} />
              <span className="text-gray-600">Polling</span>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-semibold text-gray-900">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${getStatusColor()} transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Processing Steps Info */}
      {status === 'processing' && (
        <div className="text-xs text-gray-600 space-y-1">
          <p>• Fetching DEM data</p>
          <p>• Analyzing terrain slope</p>
          <p>• Identifying water bodies</p>
          <p>• Calculating buildable area</p>
          <p>• Generating visualizations</p>
        </div>
      )}
    </div>
  );
}
