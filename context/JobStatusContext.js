'use client';

import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const JobStatusContext = createContext(null);

export function useJobStatus() {
  const ctx = useContext(JobStatusContext);
  if (!ctx) throw new Error('useJobStatus must be used within JobStatusProvider');
  return ctx;
}

export function JobStatusProvider({ children }) {
  const [job, setJob] = useState(null); // { jobId, status, progress, message }

  const startJob = useCallback((jobId, initial = { status: 'pending', progress: 0, message: '' }) => {
    setJob({ jobId, ...initial });
  }, []);

  const updateJob = useCallback((updates) => {
    setJob((prev) => prev ? { ...prev, ...updates } : { ...updates });
  }, []);

  const clearJob = useCallback(() => setJob(null), []);

  const value = useMemo(() => ({ job, startJob, updateJob, clearJob }), [job, startJob, updateJob, clearJob]);

  return (
    <JobStatusContext.Provider value={value}>
      {children}
    </JobStatusContext.Provider>
  );
}
