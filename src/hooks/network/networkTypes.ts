
export interface ConnectionStatus {
  isOnline: boolean;
  latency: number | null;
  quality: 'good' | 'acceptable' | 'poor' | 'offline';
  downlinkSpeed: number | null; // In Mbps if available
  lastChecked: number; // Timestamp
  reliability: number; // 0-100% based on recent checks
}

export type PingResult = {
  success: boolean;
  timestamp: number;
};

export type NetworkQuality = 'good' | 'acceptable' | 'poor' | 'offline';
