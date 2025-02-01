import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@supabase/supabase-js";

interface UserAvatarProps {
  user: User;
  profile: { full_name?: string | null; avatar_url?: string | null } | null;
}

export function UserAvatar({ user, profile }: UserAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={profile?.avatar_url || ""} />
      <AvatarFallback>
        {profile?.full_name?.charAt(0) || user.email?.charAt(0)}
      </AvatarFallback>
    </Avatar>
  );
}