
export interface ConnectionStatus {
  isOnline: boolean;
  latency: number | null;
  quality: 'good' | 'acceptable' | 'poor' | 'offline';
  downlinkSpeed: number | null; // In Mbps if available
  lastChecked: number; // Timestamp
  reliability: number; // 0-100% based on recent checks
}

export interface PingResult {
  success: boolean;
  timestamp: number;
}

// Connection quality thresholds in ms
export const LATENCY_THRESHOLDS = {
  GOOD: 200,      // Under 200ms is good
  ACCEPTABLE: 500 // Under 500ms is acceptable, over is poor
};

// Updated ping endpoints that are more reliable and CORS-friendly
export const PING_ENDPOINTS = [
  '/favicon.ico', // Local endpoint - much more reliable
  'https://api.github.com/zen', // GitHub's lightweight endpoint
  'https://httpbin.org/status/200', // Simple status endpoint
];
