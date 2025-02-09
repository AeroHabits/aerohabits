
import { supabase } from "@/integrations/supabase/client";
import { loadStripe } from "@/lib/loadStripe";

export async function createCheckoutSession(priceId: string) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User must be authenticated');

    const { data, error } = await supabase.functions.invoke('stripe', {
      body: { price_id: priceId, user_id: user.id }
    });

    if (error) throw error;
    if (!data?.sessionId) throw new Error('No session ID returned');

    return data;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}
