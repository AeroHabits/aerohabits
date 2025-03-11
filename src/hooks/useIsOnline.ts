
// Export useOnlineStatus with a more semantically appropriate name
import { useOnlineStatus } from './useOnlineStatus';

export function useIsOnline() {
  return useOnlineStatus();
}
