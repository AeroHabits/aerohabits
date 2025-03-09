
import { User } from "@supabase/supabase-js";
import { ProfileEditor } from "./ProfileEditor";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "./ui/button";

type Profile = { full_name: string; avatar_url: string | null; total_points: number } | null;

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

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: newName })
        .eq("id", user.id);

      if (error) {
        console.error("Error updating profile:", error);
        toast({
          title: "Error",
          description: "Failed to update name",
          variant: "destructive",
        });
        return;
      }

      setProfile(prev => prev ? { ...prev, full_name: newName } : { full_name: newName, avatar_url: null, total_points: 0 });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Name updated successfully",
      });
    } catch (error) {
      console.error("Exception updating profile:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
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
          <span>{profile?.full_name || user.email}</span>
          <Button
            onClick={() => setIsEditing(true)}
            variant="ghost"
            size="sm"
            className="h-6 px-2"
          >
            Edit
          </Button>
        </>
      )}
    </div>
  );
}
