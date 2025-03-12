
import { stripe } from "./stripe.ts";
import { webhookRegistry } from "./webhookRegistry.ts";

// Get signature from request headers
export function getStripeSignature(req: Request): string | null {
  return req.headers.get("stripe-signature");
}

// Verify and construct Stripe event
export function verifyStripeWebhook(body: string, signature: string, webhookSecret: string | undefined) {
  if (!webhookSecret) {
    throw new Error("Webhook secret not configured");
  }
  
  try {
    return stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed.`, err.message);
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
