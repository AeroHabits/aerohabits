
import { Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SubscriptionCardProps {
  subscription: any;
  getSubscriptionStatus: () => string;
  getSubscriptionDetails: () => string;
}

export function SubscriptionCard({ subscription, getSubscriptionStatus, getSubscriptionDetails }: SubscriptionCardProps) {
  return (
    <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Subscription</CardTitle>
        <CardDescription className="text-gray-300">Manage your subscription plan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-400" />
              <h3 className="font-medium text-white">{getSubscriptionStatus()}</h3>
            </div>
            <p className="text-sm text-gray-300">{getSubscriptionDetails()}</p>
          </div>
          <Link
            to="/pricing"
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            {subscription?.status === 'active' ? 'Manage Plan' : 'Upgrade'}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
