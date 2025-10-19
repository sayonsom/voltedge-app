'use client';

import { Calendar, Clock } from 'lucide-react';

export default function ProjectTimeline({ project }) {
  const startDate = new Date(project.startDate);
  const endDate = new Date(project.estimatedCompletion);
  const today = new Date();

  const totalDays = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
  const elapsedDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const remainingDays = Math.floor((endDate - today) / (1000 * 60 * 60 * 24));

  const timeProgress = Math.min(Math.max((elapsedDays / totalDays) * 100, 0), 100);

  return (
    <div className="bg-white border border-gray-200 rounded p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Project Timeline</h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-gray-600">Start: {startDate.toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-500" />
            <span className="text-gray-600">End: {endDate.toLocaleDateString()}</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-600">Time Progress</span>
            <span className="text-xs font-medium text-gray-900">{Math.round(timeProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#0078d4] h-2 rounded-full transition-all"
              style={{ width: `${timeProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
          <Clock size={14} className="text-gray-500" />
          <span className="text-xs text-gray-600">
            {remainingDays > 0
              ? `${remainingDays} days remaining`
              : `${Math.abs(remainingDays)} days overdue`}
          </span>
        </div>
      </div>
    </div>
  );
}
