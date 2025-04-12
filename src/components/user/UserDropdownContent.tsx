
import { User } from "@supabase/supabase-js";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserProfile } from "../UserProfile";
import { Crown, Settings, LogOut, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserDropdownContentProps {
  user: User;
  profile: { 
    full_name: string; 
    avatar_url: string | null;
    total_points: number;
  } | null;
  setProfile: React.Dispatch<React.SetStateAction<{
    full_name: string;
    avatar_url: string | null;
    total_points: number;
  } | null>>;
  onSignOut: () => Promise<void>;
}

export function UserDropdownContent({ 
  user, 
  profile, 
  setProfile, 
  onSignOut 
}: UserDropdownContentProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      // Delete user data from profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);
      
      if (profileError) throw profileError;
      
      // Delete the user's authentication data
      const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
      
      if (authError) throw authError;
      
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      
      // Sign out the user
      await onSignOut();
      navigate('/auth');
    } catch (error: any) {
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
    <>
      <DropdownMenuContent 
        className="w-56 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl p-1 dark:bg-gray-900/95 dark:border-gray-800" 
        align="end"
      >
        <DropdownMenuLabel className="px-2 py-1.5">
          <UserProfile 
            user={user}
            profile={profile}
            setProfile={setProfile}
          />
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md m-1 px-2 py-1.5 transition-colors duration-200"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-md m-1 px-2 py-1.5 transition-colors duration-200 font-medium text-blue-600 dark:text-blue-400"
          onClick={() => navigate("/premium")}
        >
          <div className="relative">
            <Crown className="h-4 w-4 text-yellow-500" />
            <motion.div 
              className="absolute inset-0 rounded-full bg-yellow-400/30" 
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 0.4, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <span>Premium Features</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
        <DropdownMenuItem
          className="text-red-600 dark:text-red-400 cursor-pointer flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md m-1 px-2 py-1.5 transition-colors duration-200"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
        <DropdownMenuItem
          className="text-red-600 dark:text-red-400 cursor-pointer flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md m-1 px-2 py-1.5 transition-colors duration-200"
          onClick={() => setIsDeleteDialogOpen(true)}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>Delete Account</span>
        </DropdownMenuItem>
      </DropdownMenuContent>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete your account? This action cannot be undone and you will lose all your data including habits, challenges, and badges.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="sm:w-auto w-full"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="sm:w-auto w-full"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete My Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
