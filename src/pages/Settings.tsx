
import { useProfileLoader } from "@/components/layout/ProfileLoader";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { NotificationsCard } from "@/components/settings/NotificationsCard";
import { LegalCard } from "@/components/settings/LegalCard";
import { SubscriptionInfoCard } from "@/components/settings/SubscriptionInfoCard";
import { DangerZoneCard } from "@/components/settings/DangerZoneCard";
import { AppHeader } from "@/components/layout/AppHeader";
import { useUserSettings } from "@/hooks/useUserSettings";

export default function Settings() {
  const { loading, settings, updateSetting } = useUserSettings();
  
  // We're still using the ProfileLoader's query for additional user data
  const { data: profile } = useProfileLoader();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container max-w-2xl mx-auto px-4 pt-safe py-8">
        <AppHeader />
        
        <SettingsHeader loading={loading} />
        
        <SubscriptionInfoCard />
        
        <NotificationsCard 
          settings={settings}
          updateSetting={updateSetting}
        />
        
        <LegalCard />

        <DangerZoneCard />
      </div>
    </div>
  );
}
