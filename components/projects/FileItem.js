'use client';

import { FileText, FileSpreadsheet, File, Download } from 'lucide-react';
import { getStatusColor } from '@/lib/mockData/projects';

export default function FileItem({ file }) {
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'excel':
        return FileSpreadsheet;
      default:
        return File;
    }
  };

  const Icon = getFileIcon(file.type);

  return (
    <div className="flex items-center justify-between py-2 px-3 hover:bg-white rounded transition-colors group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Icon size={18} className="text-gray-500 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-900 truncate">{file.name}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-500">{file.size}</span>
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{new Date(file.uploadedDate).toLocaleDateString()}</span>
            {file.expiryDate && (
              <>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">Expires: {new Date(file.expiryDate).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {file.status && (
          <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(file.status)}`}>
            {file.status.replace(/-/g, ' ')}
          </span>
        )}
        <button className="p-1 hover:bg-gray-100 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          <Download size={16} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
