'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider, useToast } from '@/context/ToastContext';
import { JobStatusProvider } from '@/context/JobStatusContext';
import MapboxProvider from '@/components/providers/MapboxProvider';
import ToastContainer from '@/components/ui/Toast';

function ToastMount() {
  const { toasts, dismiss } = useToast();
  return <ToastContainer toasts={toasts} onDismiss={dismiss} />;
}

export default function RootProviders({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <JobStatusProvider>
          <MapboxProvider>
            {children}
            <ToastMount />
          </MapboxProvider>
        </JobStatusProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
