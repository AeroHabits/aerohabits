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
  return <>
      <Card className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-white/10 relative overflow-hidden rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptLTJ6TTAgMGg2MHY2MEgweiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        {/* Premium effect with gradient blurs */}
        <motion.div className="absolute -top-32 -right-32 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl" animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2]
      }} transition={{
        duration: 5,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        
        <motion.div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" animate={{
        scale: [1, 1.2, 1],
        opacity: [0.2, 0.3, 0.2]
      }} transition={{
        duration: 6,
        delay: 1,
        repeat: Infinity,
        ease: "easeInOut"
      }} />
        
        <CardHeader className="border-b border-white/10 relative pt-8 pb-6">
          <div className="absolute -top-10 -right-10 w-20 h-20 bg-amber-400/10 rounded-full blur-xl" />
          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-indigo-200 flex items-center gap-3">
            <Sparkles className="h-7 w-7 text-amber-400" />
            Premium Membership
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8 pt-8 relative">
          <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/10">
            <Crown className="h-6 w-6 text-amber-400" />
            <h3 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Status: {getSubscriptionStatus()}
            </h3>
          </div>

          <SubscriptionStatus status={profile?.subscription_status} currentPeriodEnd={profile?.current_period_end} isSubscribed={!!profile?.is_subscribed} />

          <div className="space-y-4">
            
            
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl border border-indigo-500/20">
              <div className="p-2 rounded-full bg-indigo-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <p className="text-indigo-200 text-sm">
                Your payment is securely processed. We use industry-standard encryption to protect your financial information.
              </p>
            </div>
          </div>

          <SubscriptionActions isSubscribed={!!profile?.is_subscribed} isLoading={initialLoading || isLoading || profileLoading} isRestoring={isRestoring} handleSubscribe={onSubscribeClick} handleManageSubscription={onManageClick} handleRestorePurchases={handleRestorePurchases} />
          
          {/* Added Apple-specific subscription information for App Store compliance */}
          <AppleSubscriptionInfo />
        </CardContent>
      </Card>

      <AppStoreDialog isOpen={showAppStoreInfo} onOpenChange={setShowAppStoreInfo} isSubscribed={!!profile?.is_subscribed} />
    </>;
}