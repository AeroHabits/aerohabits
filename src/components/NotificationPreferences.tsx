import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bell } from "lucide-react";

interface NotificationPreferencesProps {
  habitId: number;
}

export function NotificationPreferences({ habitId }: NotificationPreferencesProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  const { toast } = useToast();

  useEffect(() => {
    // Fetch existing notification preferences
    const fetchNotificationPreferences = async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) return;

      const { data: existingNotification } = await supabase
        .from('habit_notifications')
        .select()
        .eq('habit_id', habitId)
        .eq('user_id', session.session.user.id)
        .single();

      if (existingNotification) {
        setIsEnabled(existingNotification.is_enabled);
        setReminderTime(existingNotification.reminder_time);
      }
    };

    fetchNotificationPreferences();
  }, [habitId]);

  const handleToggleNotifications = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to manage notifications",
          variant: "destructive",
        });
        return;
      }

      const { data: existingNotification } = await supabase
        .from('habit_notifications')
        .select()
        .eq('habit_id', habitId)
        .eq('user_id', session.session.user.id)
        .single();

      if (existingNotification) {
        // Update existing notification
        const { error } = await supabase
          .from('habit_notifications')
          .update({ is_enabled: !isEnabled })
          .eq('id', existingNotification.id);

        if (error) throw error;
      } else {
        // Create new notification
        const { error } = await supabase
          .from('habit_notifications')
          .insert({
            habit_id: habitId,
            user_id: session.session.user.id,
            reminder_time: reminderTime,
            is_enabled: true
          });

        if (error) throw error;
      }

      setIsEnabled(!isEnabled);
      toast({
        title: "Success",
        description: `Notifications ${!isEnabled ? 'enabled' : 'disabled'} for this habit`,
      });
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive",
      });
    }
  };

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