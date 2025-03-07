
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
    <div className="space-y-3">
      <div className="flex items-baseline gap-3 bg-gradient-to-br from-blue-900 to-indigo-900 p-5 rounded-xl border border-indigo-500/20 shadow-lg">
        <span className="font-bold bg-gradient-to-br from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent text-6xl">
          $9.99
        </span>
        <div className="flex flex-col">
          <span className="text-blue-200 text-xl">/month</span>
          <span className="text-blue-300 text-sm">after free trial</span>
        </div>
      </div>

      {isSubscribed && status === 'active' && currentPeriodEnd && (
        <Alert className="bg-blue-900/20 border border-blue-500/30 backdrop-blur-sm rounded-xl">
          <Calendar className="h-5 w-5 text-blue-400" />
          <AlertDescription className="text-blue-200 text-base">
            Your next payment is on {getNextBillingDate()}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
