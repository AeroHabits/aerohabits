
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationsCardProps {
  settings: {
    email_notifications: boolean;
    push_notifications: boolean;
  };
  updateSetting: (setting: 'email_notifications' | 'push_notifications', value: boolean) => Promise<void>;
}

export function NotificationsCard({ settings, updateSetting }: NotificationsCardProps) {
  return (
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
  );
}
