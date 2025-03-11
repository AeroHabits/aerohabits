
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useSubscriptionLogic } from "@/hooks/useSubscriptionLogic";
import { AppStoreDialog } from "../subscription/AppStoreDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function SubscribeButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { 
    profile, 
    isProfileLoading, 
    hasActiveSubscription, 
    isIOS,
    handleSubscribe, 
    handleManageSubscription 
  } = useSubscriptionLogic(setIsLoading);
  
  const [showAppStoreInfo, setShowAppStoreInfo] = useState(false);

  const handleSubscribeClick = async () => {
    // For iOS devices, show App Store instructions
    if (isIOS) {
      setShowAppStoreInfo(true);
      return;
    }
    
    await handleSubscribe();
  };

  const handleManageClick = async () => {
    // For iOS devices, show App Store instructions
    if (isIOS) {
      setShowAppStoreInfo(true);
      return;
    }
    
    await handleManageSubscription();
  };

  return (
    <>
      <div className="mb-2">
        <Button
          onClick={hasActiveSubscription ? handleManageClick : handleSubscribeClick}
          disabled={isLoading || isProfileLoading}
          className="w-full py-6 text-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          {isLoading ? (
            "Processing..."
          ) : hasActiveSubscription ? (
            "Manage Subscription"
          ) : (
            "Start 3-Day Free Trial"
          )}
        </Button>
        
        {!hasActiveSubscription && (
          <div className="mt-2 text-center space-y-1">
            <p className="text-sm text-gray-300">
              $9.99/month after 3-day free trial
            </p>
            <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
              <span>Auto-renews unless canceled.</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p>Your Apple ID will be charged at the end of the trial period unless canceled at least 24 hours before the end of the trial. Subscription automatically renews unless auto-renew is turned off.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        )}
      </div>
      
      <AppStoreDialog 
        isOpen={showAppStoreInfo} 
        onOpenChange={setShowAppStoreInfo} 
        isSubscribed={hasActiveSubscription} 
      />
    </>
  );
}
