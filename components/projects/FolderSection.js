'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

export default function FolderSection({ title, icon: Icon, children, defaultOpen = false, badge = null }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-200 rounded bg-white overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`transition-transform ${isOpen ? 'rotate-0' : ''}`}>
            {isOpen ? <ChevronDown size={20} className="text-gray-600" /> : <ChevronRight size={20} className="text-gray-600" />}
          </div>
          {Icon && <Icon size={20} className="text-[#0078d4]" />}
          <span className="font-medium text-gray-900">{title}</span>
          {badge && (
            <span className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-full">
              {badge}
            </span>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          {children}
        </div>
      )}
    </div>
  );
}
