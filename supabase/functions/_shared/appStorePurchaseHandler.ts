
import { updateUserSubscription, findUserByCustomerId } from "./webhookHandlerUtils.ts";

// Handle purchase completion events from App Store
export async function handlePurchaseComplete(purchaseData) {
  const userId = purchaseData.userId;
  const transactionId = purchaseData.transactionId;
  const productId = purchaseData.productId;
  const purchaseDate = purchaseData.purchaseDate;
  const expiresDate = purchaseData.expiresDate;
  
  console.log(`Purchase completed. Transaction: ${transactionId}, Product: ${productId}, User: ${userId}`);
  
  try {
    // Set subscription status to active
    const status = 'active';
    const isTrialing = false;
    const trialEnd = null;
    const currentPeriodEnd = expiresDate;
    
    if (userId) {
      await updateUserSubscription(userId, transactionId, productId, status, trialEnd, currentPeriodEnd);
    } else {
      console.error("No user ID provided with purchase event");
    }
  } catch (error) {
    console.error("Error processing purchase completion:", error);
    throw error;
  }
}
