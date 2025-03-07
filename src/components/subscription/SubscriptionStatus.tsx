
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
      <div className="flex items-baseline gap-3 bg-gradient-to-br from-gray-900 to-black p-5 rounded-xl border border-white/10">
        <span className="font-bold bg-gradient-to-br from-white via-violet-200 to-indigo-200 bg-clip-text text-transparent text-6xl">
          $9.99
        </span>
        <div className="flex flex-col">
          <span className="text-gray-400 text-xl">/month</span>
          <span className="text-gray-500 text-sm">after free trial</span>
        </div>
      </div>

      {isSubscribed && status === 'active' && currentPeriodEnd && (
        <Alert className="bg-green-900/20 border border-green-500/30 backdrop-blur-sm rounded-xl">
          <Calendar className="h-5 w-5 text-green-400" />
          <AlertDescription className="text-green-200 text-base">
            Your next payment is on {getNextBillingDate()}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
