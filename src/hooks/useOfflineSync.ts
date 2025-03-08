
import { useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { useOnlineStatus } from "./useOnlineStatus";
import { useSyncQueue } from "./sync/useSyncQueue";
import { useSyncProcessor } from "./sync/useSyncProcessor";
import { SYNC_DEBOUNCE_MS } from "./sync/syncTypes";
import { SyncAction, SyncEntityType } from "@/types";

export function useOfflineSync() {
  const isOnline = useOnlineStatus();
  const { queueSync } = useSyncQueue();
  const { processSyncQueue, isSyncing } = useSyncProcessor();

  // Auto-sync when coming back online with progressive loading
  useEffect(() => {
    if (isOnline) {
      processSyncQueue();
    }
  }, [isOnline, processSyncQueue]);

  // Debounced sync processor
  const debouncedSync = useCallback(
    debounce(() => processSyncQueue(), SYNC_DEBOUNCE_MS),
    [processSyncQueue]
  );

  return {
    queueSync,
    processSyncQueue,
    debouncedSync,
    isOnline,
    isSyncing
  };
}
