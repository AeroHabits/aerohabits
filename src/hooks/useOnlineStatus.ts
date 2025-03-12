
import { useConnectionQuality } from './network/useConnectionQuality';

// For backward compatibility, return isOnline boolean directly
export function useOnlineStatus() {
  const { isOnline } = useConnectionQuality();
  return isOnline;
}

// Export the hook that provides detailed connection info
export function useDetailedConnectionStatus() {
  const { connectionDetails } = useConnectionQuality();
  return connectionDetails;
}
