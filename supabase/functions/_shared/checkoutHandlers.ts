
import { stripe } from "./stripe.ts";
import { updateUserSubscription, findUserByCustomerId } from "./webhookHandlerUtils.ts";

// Handle checkout completion events
export async function handleCheckoutComplete(session) {
  if (session.mode !== "subscription") {
    return; // Only process subscription checkouts
  }

  const subscriptionId = session.subscription;
  const customerId = session.customer;
  
  console.log(`Checkout completed. Subscription: ${subscriptionId}, Customer: ${customerId}`);
  
  try {
    // Fetch the subscription to get the latest status
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const status = subscription.status;
    const isTrialing = status === 'trialing';
    const trialEnd = isTrialing ? new Date(subscription.trial_end * 1000).toISOString() : null;
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
    
    // Get the user ID from the metadata
    const userId = session.metadata?.userId || subscription.metadata?.userId;
    
    if (userId) {
      await updateUserSubscription(userId, customerId, subscriptionId, status, trialEnd, currentPeriodEnd);
    } else {
      // Lookup user by customer ID
      const foundUserId = await findUserByCustomerId(customerId);
      if (foundUserId) {
        await updateUserSubscription(foundUserId, customerId, subscriptionId, status, trialEnd, currentPeriodEnd);
      }
    }
  } catch (error) {
    console.error("Error processing checkout completion:", error);
    throw error;
  }
}
