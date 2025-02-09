
import { supabase } from "@/integrations/supabase/client";

export async function createCheckoutSession(priceId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    const response = await supabase.functions.invoke('stripe', {
      body: {
        price_id: priceId,
        user_id: user.id
      }
    });

    if (response.error) {
      throw new Error(response.error.message || 'Failed to create checkout session');
    }

    if (!response.data?.sessionId) {
      throw new Error('Invalid checkout session response');
    }

    return response.data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}
