import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { SettingsHeader } from "@/components/settings/SettingsHeader";
import { NotificationsCard } from "@/components/settings/NotificationsCard";
import { LegalCard } from "@/components/settings/LegalCard";
import { SubscriptionInfoCard } from "@/components/settings/SubscriptionInfoCard";
import { PageHeader } from "@/components/layout/PageHeader";
import { UserMenu } from "@/components/UserMenu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function Settings() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    email_notifications: true,
    push_notifications: true
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

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

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        });
        return;
      }

      // Delete user data from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Delete the user's auth account
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      // Sign out the user
      await supabase.auth.signOut();

      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted",
      });

      // Redirect to the home page
      navigate("/");
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <PageHeader />
          <UserMenu />
        </div>
        
        <SettingsHeader loading={loading} />
        
        {/* Add the SubscriptionInfoCard component here */}
        <SubscriptionInfoCard />
        
        <NotificationsCard 
          settings={settings}
          updateSetting={updateSetting}
        />
        <LegalCard />

        {/* Delete Account Section */}
        <div className="mt-8">
          <div className="bg-red-900/20 backdrop-blur-sm border border-red-800/30 rounded-lg p-4">
            <h3 className="text-red-400 text-lg font-medium mb-2">Danger Zone</h3>
            <p className="text-white/70 mb-4 text-sm">
              Deleting your account is permanent and cannot be undone. All your data will be permanently removed.
            </p>
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
              className="flex items-center gap-2"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </Button>
          </div>
        </div>

        {/* Delete Account Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent className="bg-gray-900 border-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-300">
                This action cannot be undone. This will permanently delete your account and remove all of your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700 border-gray-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteAccount}
                className="bg-red-600 text-white hover:bg-red-700"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
