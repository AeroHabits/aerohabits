
import { useProfileLoader } from "@/components/layout/ProfileLoader";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { NotificationsCard } from "@/components/settings/NotificationsCard";
import { LegalCard } from "@/components/settings/LegalCard";
import { SubscriptionInfoCard } from "@/components/settings/SubscriptionInfoCard";
import { DangerZoneCard } from "@/components/settings/DangerZoneCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { UserMenu } from "@/components/UserMenu";
import { useUserSettings } from "@/hooks/useUserSettings";

export default function Settings() {
  const { loading, settings, updateSetting } = useUserSettings();
  
  // We're still using the ProfileLoader's query for additional user data
  const { data: profile } = useProfileLoader();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container max-w-2xl mx-auto px-4 pt-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <PageHeader />
          <UserMenu />
        </div>
        
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
