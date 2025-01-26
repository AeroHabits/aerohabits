import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useNotificationPreferences(habitId: string) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("09:00");
  const { toast } = useToast();

  useEffect(() => {
    fetchNotificationPreferences();
  }, [habitId]);

  const fetchNotificationPreferences = async () => {
    const { data: session } = await supabase.auth.getSession();
    if (!session?.session?.user) return;

    const { data: existingNotification } = await supabase
      .from('habit_notifications')
      .select()
      .eq('habit_id', habitId)
      .eq('user_id', session.session.user.id)
      .maybeSingle();

    if (existingNotification) {
      setIsEnabled(existingNotification.is_enabled);
      setReminderTime(existingNotification.reminder_time);
    }
  };

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
        .maybeSingle();

      if (existingNotification) {
        const { error } = await supabase
          .from('habit_notifications')
          .update({ is_enabled: !isEnabled })
          .eq('id', existingNotification.id);

        if (error) throw error;
      } else {
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

  return {
    isEnabled,
    reminderTime,
    handleToggleNotifications
  };
}