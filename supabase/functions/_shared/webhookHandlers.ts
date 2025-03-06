import { stripe } from "./stripe.ts";
import { supabaseAdmin } from "./supabaseAdmin.ts";

// Shared utility function to update user subscription status
export async function updateUserSubscription(
  userId: string, 
  customerId: string, 
  subscriptionId: string, 
  status: string, 
  trialEndDate: string | null, 
  currentPeriodEnd: string
) {
  // Set is_subscribed to true if the subscription is active or trialing
  const isSubscribed = status === "active" || status === "trialing";
  
  const updateData = {
    stripe_customer_id: customerId,
    subscription_id: subscriptionId,
    subscription_status: status,
    is_subscribed: isSubscribed,
    current_period_end: currentPeriodEnd,
    trial_end_date: trialEndDate,
    updated_at: new Date().toISOString(),
  };
  
  const { error } = await supabaseAdmin
    .from("profiles")
    .update(updateData)
    .eq("id", userId);

  if (error) {
    throw error;
  }
  
  console.log(`Updated subscription for user ${userId}: status=${status}, isSubscribed=${isSubscribed}`);
}

// Find user by customer ID
export async function findUserByCustomerId(customerId: string) {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId);

  if (error) {
    throw error;
  }

  return profiles && profiles.length > 0 ? profiles[0].id : null;
}

// Subscription handlers
export async function handleSubscriptionCreated(subscription: any) {
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
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error updating subscription status:", error);
    throw error;
  }
}

export async function handleSubscriptionUpdated(subscription: any) {
  console.log("Subscription updated:", subscription.id);
  
  const customerId = subscription.customer;
  const status = subscription.status;
  const subscriptionId = subscription.id;
  const isTrialing = status === 'trialing';
  const trialEnd = isTrialing ? new Date(subscription.trial_end * 1000).toISOString() : null;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
  
  try {
    const foundUserId = await findUserByCustomerId(customerId);
    
    if (foundUserId) {
      await updateUserSubscription(foundUserId, customerId, subscriptionId, status, trialEnd, currentPeriodEnd);
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error updating subscription status:", error);
    throw error;
  }
}

export async function handleSubscriptionDeleted(subscription: any) {
  console.log("Subscription deleted:", subscription.id);
  
  const customerId = subscription.customer;
  
  try {
    const foundUserId = await findUserByCustomerId(customerId);
    
    if (foundUserId) {
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
        .eq("id", foundUserId);

      if (updateError) {
        throw updateError;
      }
      
      console.log(`Subscription canceled for user ${foundUserId}`);
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
}

// Checkout & Invoice handlers
export async function handleCheckoutComplete(session: any) {
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
      } else {
        console.error(`No user found for customer ${customerId}`);
      }
    }
  } catch (error) {
    console.error("Error processing checkout completion:", error);
    throw error;
  }
}

export async function handleInvoicePaymentSucceeded(invoice: any) {
  if (!invoice.subscription) {
    return; // Only process subscription invoices
  }

  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;
  
  console.log(`Invoice payment succeeded. Subscription: ${subscriptionId}, Customer: ${customerId}`);
  
  try {
    // Fetch the subscription to get the latest status
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const status = subscription.status;
    const isTrialing = status === 'trialing';
    const trialEnd = isTrialing ? new Date(subscription.trial_end * 1000).toISOString() : null;
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
    
    // Lookup user by customer ID
    const foundUserId = await findUserByCustomerId(customerId);
    
    if (foundUserId) {
      await updateUserSubscription(foundUserId, customerId, subscriptionId, status, trialEnd, currentPeriodEnd);
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error processing invoice payment success:", error);
    throw error;
  }
}

export async function handleInvoicePaymentFailed(invoice: any) {
  if (!invoice.subscription) {
    return; // Only process subscription invoices
  }

  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;
  
  console.log(`Invoice payment failed. Subscription: ${subscriptionId}, Customer: ${customerId}`);
  
  try {
    // Lookup user by customer ID
    const foundUserId = await findUserByCustomerId(customerId);
    
    if (foundUserId) {
      // Update user's subscription status to past_due or unpaid
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: "past_due",
          updated_at: new Date().toISOString(),
        })
        .eq("id", foundUserId);

      if (updateError) {
        throw updateError;
      }
      
      console.log(`Subscription marked as past_due for user ${foundUserId}`);
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error processing invoice payment failure:", error);
    throw error;
  }
}

export async function handleTrialWillEnd(subscription: any) {
  console.log("Trial will end soon:", subscription.id);
  
  const customerId = subscription.customer;
  const trialEnd = new Date(subscription.trial_end * 1000).toISOString();
  
  try {
    const foundUserId = await findUserByCustomerId(customerId);
    
    if (foundUserId) {
      // You could trigger a notification or email here to remind the user
      // that their trial will end soon
      
      console.log(`Trial ending soon for user ${foundUserId} on ${trialEnd}`);
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error processing trial end notification:", error);
    throw error;
  }
}
