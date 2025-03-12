
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
    // Get subscription status from the session
    const status = session.status || 'active';
    const isTrialing = session.trial_period ? true : false;
    const trialEnd = isTrialing && session.trial_end ? new Date(session.trial_end * 1000).toISOString() : null;
    const currentPeriodEnd = session.expires_at ? new Date(session.expires_at * 1000).toISOString() : null;
    
    // Get the user ID from the metadata
    const userId = session.metadata?.userId;
    
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
