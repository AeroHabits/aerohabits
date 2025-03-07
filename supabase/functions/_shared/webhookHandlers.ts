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
  try {
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
      console.error(`Error updating subscription for user ${userId}:`, error);
      // Don't throw error, just log it to prevent webhook failure
    } else {
      console.log(`Updated subscription for user ${userId}: status=${status}, isSubscribed=${isSubscribed}`);
    }
  } catch (error) {
    console.error(`Exception in updateUserSubscription for user ${userId}:`, error);
    // Don't rethrow to keep webhook processing
  }
}

// Find user by customer ID
export async function findUserByCustomerId(customerId: string) {
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId);

    if (error) {
      console.error(`Error finding user by customer ID ${customerId}:`, error);
      return null;
    }

    return profiles && profiles.length > 0 ? profiles[0].id : null;
  } catch (error) {
    console.error(`Exception in findUserByCustomerId for ${customerId}:`, error);
    return null;
  }
}

// Subscription handlers
export async function handleSubscriptionCreated(subscription: any) {
  try {
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
    console.error("Error in handleSubscriptionCreated:", error);
    // Don't rethrow error to keep webhook processing
  }
}

export async function handleSubscriptionUpdated(subscription: any) {
  try {
    console.log("Subscription updated:", subscription.id);
    
    const customerId = subscription.customer;
    const status = subscription.status;
    const subscriptionId = subscription.id;
    const isTrialing = status === 'trialing';
    const trialEnd = isTrialing ? new Date(subscription.trial_end * 1000).toISOString() : null;
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
    
    const foundUserId = await findUserByCustomerId(customerId);
    
    if (foundUserId) {
      await updateUserSubscription(foundUserId, customerId, subscriptionId, status, trialEnd, currentPeriodEnd);
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error in handleSubscriptionUpdated:", error);
    // Don't rethrow error to keep webhook processing
  }
}

export async function handleSubscriptionDeleted(subscription: any) {
  try {
    console.log("Subscription deleted:", subscription.id);
    
    const customerId = subscription.customer;
    
    const foundUserId = await findUserByCustomerId(customerId);
    
    if (foundUserId) {
      try {
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
          console.error(`Error updating profile for deleted subscription:`, updateError);
        } else {
          console.log(`Subscription canceled for user ${foundUserId}`);
        }
      } catch (updateError) {
        console.error("Error updating profile for deleted subscription:", updateError);
      }
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error in handleSubscriptionDeleted:", error);
    // Don't rethrow error to keep webhook processing
  }
}

// Checkout & Invoice handlers
export async function handleCheckoutComplete(session: any) {
  try {
    if (session.mode !== "subscription") {
      console.log("Ignoring non-subscription checkout");
      return; // Only process subscription checkouts
    }

    const subscriptionId = session.subscription;
    const customerId = session.customer;
    
    console.log(`Checkout completed. Subscription: ${subscriptionId}, Customer: ${customerId}`);
    
    // Fetch the subscription to get the latest status
    try {
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
    } catch (stripeError) {
      console.error("Error retrieving subscription from Stripe:", stripeError);
    }
  } catch (error) {
    console.error("Error in handleCheckoutComplete:", error);
    // Don't rethrow error to keep webhook processing
  }
}

export async function handleInvoicePaymentSucceeded(invoice: any) {
  try {
    if (!invoice.subscription) {
      console.log("Ignoring non-subscription invoice");
      return; // Only process subscription invoices
    }

    const subscriptionId = invoice.subscription;
    const customerId = invoice.customer;
    
    console.log(`Invoice payment succeeded. Subscription: ${subscriptionId}, Customer: ${customerId}`);
    
    // Fetch the subscription to get the latest status
    try {
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
    } catch (stripeError) {
      console.error("Error retrieving subscription from Stripe:", stripeError);
    }
  } catch (error) {
    console.error("Error in handleInvoicePaymentSucceeded:", error);
    // Don't rethrow error to keep webhook processing
  }
}

export async function handleInvoicePaymentFailed(invoice: any) {
  try {
    if (!invoice.subscription) {
      console.log("Ignoring non-subscription invoice");
      return; // Only process subscription invoices
    }

    const subscriptionId = invoice.subscription;
    const customerId = invoice.customer;
    
    console.log(`Invoice payment failed. Subscription: ${subscriptionId}, Customer: ${customerId}`);
    
    // Lookup user by customer ID
    const foundUserId = await findUserByCustomerId(customerId);
    
    if (foundUserId) {
      try {
        // Update user's subscription status to past_due or unpaid
        const { error: updateError } = await supabaseAdmin
          .from("profiles")
          .update({
            subscription_status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("id", foundUserId);

        if (updateError) {
          console.error("Error updating subscription to past_due:", updateError);
        } else {
          console.log(`Subscription marked as past_due for user ${foundUserId}`);
        }
      } catch (updateError) {
        console.error("Error updating subscription to past_due:", updateError);
      }
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error in handleInvoicePaymentFailed:", error);
    // Don't rethrow error to keep webhook processing
  }
}

export async function handleTrialWillEnd(subscription: any) {
  try {
    console.log("Trial will end soon:", subscription.id);
    
    const customerId = subscription.customer;
    const trialEnd = new Date(subscription.trial_end * 1000).toISOString();
    
    const foundUserId = await findUserByCustomerId(customerId);
    
    if (foundUserId) {
      // You could trigger a notification or email here to remind the user
      // that their trial will end soon
      console.log(`Trial ending soon for user ${foundUserId} on ${trialEnd}`);
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error in handleTrialWillEnd:", error);
    // Don't rethrow error to keep webhook processing
  }
}
