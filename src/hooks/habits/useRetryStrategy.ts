
import { NetworkQuality } from './useNetworkQuality';

export function useRetryStrategy(isOnline: boolean, networkQuality: NetworkQuality) {
  const shouldRetry = (failureCount: number, error: Error) => {
    // Implement progressive retry strategy
    if (failureCount >= 3) return false;
    if (!isOnline) return false;
    
    // If network conditions are poor, limit retries
    if (networkQuality === 'poor' && failureCount >= 1) {
      return false;
    }
    
    return true;
  };

  return { shouldRetry };
}
