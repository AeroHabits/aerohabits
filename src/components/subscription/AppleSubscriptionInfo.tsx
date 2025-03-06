
import { Info, Shield, CreditCard, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

export function AppleSubscriptionInfo() {
  return (
    <Alert className="bg-gray-900/80 border border-gray-700 mt-4 backdrop-blur-sm">
      <Info className="h-4 w-4 text-blue-400" />
      <AlertTitle className="text-white">Subscription Information</AlertTitle>
      <AlertDescription className="text-gray-300 space-y-4 mt-2">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-blue-400" />
            <p className="font-medium">$9.99 per month after 3-day free trial</p>
          </div>
          <p className="text-sm">
            Your Apple ID account will be charged at confirmation of purchase and will automatically renew at the same price unless you cancel at least 24 hours before the end of the current period.
          </p>
        </div>
        
        <ul className="list-disc pl-5 space-y-2 text-sm">
          <li>Payment will be charged to your Apple ID account at confirmation of purchase.</li>
          <li>Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period.</li>
          <li>Your account will be charged for renewal within 24 hours prior to the end of the current period.</li>
          <li>You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase.</li>
          <li>The 3-day free trial automatically converts to a paid subscription unless canceled before the trial period ends.</li>
        </ul>
        
        <div className="flex items-start gap-2 bg-black/20 p-3 rounded-md border border-gray-700">
          <Shield className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-gray-200 mb-1">Cancel Anytime</p>
            <p className="text-gray-400">
              You can cancel your subscription at any time by going to your Apple ID account settings. Visit Apple's{" "}
              <a href="https://support.apple.com/billing" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                support website
              </a>{" "}
              for more information on managing subscriptions.
            </p>
          </div>
        </div>
        
        {/* Add secure receipt validation information - Apple requirement */}
        <div className="flex items-start gap-2 bg-black/20 p-3 rounded-md border border-gray-700">
          <Lock className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-gray-200 mb-1">Secure Transaction</p>
            <p className="text-gray-400">
              All transactions are securely processed through Apple's App Store. 
              AeroHabits uses secure receipt validation to verify your subscription status.
              Your payment information is never stored on our servers.
            </p>
          </div>
        </div>
        
        <p className="text-xs text-gray-400 pt-2">
          By subscribing, you agree to our{" "}
          <Link to="/terms" className="text-blue-400 hover:underline">Terms of Service</Link> and{" "}
          <Link to="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
        </p>
      </AlertDescription>
    </Alert>
  );
}
