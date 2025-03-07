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
  return <div className="space-y-3">
      

      {isSubscribed && status === 'active' && currentPeriodEnd && <Alert className="bg-blue-900/20 border border-blue-500/30 backdrop-blur-sm rounded-xl">
          <Calendar className="h-5 w-5 text-blue-400" />
          <AlertDescription className="text-blue-200 text-base">
            Your next payment is on {getNextBillingDate()}
          </AlertDescription>
        </Alert>}
    </div>;
}