import { API_CONFIG } from '@/config/api';

/**
 * WebSocket Manager
 * Handles real-time progress updates via WebSocket
 */
export class WebSocketManager {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = API_CONFIG.websocket.reconnectAttempts;
    this.reconnectDelay = API_CONFIG.websocket.reconnectDelay;
    this.pingInterval = null;
    this.handlers = new Map();
    this.connectionId = null;
    this.isIntentionallyClosed = false;
  }

  /**
   * Connect to job-specific WebSocket
   * @param {string} jobId - Job ID to monitor
   */
  connect(jobId) {
    this.connectionId = jobId;
    this.isIntentionallyClosed = false;
    const wsUrl = `${API_CONFIG.wsURL}/api/v1/buildable-area/ws/job/${jobId}`;
    
    console.log('[WebSocket] Connecting to:', wsUrl);
    this._initializeWebSocket(wsUrl);
  }

  /**
   * Connect to batch-specific WebSocket
   * @param {string} batchId - Batch ID to monitor
   */
  connectBatch(batchId) {
    this.connectionId = batchId;
    this.isIntentionallyClosed = false;
    const wsUrl = `${API_CONFIG.wsURL}/api/v1/buildable-area/ws/batch/${batchId}`;
    
    console.log('[WebSocket] Connecting to batch:', wsUrl);
    this._initializeWebSocket(wsUrl);
  }

  /**
   * Initialize WebSocket connection
   * @private
   * @param {string} wsUrl - WebSocket URL
   */
  _initializeWebSocket(wsUrl) {
    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('[WebSocket] Connected');
        this.reconnectAttempts = 0;
        this.startPing();
        this.emit('connected', { connected: true });
      };

      this.ws.onmessage = (event) => {
        try {
          if (event.data === 'pong') {
            // Pong response, keep connection alive
            return;
          }
          
          const data = JSON.parse(event.data);
          console.log('[WebSocket] Message received:', data.type);
          this.handleMessage(data);
        } catch (error) {
          console.error('[WebSocket] Message parse error:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error);
        this.emit('error', { error: 'WebSocket connection error' });
      };

      this.ws.onclose = (event) => {
        console.log('[WebSocket] Closed:', event.code, event.reason);
        this.stopPing();
        this.emit('disconnected', { connected: false });
        
        // Attempt reconnect if not intentionally closed
        if (!this.isIntentionallyClosed) {
          this.attemptReconnect(wsUrl);
        }
      };
    } catch (error) {
      console.error('[WebSocket] Initialization error:', error);
      this.emit('error', { error: error.message });
    }
  }

  /**
   * Start ping interval to keep connection alive
   * @private
   */
  startPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
    }
    
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        try {
          this.ws.send('ping');
        } catch (error) {
          console.error('[WebSocket] Ping failed:', error);
        }
      }
    }, API_CONFIG.websocket.pingInterval);
  }

  /**
   * Stop ping interval
   * @private
   */
  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Attempt to reconnect
   * @private
   * @param {string} wsUrl - WebSocket URL
   */
  attemptReconnect(wsUrl) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WebSocket] Max reconnect attempts reached');
      this.emit('error', { error: 'Failed to reconnect after multiple attempts' });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * this.reconnectAttempts;
    
    console.log(`[WebSocket] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      if (!this.isIntentionallyClosed) {
        this._initializeWebSocket(wsUrl);
      }
    }, delay);
  }

  /**
   * Handle incoming WebSocket message
   * @private
   * @param {Object} data - Message data
   */
  handleMessage(data) {
    const handlers = this.handlers.get(data.type) || [];
    handlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('[WebSocket] Handler error:', error);
      }
    });
    
    // Emit to 'all' listeners
    const allHandlers = this.handlers.get('all') || [];
    allHandlers.forEach(handler => {
      try {
        handler(data);
      } catch (error) {
        console.error('[WebSocket] All handler error:', error);
      }
    });
  }

  /**
   * Register event handler
   * @param {string} type - Event type ('connected', 'progress', 'complete', 'error', 'all')
   * @param {Function} handler - Handler function
   */
  on(type, handler) {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, []);
    }
    this.handlers.get(type).push(handler);
  }

  /**
   * Unregister event handler
   * @param {string} type - Event type
   * @param {Function} handler - Handler function to remove
   */
  off(type, handler) {
    const handlers = this.handlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Emit event to handlers
   * @private
   * @param {string} type - Event type
   * @param {Object} data - Event data
   */
  emit(type, data) {
    this.handleMessage({ type, ...data });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    console.log('[WebSocket] Disconnecting');
    this.isIntentionallyClosed = true;
    this.stopPing();
    
    if (this.ws) {
      if (this.ws.readyState === WebSocket.OPEN || 
          this.ws.readyState === WebSocket.CONNECTING) {
        this.ws.close();
      }
      this.ws = null;
    }
    
    this.handlers.clear();
    this.connectionId = null;
    this.reconnectAttempts = 0;
  }

  /**
   * Check if WebSocket is connected
   * @returns {boolean}
   */
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Get connection state
   * @returns {string} Connection state
   */
  getState() {
    if (!this.ws) return 'CLOSED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'OPEN';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'CLOSED';
      default:
        return 'UNKNOWN';
    }
  }
}

export default WebSocketManager;
