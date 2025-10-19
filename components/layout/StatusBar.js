'use client';

import { useJobStatus } from '@/context/JobStatusContext';

export default function StatusBar() {
  const { job } = useJobStatus();

  return (
    <footer className="h-6 bg-[#0078d4] text-white flex items-center px-4 text-xs z-20">
      <div className="flex items-center gap-4 w-full justify-between">
        <div className="flex items-center gap-2 truncate">
          {job ? (
            <>
              <span className="font-medium">Job:</span>
              <span className="truncate max-w-[160px]" title={job.jobId}>{job.jobId}</span>
              <span>|</span>
              <span className="capitalize">{job.status || 'pending'}</span>
              <span>|</span>
              <span>{Math.round(job.progress || 0)}%</span>
              {job.message ? (
                <>
                  <span>|</span>
                  <span className="truncate max-w-[320px]" title={job.message}>{job.message}</span>
                </>
              ) : null}
            </>
          ) : (
            <>
              <span>Ready</span>
            </>
          )}
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <span>VoltEdge v1.0</span>
          <span>|</span>
          <span>© 2024 VoltEdge</span>
        </div>
      </div>
    </footer>
  );
}
