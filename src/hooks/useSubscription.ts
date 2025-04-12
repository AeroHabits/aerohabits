
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionProfile {
  is_subscribed: boolean | null;
  subscription_status: string | null;
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
      
      // Query the database for subscription fields
      const { data, error } = await supabase
        .from('profiles')
        .select('is_subscribed, subscription_status')
        .eq('id', user.id)
        .single();
        
      if (error) throw error;
      return data as SubscriptionProfile;
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
