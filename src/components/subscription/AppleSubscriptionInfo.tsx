
import { Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function AppleSubscriptionInfo() {
  return (
    <Alert className="bg-gray-900/80 border border-gray-700 mt-4 backdrop-blur-sm">
      <Info className="h-4 w-4 text-blue-400" />
      <AlertTitle className="text-white">Subscription Information</AlertTitle>
      <AlertDescription className="text-gray-300 text-sm mt-2">
        <ul className="list-disc pl-5 space-y-1">
          <li>Payment will be charged to your Apple ID account at confirmation of purchase.</li>
          <li>Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period.</li>
          <li>Your account will be charged for renewal within 24 hours prior to the end of the current period.</li>
          <li>You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase.</li>
          <li>The 3-day free trial automatically converts to a paid subscription unless canceled before the trial period ends.</li>
        </ul>
      </AlertDescription>
    </Alert>
  );
}
