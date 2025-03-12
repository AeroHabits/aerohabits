
import { webhookRegistry } from "./webhookRegistry.ts";

// Get signature from request headers for verification
export function getAppStoreSignature(req: Request): string | null {
  return req.headers.get("x-apple-verification-signature");
}

// Verify and construct App Store event
export function verifyAppStoreWebhook(body: string, signature: string, webhookSecret: string | undefined) {
  if (!webhookSecret) {
    throw new Error("Webhook secret not configured");
  }
  
  try {
    // In a real implementation, we would verify the App Store signature here
    // For now, we'll just parse the JSON
    return JSON.parse(body);
  } catch (err) {
    console.error(`⚠️ App Store webhook signature verification failed.`, err.message);
    throw err;
  }
}

// Process an event using the registry
export async function processWebhookEvent(eventType: string, eventData: any): Promise<boolean> {
  console.log(`Processing event type: ${eventType}`);
  
  if (webhookRegistry.hasHandler(eventType)) {
    const handler = webhookRegistry.getHandler(eventType);
    if (handler) {
      await handler(eventData);
      return true;
    }
  }
  
  console.log(`No handler registered for event type: ${eventType}`);
  return false;
}
