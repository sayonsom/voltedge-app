'use client';

import FolderSection from '../FolderSection';
import FileItem from '../FileItem';
import { FileText } from 'lucide-react';

export default function ReportsSection({ data }) {
  if (!data?.items?.length) {
    return (
      <FolderSection title="Reports" icon={FileText} badge="0 items">
        <p className="text-sm text-gray-500 italic">No reports available</p>
      </FolderSection>
    );
  }

  return (
    <FolderSection title="Reports" icon={FileText} badge={`${data.items.length} items`}>
      <div className="space-y-1">
        {data.items.map((item) => (
          <FileItem key={item.id} file={item} />
        ))}
      </div>
    </FolderSection>
  );
}
