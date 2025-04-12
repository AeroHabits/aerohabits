
import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { useOnlineStatus } from "./useOnlineStatus";
import { SyncEntityType, SyncAction } from "@/types";
import { queueSyncOperation } from "./sync/queueOperations";
import { useSyncProcessor } from "./sync/syncProcessor";
import { useRetryLogic } from "./sync/retryUtils";
import { SYNC_DEBOUNCE_MS } from "./sync/syncConstants";

export function useOfflineSync() {
  const isOnline = useOnlineStatus();
  const { processSyncQueue, isSyncing } = useSyncProcessor();
  const { retryTimeouts } = useRetryLogic();

  // Clear any pending retries on unmount
  useEffect(() => {
    return () => {
      retryTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [retryTimeouts]);

  // Queue sync operation with priority support
  const queueSync = async (
    entityId: string, 
    entityType: SyncEntityType,
    action: SyncAction,
    data?: any,
    priority: number = 1 
  ) => {
    await queueSyncOperation(entityId, entityType, action, data, priority);
  };

  // Debounced sync processor
  const debouncedSync = useCallback(
    debounce(processSyncQueue, SYNC_DEBOUNCE_MS),
    []
  );

  // Auto-sync when coming back online with progressive loading
  useEffect(() => {
    if (isOnline) {
      processSyncQueue();
    }
  }, [isOnline, processSyncQueue]);

  return {
    queueSync,
    processSyncQueue,
    debouncedSync,
    isOnline,
    isSyncing
  };
}
