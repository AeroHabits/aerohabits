
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";
import { ProfileEditor } from "./ProfileEditor";

type Profile = { 
  full_name: string; 
  avatar_url: string | null;
  total_points: number;
} | null;

interface UserProfileProps {
  user: User;
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
}

export function UserProfile({ user, profile, setProfile }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleUpdateName = async (newName: string) => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: newName })
      .eq("id", user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update name",
        variant: "destructive",
      });
      return;
    }

    setProfile(prev => prev ? { ...prev, full_name: newName } : null);
    setIsEditing(false);
    toast({
      title: "Success",
      description: "Name updated successfully",
    });
  };

  return (
    <div className="flex justify-between items-center">
      {isEditing ? (
        <ProfileEditor
          initialName={profile?.full_name || ""}
          onSave={handleUpdateName}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className="flex flex-col items-start">
            <span className="font-medium text-gray-800 dark:text-gray-200">{profile?.full_name || user.email}</span>
            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[180px]">{user.email}</span>
          </div>
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            size="sm"
            className="h-6 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Edit
          </Button>
        </>
      )}
    </div>
  );
}
