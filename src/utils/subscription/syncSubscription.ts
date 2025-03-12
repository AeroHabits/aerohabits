
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const syncSubscriptionStatus = async (
  refetchFn: () => Promise<any>,
  setLoading: (isLoading: boolean) => void
): Promise<void> => {
  try {
    setLoading(true);
    toast.info("Checking subscription status...");
    
    const { data, error } = await supabase.functions.invoke('sync-subscription', {
      body: {}
    });
    
    if (error) throw error;
    
    await refetchFn();
    
    if (data?.updated) {
      toast.success("Subscription status updated successfully");
      if (data?.status === 'active') {
        toast.success("Your subscription is now active! Thank you for subscribing.");
      }
    } else {
      toast.info("No changes to subscription status");
    }
  } catch (error) {
    console.error('Error syncing subscription:', error);
    toast.error('Failed to sync subscription status. Please try again.');
  } finally {
    setLoading(false);
  }
};
