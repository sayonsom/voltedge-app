import { useEffect, useRef, useState, useCallback } from 'react';
import { WebSocketManager } from '@/lib/websocket-manager';

/**
 * React Hook for WebSocket connections
 * Provides real-time updates for analysis jobs
 * 
 * @param {string} jobId - Job ID to monitor
 * @param {Object} options - Configuration options
 * @returns {Object} WebSocket state and controls
 */
export function useWebSocket(jobId, options = {}) {
  const { autoConnect = true, onComplete = null, onError = null } = options;
  
  const wsRef = useRef(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState('CLOSED');
  const [error, setError] = useState(null);

  // Manual connect function (for manual control)
  const connect = useCallback(() => {
    if (!jobId || wsRef.current?.isConnected()) return;

    // If there's an existing connection, disconnect first
    if (wsRef.current) {
      wsRef.current.disconnect();
    }

    // Create new WebSocket manager
    const ws = new WebSocketManager();
    wsRef.current = ws;

    // Setup event handlers
    ws.on('connected', (data) => {
      setIsConnected(true);
      setConnectionState('OPEN');
      setLastMessage({ type: 'connected', ...data });
    });

    ws.on('disconnected', (data) => {
      setIsConnected(false);
      setConnectionState('CLOSED');
      setLastMessage({ type: 'disconnected', ...data });
    });

    ws.on('progress', (data) => {
      setLastMessage({ type: 'progress', ...data });
    });

    ws.on('complete', (data) => {
      setLastMessage({ type: 'complete', ...data });
      if (onComplete) onComplete(data);
    });

    ws.on('error', (data) => {
      setError(data.error);
      setLastMessage({ type: 'error', ...data });
      if (onError) onError(data.error);
    });

    // Connect
    ws.connect(jobId);
  }, [jobId, onComplete, onError]);

  // Handle disconnection
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionState('CLOSED');
  }, []);

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (!autoConnect || !jobId) return;

    // Create new WebSocket manager
    const ws = new WebSocketManager();
    wsRef.current = ws;

    // Setup event handlers
    ws.on('connected', (data) => {
      setIsConnected(true);
      setConnectionState('OPEN');
      setLastMessage({ type: 'connected', ...data });
    });

    ws.on('disconnected', (data) => {
      setIsConnected(false);
      setConnectionState('CLOSED');
      setLastMessage({ type: 'disconnected', ...data });
    });

    ws.on('progress', (data) => {
      setLastMessage({ type: 'progress', ...data });
    });

    ws.on('complete', (data) => {
      setLastMessage({ type: 'complete', ...data });
      if (onComplete) onComplete(data);
    });

    ws.on('error', (data) => {
      setError(data.error);
      setLastMessage({ type: 'error', ...data });
      if (onError) onError(data.error);
    });

    // Connect
    ws.connect(jobId);

    // Update connection state periodically
    const stateInterval = setInterval(() => {
      if (ws) {
        setConnectionState(ws.getState());
      }
    }, 1000);

    // Cleanup function
    return () => {
      clearInterval(stateInterval);
      ws.disconnect();
      wsRef.current = null;
      setIsConnected(false);
      setConnectionState('CLOSED');
    };
  }, [jobId, autoConnect, onComplete, onError]);

  return {
    lastMessage,
    isConnected,
    connectionState,
    error,
    connect,
    disconnect,
    wsManager: wsRef.current,
  };
}

/**
 * React Hook for Batch WebSocket connections
 * 
 * @param {string} batchId - Batch ID to monitor
 * @param {Object} options - Configuration options
 * @returns {Object} WebSocket state and controls
 */
export function useBatchWebSocket(batchId, options = {}) {
  const { autoConnect = true, onComplete = null, onError = null } = options;
  
  const wsRef = useRef(null);
  const [lastMessage, setLastMessage] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [batchProgress, setBatchProgress] = useState(null);

  useEffect(() => {
    if (!autoConnect || !batchId) return;

    const ws = new WebSocketManager();
    wsRef.current = ws;

    ws.on('connected', (data) => {
      setIsConnected(true);
      setLastMessage({ type: 'connected', ...data });
    });

    ws.on('disconnected', () => {
      setIsConnected(false);
    });

    ws.on('batch_progress', (data) => {
      setBatchProgress(data);
      setLastMessage({ type: 'batch_progress', ...data });
    });

    ws.on('batch_complete', (data) => {
      setLastMessage({ type: 'batch_complete', ...data });
      if (onComplete) onComplete(data);
    });

    ws.on('error', (data) => {
      setLastMessage({ type: 'error', ...data });
      if (onError) onError(data.error);
    });

    ws.connectBatch(batchId);

    return () => {
      ws.disconnect();
    };
  }, [batchId, autoConnect, onComplete, onError]);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.disconnect();
    }
  }, []);

  return {
    lastMessage,
    isConnected,
    batchProgress,
    disconnect,
    wsManager: wsRef.current,
  };
}

export default useWebSocket;
