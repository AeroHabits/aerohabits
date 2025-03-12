
// Define the handler type for webhook events
export type WebhookEventHandler = (eventData: any) => Promise<void>;

// Create an interface for our registry
interface WebhookRegistry {
  registerHandler(eventType: string, handler: WebhookEventHandler): void;
  getHandler(eventType: string): WebhookEventHandler | null;
  hasHandler(eventType: string): boolean;
}

// Implement the webhook registry
class AppStoreWebhookRegistry implements WebhookRegistry {
  private handlers: Map<string, WebhookEventHandler> = new Map();

  registerHandler(eventType: string, handler: WebhookEventHandler): void {
    this.handlers.set(eventType, handler);
    console.log(`Registered handler for event type: ${eventType}`);
  }

  getHandler(eventType: string): WebhookEventHandler | null {
    return this.handlers.get(eventType) || null;
  }

  hasHandler(eventType: string): boolean {
    return this.handlers.has(eventType);
  }
}

// Create and export a singleton instance
export const webhookRegistry = new AppStoreWebhookRegistry();

// Helper function to register multiple handlers at once
export function registerWebhookHandlers(handlersMap: Record<string, WebhookEventHandler>): void {
  Object.entries(handlersMap).forEach(([eventType, handler]) => {
    webhookRegistry.registerHandler(eventType, handler);
  });
}
