'use client';

import { useRouter } from 'next/navigation';

export default function WelcomeModal({ userName, onClose }) {
  const router = useRouter();

  const handleNavigation = (path) => {
    onClose();
    router.push(path);
  };

  const handleSearchForLand = () => {
    // Just dismiss the modal - user is already on the map page
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Welcome {userName}
          </h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Our mission is to help you build, own and operate data centers in record time.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleSearchForLand}
            className="w-full py-3 px-4 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded text-sm font-medium transition-colors"
          >
            Search for Land
          </button>

          <button
            onClick={() => handleNavigation('/projects')}
            className="w-full py-3 px-4 bg-white hover:bg-[#f3f2f1] text-gray-900 border border-gray-200 rounded text-sm font-medium transition-colors"
          >
            Check Development Status
          </button>

          <button
            onClick={() => handleNavigation('/datacenters')}
            className="w-full py-3 px-4 bg-white hover:bg-[#f3f2f1] text-gray-900 border border-gray-200 rounded text-sm font-medium transition-colors"
          >
            My Data Centers
          </button>
        </div>
      </div>
    </div>
  );
}
