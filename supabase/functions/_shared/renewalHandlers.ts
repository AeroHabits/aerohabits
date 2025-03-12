
import { supabaseAdmin } from "./supabaseAdmin.ts";
import { updateUserSubscription, findUserByCustomerId } from "./webhookHandlerUtils.ts";

// Handle subscription renewal success events
export async function handleRenewalSucceeded(renewalData) {
  const userId = renewalData.userId;
  const transactionId = renewalData.transactionId;
  const productId = renewalData.productId;
  const purchaseDate = renewalData.purchaseDate;
  const expiresDate = renewalData.expiresDate;
  
  console.log(`Subscription renewed. Transaction: ${transactionId}, Product: ${productId}, User: ${userId}`);
  
  try {
    // Update the subscription with new expiration date
    const status = 'active';
    const currentPeriodEnd = expiresDate;
    
    if (userId) {
      await updateUserSubscription(userId, transactionId, productId, status, null, currentPeriodEnd);
    }
  } catch (error) {
    console.error("Error processing renewal success:", error);
    throw error;
  }
}

// Handle subscription renewal failure events
export async function handleRenewalFailed(renewalData) {
  const userId = renewalData.userId;
  const productId = renewalData.productId;
  
  console.log(`Subscription renewal failed. Product: ${productId}, User: ${userId}`);
  
  try {
    if (userId) {
      // Update user's subscription status to past_due
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
    console.error("Error processing renewal failure:", error);
    throw error;
  }
}
