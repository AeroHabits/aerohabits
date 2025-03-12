
import { supabaseAdmin } from "./supabaseAdmin.ts";

// Common function to update user subscription in database
export async function updateUserSubscription(userId, customerId, subscriptionId, status, trialEndDate, currentPeriodEnd) {
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

// Helper function to find user by customer ID
export async function findUserByCustomerId(customerId) {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId);

  if (error) {
    throw error;
  }

  if (profiles && profiles.length > 0) {
    return profiles[0].id;
  } else {
    console.error(`No user found for customer ${customerId}`);
    return null;
  }
}
