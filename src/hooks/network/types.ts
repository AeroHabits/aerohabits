
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

// Sample endpoints to ping for connection testing
export const PING_ENDPOINTS = [
  'https://www.google.com',
  'https://www.cloudflare.com',
  'https://www.fastly.com',
];
