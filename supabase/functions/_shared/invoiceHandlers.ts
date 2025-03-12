
import { stripe } from "./stripe.ts";
import { supabaseAdmin } from "./supabaseAdmin.ts";
import { updateUserSubscription, findUserByCustomerId } from "./webhookHandlerUtils.ts";

// Handle invoice payment succeeded events
export async function handleInvoicePaymentSucceeded(invoice) {
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
    const userId = await findUserByCustomerId(customerId);
    if (userId) {
      await updateUserSubscription(userId, customerId, subscriptionId, status, trialEnd, currentPeriodEnd);
    }
  } catch (error) {
    console.error("Error processing invoice payment success:", error);
    throw error;
  }
}

// Handle invoice payment failed events
export async function handleInvoicePaymentFailed(invoice) {
  if (!invoice.subscription) {
    return; // Only process subscription invoices
  }

  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;
  
  console.log(`Invoice payment failed. Subscription: ${subscriptionId}, Customer: ${customerId}`);
  
  try {
    // Lookup user by customer ID
    const userId = await findUserByCustomerId(customerId);
    if (userId) {
      // Update user's subscription status to past_due or unpaid
      const { error: updateError } = await supabaseAdmin
        .from("profiles")
        .update({
          subscription_status: "past_due",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      if (updateError) {
        throw updateError;
      }
      
      console.log(`Subscription marked as past_due for user ${userId}`);
    }
  } catch (error) {
    console.error("Error processing invoice payment failure:", error);
    throw error;
  }
}
