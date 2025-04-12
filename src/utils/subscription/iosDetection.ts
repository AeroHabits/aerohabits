
// This file is intentionally emptied as we're removing iOS-specific code
// The functions below are stubs to avoid breaking imports until they can be properly removed

/**
 * Helper function to detect if the app is running in iOS environment
 */
export const isRunningInIOSApp = (): boolean => {
  return false;
};

/**
 * Triggers the StoreKit interface for iOS in-app purchases
 */
export const triggerIOSPurchase = (productId: string): void => {
  console.log('iOS in-app purchase functionality removed');
};

/**
 * Opens the iOS subscription management interface
 */
export const openIOSSubscriptionManagement = (): void => {
  console.log('iOS subscription management functionality removed');
};
