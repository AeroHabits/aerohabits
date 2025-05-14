
import { updateUserSubscription, findUserByCustomerId } from "./webhookHandlerUtils.ts";
import { storeReceipt, validateReceipt } from "./receiptHandler.ts";

// Handle purchase completion events from App Store
export async function handlePurchaseComplete(purchaseData) {
  const userId = purchaseData.userId;
  const transactionId = purchaseData.transactionId;
  const productId = purchaseData.productId;
  const purchaseDate = purchaseData.purchaseDate;
  const expiresDate = purchaseData.expiresDate;
  const receiptData = purchaseData.receiptData; // Receipt data from Apple
  
  console.log(`Purchase completed. Transaction: ${transactionId}, Product: ${productId}, User: ${userId}`);
  
  try {
    // Store receipt in database
    if (receiptData) {
      await storeReceipt(
        userId, 
        transactionId, 
        receiptData, 
        productId,
        purchaseDate,
        expiresDate
      );
      
      // Validate receipt with Apple
      const validationResult = await validateReceipt(receiptData, userId);
      
      if (!validationResult.valid) {
        console.warn(`Receipt validation failed for transaction ${transactionId}`);
      }
    }
    
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
