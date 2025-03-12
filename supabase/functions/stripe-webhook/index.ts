import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_shared/stripe.ts";
import { supabaseAdmin } from "../_shared/supabaseAdmin.ts";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response(JSON.stringify({ error: "No signature provided" }), {
      status: 400,
    });
  }

  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const body = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed.`, err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    });
  }

  console.log(`Event type: ${event.type}`);

  try {
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event.data.object);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "checkout.session.completed":
        await handleCheckoutComplete(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handleInvoicePaymentSucceeded(event.data.object);
        break;
      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event.data.object);
        break;
      case "customer.subscription.trial_will_end":
        await handleTrialWillEnd(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
    });
  } catch (error) {
    console.error(`Error processing webhook: ${error.message}`);
    return new Response(
      JSON.stringify({ error: "An error occurred processing the webhook" }),
      { status: 500 }
    );
  }
});

async function handleSubscriptionCreated(subscription) {
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
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId);

    if (error) {
      throw error;
    }

    if (profiles && profiles.length > 0) {
      const userId = profiles[0].id;
      await updateUserSubscription(userId, customerId, subscriptionId, status, trialEnd, currentPeriodEnd);
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error updating subscription status:", error);
    throw error;
  }
}

async function handleSubscriptionUpdated(subscription) {
  console.log("Subscription updated:", subscription.id);
  
  const customerId = subscription.customer;
  const status = subscription.status;
  const subscriptionId = subscription.id;
  const isTrialing = status === 'trialing';
  const trialEnd = isTrialing ? new Date(subscription.trial_end * 1000).toISOString() : null;
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
  
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId);

    if (error) {
      throw error;
    }

    if (profiles && profiles.length > 0) {
      const userId = profiles[0].id;
      await updateUserSubscription(userId, customerId, subscriptionId, status, trialEnd, currentPeriodEnd);
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error updating subscription status:", error);
    throw error;
  }
}

async function handleSubscriptionDeleted(subscription) {
  console.log("Subscription deleted:", subscription.id);
  
  const customerId = subscription.customer;
  const subscriptionId = subscription.id;
  
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId);

    if (error) {
      throw error;
    }

    if (profiles && profiles.length > 0) {
      const userId = profiles[0].id;
      
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
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error canceling subscription:", error);
    throw error;
  }
}

async function handleCheckoutComplete(session) {
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
      const { data: profiles, error } = await supabaseAdmin
        .from("profiles")
        .select("id")
        .eq("stripe_customer_id", customerId);

      if (error) {
        throw error;
      }

      if (profiles && profiles.length > 0) {
        await updateUserSubscription(profiles[0].id, customerId, subscriptionId, status, trialEnd, currentPeriodEnd);
      } else {
        console.error(`No user found for customer ${customerId}`);
      }
    }
  } catch (error) {
    console.error("Error processing checkout completion:", error);
    throw error;
  }
}

async function handleInvoicePaymentSucceeded(invoice) {
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
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId);

    if (error) {
      throw error;
    }

    if (profiles && profiles.length > 0) {
      await updateUserSubscription(profiles[0].id, customerId, subscriptionId, status, trialEnd, currentPeriodEnd);
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error processing invoice payment success:", error);
    throw error;
  }
}

async function handleInvoicePaymentFailed(invoice) {
  if (!invoice.subscription) {
    return; // Only process subscription invoices
  }

  const subscriptionId = invoice.subscription;
  const customerId = invoice.customer;
  
  console.log(`Invoice payment failed. Subscription: ${subscriptionId}, Customer: ${customerId}`);
  
  try {
    // Lookup user by customer ID
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId);

    if (error) {
      throw error;
    }

    if (profiles && profiles.length > 0) {
      const userId = profiles[0].id;
      
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
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error processing invoice payment failure:", error);
    throw error;
  }
}

async function handleTrialWillEnd(subscription) {
  console.log("Trial will end soon:", subscription.id);
  
  const customerId = subscription.customer;
  const trialEnd = new Date(subscription.trial_end * 1000).toISOString();
  
  try {
    const { data: profiles, error } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId);

    if (error) {
      throw error;
    }

    if (profiles && profiles.length > 0) {
      const userId = profiles[0].id;
      
      // You could trigger a notification or email here to remind the user
      // that their trial will end soon
      
      console.log(`Trial ending soon for user ${userId} on ${trialEnd}`);
    } else {
      console.error(`No user found for customer ${customerId}`);
    }
  } catch (error) {
    console.error("Error processing trial end notification:", error);
    throw error;
  }
}

async function updateUserSubscription(userId, customerId, subscriptionId, status, trialEndDate, currentPeriodEnd) {
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
