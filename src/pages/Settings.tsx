
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { SubscriptionCard } from "@/components/settings/SubscriptionCard";
import { NotificationsCard } from "@/components/settings/NotificationsCard";
import { LegalCard } from "@/components/settings/LegalCard";
import { PointsCard } from "@/components/settings/PointsCard";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true
  });
  const { toast } = useToast();

  const { data: subscription } = useQuery({
    queryKey: ['subscription'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('email_notifications, push_notifications')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setSettings({
        email_notifications: data.email_notifications ?? true,
        push_notifications: data.push_notifications ?? true
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (setting: 'email_notifications' | 'push_notifications', value: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ [setting]: value })
        .eq('id', user.id);

      if (error) throw error;

      setSettings(prev => ({ ...prev, [setting]: value }));
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      console.error('Error updating setting:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  const getSubscriptionStatus = () => {
    if (!subscription) return "No active subscription";
    
    if (subscription.status === 'trialing') {
      return "Free Trial";
    }
    
    if (subscription.status === 'active' && subscription.plan_type === 'premium') {
      return "Premium";
    }
    
    return "Free Plan";
  };

  const getSubscriptionDetails = () => {
    if (!subscription) return "Start your journey with our premium features";
    
    if (subscription.status === 'trialing') {
      const trialEnd = new Date(subscription.trial_end);
      return `Trial ends on ${trialEnd.toLocaleDateString()}`;
    }
    
    if (subscription.status === 'active' && subscription.plan_type === 'premium') {
      const periodEnd = new Date(subscription.current_period_end);
      return `Next billing date: ${periodEnd.toLocaleDateString()}`;
    }
    
    return "Upgrade to premium for exclusive features";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <SettingsHeader loading={loading} />
        
        <PointsCard />
        
        <SubscriptionCard 
          subscription={subscription}
          getSubscriptionStatus={getSubscriptionStatus}
          getSubscriptionDetails={getSubscriptionDetails}
        />

        <NotificationsCard 
          settings={settings}
          updateSetting={updateSetting}
        />

        <LegalCard />
      </div>
    </div>
  );
}
