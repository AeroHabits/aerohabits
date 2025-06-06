
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useCallback } from "react";
import { SubscriptionStatus } from "./SubscriptionStatus";
import { SubscriptionActions } from "./SubscriptionActions";
import { useSubscription } from "@/hooks/useSubscription";
import { syncSubscriptionStatus } from "@/utils/subscription/syncSubscription";

interface SubscriptionCardProps {
  isLoading?: boolean;
}

export function SubscriptionCard({
  isLoading: externalLoading
}: SubscriptionCardProps) {
  const [isLoadingState, setIsLoadingState] = useState(false);
  const { profile, isLoading: profileLoading, refetch } = useSubscription();

  const handleSyncSubscription = useCallback(() => {
    syncSubscriptionStatus(refetch, setIsLoadingState);
  }, [refetch]);

  const isLoading = externalLoading || isLoadingState || profileLoading;

  return (
    <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
      <CardHeader className="border-b border-gray-700/50 relative">
        <CardTitle className="text-2xl font-normal text-white flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-yellow-400" />
          Premium Membership
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6 relative">
        <SubscriptionStatus 
          isSubscribed={profile?.is_subscribed}
          status={profile?.subscription_status}
          isLoading={isLoading}
        />

        <p className="text-gray-400 text-lg leading-relaxed">
          {profile?.is_subscribed 
            ? "Manage your subscription, view payment history, and update payment methods."
            : "Subscribe now to unlock all premium features and take control of your habits."
          }
        </p>

        <SubscriptionActions 
          isSubscribed={profile?.is_subscribed}
          isLoading={isLoading}
          setIsLoading={setIsLoadingState}
        />
      </CardContent>
    </Card>
  );
}
