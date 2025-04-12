
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface SubscriptionActionsProps {
  isSubscribed: boolean | null;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export function SubscriptionActions({ 
  isSubscribed, 
  isLoading, 
  setIsLoading 
}: SubscriptionActionsProps) {
  
  const handleSubscribe = async () => {
    try {
      setIsLoading(true);
      
      toast.info("Subscription feature is currently unavailable");
    } catch (error) {
      console.error('Error starting subscription:', error);
      toast.error('Failed to start subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);
      
      toast.info("Please contact support to manage your subscription");
    } catch (error) {
      console.error('Error opening subscription management:', error);
      toast.error('Failed to open subscription management. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isSubscribed ? (
        <Button
          onClick={handleManageSubscription}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 text-lg relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/20 to-blue-400/0 translate-x-[-100%] animate-shimmer" />
          {isLoading ? "Loading..." : "Manage Subscription"}
        </Button>
      ) : (
        <Button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium py-6 text-lg relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] animate-shimmer" />
          {isLoading ? "Loading..." : "Subscribe Now"}
        </Button>
      )}
    </>
  );
}
