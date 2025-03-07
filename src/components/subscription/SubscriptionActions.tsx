
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
    <div className="space-y-5">
      {isSubscribed ? (
        <Button
          onClick={handleManageSubscription}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-6 text-lg relative overflow-hidden group rounded-xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
          {isLoading ? "Loading..." : "Manage Subscription"}
        </Button>
      ) : (
        <Button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium py-6 text-lg relative overflow-hidden group transition-all duration-300 hover:scale-[1.01] rounded-xl shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] animate-shimmer" />
          {isLoading ? "Loading..." : "Start 3-Day Free Trial"}
        </Button>
      )}
      
      {/* Add Restore Purchases button - Apple requirement */}
      <Button
        onClick={handleRestorePurchases}
        disabled={isRestoring}
        variant="outline"
        className="w-full font-medium text-gray-400 hover:text-gray-200 border border-gray-700 py-5 rounded-xl bg-transparent hover:bg-gray-800/50"
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRestoring ? 'animate-spin' : ''}`} />
        {isRestoring ? "Restoring..." : "Restore Purchases"}
      </Button>
    </div>
  );
}
