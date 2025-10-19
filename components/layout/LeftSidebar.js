'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Map, 
  Home, 
  Search, 
  Layers, 
  FileText, 
  Settings, 
  User, 
  LogOut,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { logOut } from '@/lib/auth';

export default function LeftSidebar() {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    { icon: Map, label: 'Map View', path: '/map' },
    { icon: Search, label: 'Parcels', path: '/parcels' },
    { icon: Layers, label: 'Analysis', path: '/analysis' },
    { icon: FileText, label: 'Reports', path: '/reports' },
  ];

  return (
    <>
      {/* Thin sidebar */}
      <aside 
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-30 transition-all duration-300 ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
            {isExpanded ? (
              <>
                <span className="text-lg font-semibold text-[#0078d4]">VoltEdge</span>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X size={20} className="text-gray-600" />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsExpanded(true)}
                className="p-1 hover:bg-gray-100 rounded transition-colors mx-auto"
              >
                <Menu size={24} className="text-[#0078d4]" />
              </button>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 py-4">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group ${
                  !isExpanded ? 'justify-center' : ''
                }`}
                title={!isExpanded ? item.label : ''}
              >
                <item.icon 
                  size={22} 
                  className="text-gray-600 group-hover:text-[#0078d4] transition-colors flex-shrink-0" 
                />
                {isExpanded && (
                  <span className="text-sm font-medium text-gray-700 group-hover:text-[#0078d4] transition-colors">
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="border-t border-gray-200 py-4">
            <button
              onClick={() => router.push('/settings')}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group ${
                !isExpanded ? 'justify-center' : ''
              }`}
              title={!isExpanded ? 'Settings' : ''}
            >
              <Settings 
                size={22} 
                className="text-gray-600 group-hover:text-[#0078d4] transition-colors flex-shrink-0" 
              />
              {isExpanded && (
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#0078d4] transition-colors">
                  Settings
                </span>
              )}
            </button>

            <button
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors group ${
                !isExpanded ? 'justify-center' : ''
              }`}
              title={!isExpanded ? 'Profile' : ''}
            >
              <User 
                size={22} 
                className="text-gray-600 group-hover:text-[#0078d4] transition-colors flex-shrink-0" 
              />
              {isExpanded && (
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#0078d4] transition-colors">
                  Profile
                </span>
              )}
            </button>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors group ${
                !isExpanded ? 'justify-center' : ''
              }`}
              title={!isExpanded ? 'Logout' : ''}
            >
              <LogOut 
                size={22} 
                className="text-gray-600 group-hover:text-red-600 transition-colors flex-shrink-0" 
              />
              {isExpanded && (
                <span className="text-sm font-medium text-gray-700 group-hover:text-red-600 transition-colors">
                  Logout
                </span>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile when expanded */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-20 lg:hidden"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
}
