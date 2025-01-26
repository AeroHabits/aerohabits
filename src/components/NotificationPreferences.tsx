import { Switch } from "@/components/ui/switch";
import { Bell } from "lucide-react";
import { useNotificationPreferences } from "@/hooks/useNotificationPreferences";

interface NotificationPreferencesProps {
  habitId: string;  // Changed from number to string to match UUID from Supabase
}

export function NotificationPreferences({ habitId }: NotificationPreferencesProps) {
  const { isEnabled, handleToggleNotifications } = useNotificationPreferences(habitId);

  return (
    <div className="flex items-center space-x-2">
      <Bell className="h-4 w-4 text-muted-foreground" />
      <Switch
        checked={isEnabled}
        onCheckedChange={handleToggleNotifications}
      />
      <span className="text-sm text-muted-foreground">
        Daily Reminder
      </span>
    </div>
  );
}