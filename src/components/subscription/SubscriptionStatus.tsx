
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SubscriptionStatusProps {
  status: string;
  currentPeriodEnd: string | null;
  isSubscribed: boolean;
}

export function SubscriptionStatus({ 
  status, 
  currentPeriodEnd, 
  isSubscribed 
}: SubscriptionStatusProps) {
  const getNextBillingDate = () => {
    if (!currentPeriodEnd) return null;
    return format(new Date(currentPeriodEnd), 'MMMM d, yyyy');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="font-bold bg-gradient-to-br from-white via-purple-200 to-purple-400 bg-clip-text text-transparent text-5xl">
          $9.99
        </span>
        <span className="text-gray-400 text-xl">/month</span>
      </div>

      {isSubscribed && status === 'active' && currentPeriodEnd && (
        <Alert className="bg-green-900/40 border border-green-500/30 backdrop-blur-sm">
          <Calendar className="h-5 w-5 text-green-400" />
          <AlertDescription className="text-white text-base">
            Your next payment is on {getNextBillingDate()}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
