'use client';

import FolderSection from '../FolderSection';
import FileItem from '../FileItem';
import { Search } from 'lucide-react';

export default function InitialSurveysSection({ data }) {
  if (!data?.items?.length) {
    return (
      <FolderSection title="Initial Surveys" icon={Search} badge="0 items">
        <p className="text-sm text-gray-500 italic">No survey data available</p>
      </FolderSection>
    );
  }

  return (
    <FolderSection title="Initial Surveys" icon={Search} badge={`${data.items.length} items`} defaultOpen>
      <div className="space-y-1">
        {data.items.map((item) => (
          <FileItem key={item.id} file={item} />
        ))}
      </div>
    </FolderSection>
  );
}
