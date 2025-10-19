'use client';

import FolderSection from '../FolderSection';
import FileItem from '../FileItem';
import { FileStack } from 'lucide-react';

export default function DocumentsSection({ data }) {
  if (!data?.items?.length) {
    return (
      <FolderSection title="Documents" icon={FileStack} badge="0 items">
        <p className="text-sm text-gray-500 italic">No documents available</p>
      </FolderSection>
    );
  }

  return (
    <FolderSection title="Documents" icon={FileStack} badge={`${data.items.length} items`}>
      <div className="space-y-1">
        {data.items.map((item) => (
          <FileItem key={item.id} file={item} />
        ))}
      </div>
    </FolderSection>
  );
}
