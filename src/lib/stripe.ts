
import { supabase } from "@/integrations/supabase/client";

export async function createCheckoutSession(priceId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    console.log('Creating checkout session for user:', user.id, 'price:', priceId);

    const { data, error } = await supabase.functions.invoke('stripe', {
      body: { price_id: priceId, user_id: user.id }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }
    
    if (!data?.sessionId) {
      console.error('No session ID returned:', data);
      throw new Error('Invalid checkout session');
    }

    console.log('Checkout session created:', data.sessionId);
    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}
