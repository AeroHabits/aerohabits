
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true
  });
  const { toast } = useToast();

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage how you receive notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex flex-col">
              <span className="font-medium">Email Notifications</span>
              <span className="text-sm text-muted-foreground">
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
              <span className="font-medium">Push Notifications</span>
              <span className="text-sm text-muted-foreground">
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
    </div>
  );
}
