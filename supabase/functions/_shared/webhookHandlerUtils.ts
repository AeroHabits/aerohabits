
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

export const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

export async function updateUserSubscription(
  userId, 
  customerId, 
  subscriptionId, 
  status, 
  trialEnd = null, 
  currentPeriodEnd = null
) {
  // Update user's subscription information in the database
  const is_subscribed = ['active', 'trialing'].includes(status);
  
  try {
    console.log(`Updating user ${userId} subscription: ${status}, subscribed: ${is_subscribed}`);
    
    const { error } = await supabaseAdmin
      .from('profiles')
      .update({
        app_store_subscription_id: subscriptionId,
        subscription_status: status,
        is_subscribed: is_subscribed,
        trial_end_date: trialEnd,
        current_period_end: currentPeriodEnd,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
      
    if (error) throw error;
    console.log(`Successfully updated user ${userId} subscription status`);
    return true;
  } catch (error) {
    console.error(`Error updating user ${userId} subscription:`, error);
    throw error;
  }
}

export async function findUserByCustomerId(customerId) {
  try {
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('app_store_customer_id', customerId)
      .single();
      
    if (error) throw error;
    return data?.id || null;
  } catch (error) {
    console.error(`Error finding user by customer ID ${customerId}:`, error);
    return null;
  }
}
