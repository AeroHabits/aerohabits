
/**
 * Helper function to detect if the app is running in iOS environment
 */
export const isRunningInIOSApp = (): boolean => {
  return window.navigator.userAgent.includes('iPhone') || 
         window.navigator.userAgent.includes('iPad') || 
         (window as any).webkit?.messageHandlers?.storeKit !== undefined;
};

/**
 * Triggers the StoreKit interface for iOS in-app purchases
 */
export const triggerIOSPurchase = (productId: string): void => {
  if ((window as any).webkit?.messageHandlers?.storeKit) {
    (window as any).webkit.messageHandlers.storeKit.postMessage({
      action: 'purchase',
      productId
    });
  }
};

/**
 * Opens the iOS subscription management interface
 */
export const openIOSSubscriptionManagement = (): void => {
  if ((window as any).webkit?.messageHandlers?.storeKit) {
    (window as any).webkit.messageHandlers.storeKit.postMessage({
      action: 'manageSubscriptions'
    });
  }
};
