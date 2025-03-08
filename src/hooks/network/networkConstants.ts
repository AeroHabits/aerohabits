
// Constants for network quality measurement
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
