
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SubscriptionActionsProps {
  isSubscribed: boolean;
  isLoading: boolean;
  isRestoring: boolean;
  handleSubscribe: () => void;
  handleManageSubscription: () => void;
  handleRestorePurchases: () => void;
}

export function SubscriptionActions({
  isSubscribed,
  isLoading,
  isRestoring,
  handleSubscribe,
  handleManageSubscription,
  handleRestorePurchases
}: SubscriptionActionsProps) {
  return (
    <div className="space-y-4">
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
          {isLoading ? "Loading..." : "Start 3-Day Free Trial"}
        </Button>
      )}
      
      {/* Add Restore Purchases button - Apple requirement */}
      <Button
        onClick={handleRestorePurchases}
        disabled={isRestoring}
        variant="ghost"
        className="w-full font-medium text-gray-400 hover:text-gray-200 border border-gray-700/50 py-4"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRestoring ? 'animate-spin' : ''}`} />
        {isRestoring ? "Restoring..." : "Restore Purchases"}
      </Button>
    </div>
  );
}
