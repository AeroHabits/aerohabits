
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SubscriptionProfile {
  is_subscribed: boolean | null;
  subscription_status: string | null;
}

export interface Receipt {
  id: string;
  user_id: string;
  transaction_id: string;
  product_id: string;
  purchase_date: string;
  expires_date?: string;
  is_verified: boolean;
  verified_at?: string;
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

  // Query to get user receipts
  const { 
    data: receipts,
    isLoading: receiptsLoading,
    refetch: refetchReceipts
  } = useQuery<Receipt[]>({
    queryKey: ['user-receipts'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) throw new Error('Not authenticated');
      
      const { data, error } = await supabase.functions.invoke('get-receipts', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });
      
      if (error) throw error;
      return data.receipts;
    },
    enabled: false // Don't fetch automatically, only when needed
  });

  // Function to validate a receipt with Apple
  const validateReceipt = async (receiptData: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) throw new Error('Not authenticated');
    
    const { data, error } = await supabase.functions.invoke('validate-receipt', {
      body: { receiptData },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    
    if (error) throw error;
    return data;
  };

  const isSubscribed = profile?.is_subscribed || false;
  const isActive = profile?.subscription_status === 'active';
  
  return {
    profile,
    isLoading,
    refetch,
    error,
    isSubscribed,
    isActive,
    receipts,
    receiptsLoading,
    loadReceipts: refetchReceipts,
    validateReceipt
  };
}
