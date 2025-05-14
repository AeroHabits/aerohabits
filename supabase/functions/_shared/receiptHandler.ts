
import { supabaseAdmin } from "./supabaseAdmin.ts";

/**
 * Stores receipt data in the database when a user makes a purchase
 */
export async function storeReceipt(
  userId: string,
  transactionId: string,
  receiptData: string,
  productId: string,
  purchaseDate: string,
  expiresDate?: string
) {
  try {
    console.log(`Storing receipt for user ${userId}, transaction ${transactionId}`);
    
    // Store the receipt data in the database
    const { error } = await supabaseAdmin
      .from('user_receipts')
      .insert({
        user_id: userId,
        transaction_id: transactionId,
        receipt_data: receiptData,
        product_id: productId,
        purchase_date: purchaseDate,
        expires_date: expiresDate,
        is_verified: false // Will be marked as verified after validation
      });
      
    if (error) throw error;
    
    console.log(`Receipt stored successfully for transaction ${transactionId}`);
    return true;
  } catch (error) {
    console.error("Error storing receipt:", error);
    throw error;
  }
}

/**
 * Validates receipt with Apple servers and updates database accordingly
 */
export async function validateReceipt(receiptData: string, userId: string) {
  try {
    // Get the appropriate verification endpoint based on environment
    const verifyEndpoint = Deno.env.get("APP_ENV") === "production"
      ? "https://buy.itunes.apple.com/verifyReceipt"
      : "https://sandbox.itunes.apple.com/verifyReceipt";
      
    const appleSharedSecret = Deno.env.get("APPLE_SHARED_SECRET");
    
    if (!appleSharedSecret) {
      throw new Error("Apple shared secret not configured");
    }

    // Send the receipt to Apple for verification
    const response = await fetch(verifyEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "receipt-data": receiptData,
        "password": appleSharedSecret
      })
    });

    const result = await response.json();
    
    // Check the status from Apple's response
    if (result.status === 0) {
      // Get the latest receipt info
      const latestReceiptInfo = Array.isArray(result.latest_receipt_info) 
        ? result.latest_receipt_info[0] // Latest receipt is first in array
        : result.latest_receipt_info;
        
      // Extract transaction details from the verified receipt
      const transactionId = latestReceiptInfo?.transaction_id;
      const productId = latestReceiptInfo?.product_id;
      
      // Update the receipt in the database as verified
      if (transactionId) {
        await supabaseAdmin
          .from('user_receipts')
          .update({
            is_verified: true,
            verification_response: result,
            verified_at: new Date().toISOString()
          })
          .eq('transaction_id', transactionId)
          .eq('user_id', userId);
      }
      
      return {
        valid: true,
        data: result,
        transactionId,
        productId
      };
    } 
    
    // If status is not 0, receipt is invalid
    console.error(`Receipt validation failed with status: ${result.status}`);
    return {
      valid: false,
      data: result
    };
  } catch (error) {
    console.error("Error validating receipt with Apple:", error);
    throw error;
  }
}

/**
 * Gets receipt information from the database
 */
export async function getReceiptByTransactionId(transactionId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_receipts')
      .select('*')
      .eq('transaction_id', transactionId)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error retrieving receipt:", error);
    throw error;
  }
}

/**
 * Gets all receipts for a user
 */
export async function getUserReceipts(userId: string) {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_receipts')
      .select('*')
      .eq('user_id', userId)
      .order('purchase_date', { ascending: false });
      
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error retrieving user receipts:", error);
    throw error;
  }
}
