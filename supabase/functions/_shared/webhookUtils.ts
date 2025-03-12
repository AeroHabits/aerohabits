
import { stripe } from "./stripe.ts";

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

// Map event type to handler function
export function getEventHandler(eventType: string) {
  const handlers = {
    "customer.subscription.created": "handleSubscriptionCreated",
    "customer.subscription.updated": "handleSubscriptionUpdated",
    "customer.subscription.deleted": "handleSubscriptionDeleted",
    "checkout.session.completed": "handleCheckoutComplete",
    "invoice.payment_succeeded": "handleInvoicePaymentSucceeded",
    "invoice.payment_failed": "handleInvoicePaymentFailed",
    "customer.subscription.trial_will_end": "handleTrialWillEnd"
  };
  
  return handlers[eventType] || null;
}
