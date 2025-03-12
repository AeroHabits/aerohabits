
import { stripe } from "./stripe.ts";
import { supabaseAdmin } from "./supabaseAdmin.ts";
import { updateUserSubscription, findUserByCustomerId } from "./webhookHandlerUtils.ts";

// Handle subscription created events
export async function handleSubscriptionCreated(subscription) {
  console.log("Subscription created:", subscription.id);
  
  const customerId = subscription.customer;
  const status = subscription.status;
  const subscriptionId = subscription.id;
  const metadata = subscription.metadata || {};
  const userId = metadata.userId;
  
  const isTrialing = status === 'trialing';
  const trialEnd = isTrialing ? new Date(subscription.trial_end * 1000).toISOString() : null;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

  console.log(`Customer ID: ${customerId}`);
  
  try {
    // If we have userId in metadata, use it directly
    if (userId) {
      await updateUserSubscription(userId, customerId, subscriptionId, status, trialEnd, currentPeriodEnd);
      return;
    }
    
    // Otherwise, look up by customer ID
    const foundUserId = await findUserByCustomerId(customerId);
    if (foundUserId) {
      await updateUserSubscription(foundUserId, customerId, subscriptionId, status, trialEnd, currentPeriodEnd);
    }
  } catch (error) {
    console.error("Error updating subscription status:", error);
    throw error;
  }
}

// Handle subscription updated events
export async function handleSubscriptionUpdated(subscription) {
  console.log("Subscription updated:", subscription.id);
  
  const customerId = subscription.customer;
  const status = subscription.status;
  const subscriptionId = subscription.id;
  const isTrialing = status === 'trialing';
  const trialEnd = isTrialing ? new Date(subscription.trial_end * 1000).toISOString() : null;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
  
  try {
    const userId = await findUserByCustomerId(customerId);
    if (userId) {
      await updateUserSubscription(userId, customerId, subscriptionId, status, trialEnd, currentPeriodEnd);
    }
  } catch (error) {
    console.error("Error updating subscription status:", error);
    throw error;
  }
}

// Handle subscription deleted events
export async function handleSubscriptionDeleted(subscription) {
  console.log("Subscription deleted:", subscription.id);
  
  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  
  try {
    const userId = await findUserByCustomerId(customerId);
    if (userId) {
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          is_subscribed: false,
          subscription_status: "canceled",
          subscription_id: null,
          current_period_end: null,
          trial_end_date: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }
      
      console.log(`Subscription canceled for user ${userId}`);
    }
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
}

// Handle trial will end events
export async function handleTrialWillEnd(subscription) {
  console.log("Trial will end soon:", subscription.id);
  
  const customerId = subscription.customer;
  const trialEnd = new Date(subscription.trial_end * 1000).toISOString();
  
  try {
    const userId = await findUserByCustomerId(customerId);
    if (userId) {
      // You could trigger a notification or email here to remind the user
      // that their trial will end soon
      
      console.log(`Trial ending soon for user ${userId} on ${trialEnd}`);
    }
  } catch (error) {
    console.error("Error processing trial end notification:", error);
    throw error;
  }
}
