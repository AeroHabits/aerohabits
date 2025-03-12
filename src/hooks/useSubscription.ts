
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionProfile {
  is_subscribed: boolean | null;
  subscription_status: string | null;
  current_period_end: string | null;
  app_store_subscription_id?: string | null;
}

export function useSubscription() {
  const { 
    data: profile,
    isLoading,
    refetch,
    error
  } = useQuery<SubscriptionProfile>({
    queryKey: ['subscription-profile'],
    queryFn: async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('is_subscribed, subscription_status, current_period_end, app_store_subscription_id')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data;
    }
  });

  const isSubscribed = profile?.is_subscribed || false;
  const isActive = profile?.subscription_status === 'active';
  
  return {
    profile,
    isLoading,
    refetch,
    error,
    isSubscribed,
    isActive
  };
}
