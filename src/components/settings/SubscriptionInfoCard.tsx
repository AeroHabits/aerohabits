
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SubscriptionInfoCard() {
  const { isLoading, profile, isSubscribed } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubscribe = async () => {
    try {
      setIsProcessing(true);
      
      toast.info("Subscription feature is currently unavailable");
      // This will be replaced with the Apple in-app purchase flow later
    } catch (error) {
      console.error('Error starting subscription:', error);
      toast.error('Failed to start subscription. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleManageSubscription = async () => {
    try {
      setIsProcessing(true);
      
      toast.info("Please contact support to manage your subscription");
      // This will be replaced with the Apple subscription management flow later
    } catch (error) {
      console.error('Error opening subscription management:', error);
      toast.error('Failed to open subscription management. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden mb-6">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-lg font-medium text-white flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-400" />
          {isSubscribed ? "Premium Subscription" : "Subscription Info"}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {!isLoading && (
          <>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="font-bold text-white text-3xl">$6.99</span>
              <span className="text-gray-300 text-lg">/month</span>
            </div>

            <p className="text-sm text-gray-300 mb-4">
              {isSubscribed 
                ? "You currently have full access to all premium features."
                : "Subscribe to unlock all premium features and get full access to the entire app."}
            </p>

            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-200">What you'll get:</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  Full access to all premium challenges
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  Detailed analytics and insights
                </li>
                <li className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  Unlimited habit tracking
                </li>
              </ul>
            </div>

            <Separator className="my-4 bg-white/10" />

            {isSubscribed ? (
              <>
                <div className="text-xs text-gray-400 mb-4">
                  <p>Subscription status: <span className="text-green-400">{profile?.subscription_status || 'Active'}</span></p>
                </div>
                <Button
                  onClick={handleManageSubscription}
                  disabled={isProcessing}
                  variant="premium"
                  className="w-full font-medium"
                >
                  {isProcessing ? "Processing..." : "Manage Subscription"}
                </Button>
              </>
            ) : (
              <>
                <p className="text-xs text-gray-400 italic mb-4">
                  Coming soon: Subscribe directly through Apple for a seamless experience.
                </p>
                <Button
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  variant="premium"
                  className="w-full font-medium shadow-lg"
                >
                  {isProcessing ? "Processing..." : "Subscribe Now"}
                </Button>
              </>
            )}
          </>
        )}
        
        {isLoading && (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-white/10 rounded-md w-1/3"></div>
            <div className="h-4 bg-white/10 rounded-md w-full"></div>
            <div className="h-4 bg-white/10 rounded-md w-5/6"></div>
            <div className="space-y-2">
              <div className="h-4 bg-white/10 rounded-md w-2/3"></div>
              <div className="h-4 bg-white/10 rounded-md w-3/4"></div>
              <div className="h-4 bg-white/10 rounded-md w-1/2"></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
