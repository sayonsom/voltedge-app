'use client';

import { createContext, useContext, useMemo, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]); // [{ id, title, description, type }]

  const push = useCallback((toast) => {
    const id = toast.id || Math.random().toString(36).slice(2);
    const t = { id, type: 'info', ...toast };
    setToasts((prev) => [...prev, t]);
    // Auto-dismiss after 5s
    setTimeout(() => dismiss(id), 5000);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clear = useCallback(() => setToasts([]), []);

  const value = useMemo(() => ({ toasts, push, dismiss, clear }), [toasts, push, dismiss, clear]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}
