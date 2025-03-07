
import { Sparkles, Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { AppleSubscriptionInfo } from "./AppleSubscriptionInfo";
import { SubscriptionStatus } from "./SubscriptionStatus";
import { SubscriptionActions } from "./SubscriptionActions";
import { AppStoreDialog } from "./AppStoreDialog";
import { useSubscription } from "@/hooks/useSubscription";

interface SubscriptionCardProps {
  isLoading?: boolean;
}

export function SubscriptionCard({
  isLoading: initialLoading
}: SubscriptionCardProps) {
  const [showAppStoreInfo, setShowAppStoreInfo] = useState(false);
  
  const {
    profile,
    isLoading,
    isRestoring,
    profileLoading,
    getSubscriptionStatus,
    handleSubscribe,
    handleManageSubscription,
    handleRestorePurchases
  } = useSubscription();

  const onSubscribeClick = async () => {
    const shouldShowAppStore = await handleSubscribe();
    setShowAppStoreInfo(shouldShowAppStore);
  };

  const onManageClick = async () => {
    const shouldShowAppStore = await handleManageSubscription();
    setShowAppStoreInfo(shouldShowAppStore);
  };

  return (
    <>
      <Card className="bg-gradient-to-br from-gray-800 via-gray-900 to-black border-gray-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]" />
        <motion.div 
          className="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl" 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }} 
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <CardHeader className="border-b border-gray-700/50 relative">
          <CardTitle className="text-2xl font-normal text-white flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
            AeroHabits Premium
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-6 relative">
          <div className="flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-400 animate-glow" />
            <h3 className="text-lg font-normal bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Status: {getSubscriptionStatus()}
            </h3>
          </div>

          <SubscriptionStatus 
            status={profile?.subscription_status} 
            currentPeriodEnd={profile?.current_period_end}
            isSubscribed={!!profile?.is_subscribed}
          />

          <p className="text-gray-400 text-lg leading-relaxed">
            {profile?.is_subscribed 
              ? "Manage your subscription, view payment history, and update payment methods."
              : "Start your 3-day free trial today. Your card will be charged automatically after the trial period."
            }
          </p>

          <SubscriptionActions 
            isSubscribed={!!profile?.is_subscribed}
            isLoading={initialLoading || isLoading || profileLoading}
            isRestoring={isRestoring}
            handleSubscribe={onSubscribeClick}
            handleManageSubscription={onManageClick}
            handleRestorePurchases={handleRestorePurchases}
          />
          
          {/* Added Apple-specific subscription information for App Store compliance */}
          <AppleSubscriptionInfo />
        </CardContent>
      </Card>

      <AppStoreDialog 
        isOpen={showAppStoreInfo} 
        onOpenChange={setShowAppStoreInfo}
        isSubscribed={!!profile?.is_subscribed}
      />
    </>
  );
}
