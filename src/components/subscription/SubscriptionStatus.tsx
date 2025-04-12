
import { Crown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubscriptionStatusProps {
  isSubscribed: boolean | null;
  status: string | null;
  isLoading: boolean;
}

export function SubscriptionStatus({ 
  isSubscribed, 
  status,
  isLoading 
}: SubscriptionStatusProps) {
  
  const getSubscriptionStatus = () => {
    if (isLoading) return 'Loading...';
    if (!isSubscribed) return 'Free Plan';
    
    if (status === 'active') return 'Premium Active';
    return status;
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Crown className="h-6 w-6 text-yellow-400 animate-glow" />
        <h3 className="text-lg font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
          Status: {getSubscriptionStatus()}
        </h3>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="font-bold bg-gradient-to-br from-white via-purple-200 to-purple-400 bg-clip-text text-transparent text-5xl">
          $9.99
        </span>
        <span className="text-gray-400 text-xl">/month</span>
      </div>
    </>
  );
}
