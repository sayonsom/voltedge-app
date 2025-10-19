'use client';

import { useState } from 'react';
import { Menu, Search, Bell, Settings, User, LogOut } from 'lucide-react';
import { logOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleLogout = async () => {
    await logOut();
    router.push('/');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/map?query=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <header className="h-12 bg-[#0078d4] text-white flex items-center px-4 shadow-md z-20">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button className="hover:bg-[#106ebe] p-2 rounded transition-colors">
          <Menu size={20} />
        </button>
        <span className="text-lg font-semibold">VoltEdge</span>
      </div>

      {/* Center section */}
      <div className="flex-1 max-w-2xl mx-auto px-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-200" size={16} />
          <input
            type="text"
            placeholder="Search parcel by APN or address..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full py-1.5 pl-10 pr-4 rounded text-sm text-gray-900 
                     focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <button className="hover:bg-[#106ebe] p-2 rounded transition-colors">
          <Bell size={20} />
        </button>
        <button className="hover:bg-[#106ebe] p-2 rounded transition-colors">
          <Settings size={20} />
        </button>
        <button className="hover:bg-[#106ebe] p-2 rounded transition-colors">
          <User size={20} />
        </button>
        <button 
          onClick={handleLogout}
          className="hover:bg-[#106ebe] p-2 rounded transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}
