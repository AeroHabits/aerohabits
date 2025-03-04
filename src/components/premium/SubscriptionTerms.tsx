
import { Info, CreditCard, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Link } from "react-router-dom";

export function SubscriptionTerms() {
  return (
    <div className="space-y-4">
      <Alert className="bg-gray-900/80 border border-gray-700 backdrop-blur-sm">
        <Info className="h-4 w-4 text-blue-400" />
        <AlertTitle className="text-white">Subscription Terms</AlertTitle>
        <AlertDescription className="text-gray-300 text-sm mt-2 space-y-3">
          <p>AeroHabits Premium is a $9.99 USD monthly subscription with a 3-day free trial.</p>
          
          <div className="flex items-start gap-2 mt-2">
            <CreditCard className="h-4 w-4 text-blue-400 mt-1 flex-shrink-0" />
            <p>Your subscription will automatically renew at the end of each period unless canceled at least 24 hours before the end of the current period.</p>
          </div>
          
          <div className="bg-black/30 p-3 rounded-md border border-gray-700 mt-2">
            <h4 className="font-medium text-white mb-2">Your subscription includes:</h4>
            <ul className="space-y-1.5">
              {[
                "Premium features and advanced tracking",
                "Custom challenges and personalized content",
                "Priority support and exclusive updates",
                "Automatic renewal unless canceled",
                "Manage subscription through App Store settings"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-3.5 w-3.5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="pt-2">
            <p className="text-xs text-gray-400 mb-1.5">
              By subscribing, you agree to our <Link to="/terms" className="text-blue-400 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-400 hover:underline">Privacy Policy</Link>.
            </p>
            <p className="text-xs text-gray-400">
              Subscription automatically renews unless auto-renew is turned off at least 24 hours before the end of the current period. Account will be charged for renewal within 24 hours prior to the end of the current period. Manage or cancel your subscription in your App Store account settings.
            </p>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}
