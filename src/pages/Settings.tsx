
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PointsGuide } from "@/components/badges/PointsGuide";

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-white">Settings</h1>
        
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Points Guide</CardTitle>
            <CardDescription className="text-gray-300">Learn how to earn and spend points</CardDescription>
          </CardHeader>
          <CardContent>
            <PointsGuide />
          </CardContent>
        </Card>

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

        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Notifications</CardTitle>
            <CardDescription className="text-gray-300">Manage how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-notifications" className="flex flex-col">
                <span className="font-medium text-white">Email Notifications</span>
                <span className="text-sm text-gray-300">
                  Receive notifications about your progress via email
                </span>
              </Label>
              <Switch
                id="email-notifications"
                checked={settings.email_notifications}
                onCheckedChange={(checked) => updateSetting('email_notifications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="push-notifications" className="flex flex-col">
                <span className="font-medium text-white">Push Notifications</span>
                <span className="text-sm text-gray-300">
                  Receive push notifications about your progress
                </span>
              </Label>
              <Switch
                id="push-notifications"
                checked={settings.push_notifications}
                onCheckedChange={(checked) => updateSetting('push_notifications', checked)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Legal</CardTitle>
            <CardDescription className="text-gray-300">Review our legal documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Link to="/terms" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">Terms of Service</Link>
              <Link to="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">Privacy Policy</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
