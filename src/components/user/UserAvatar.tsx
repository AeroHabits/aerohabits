
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface UserAvatarProps {
  user: User;
  profile: {
    full_name: string;
    avatar_url?: string | null;
  } | null;
}

export function UserAvatar({
  user,
  profile
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  const initials = profile?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || user.email?.[0].toUpperCase() || "?";

  // iOS detection for animation optimization
  const isIOS = typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  return (
    <Avatar className={cn(
      "border-2 transition-all duration-300",
      "border-indigo-400/50 bg-gradient-to-b from-indigo-500/20 to-purple-600/20"
    )}>
      {profile?.avatar_url && !imageError ? (
        <AvatarImage 
          src={profile.avatar_url} 
          alt={profile?.full_name || "User"} 
          onError={() => setImageError(true)}
          className="object-cover"
        />
      ) : (
        <AvatarFallback 
          className={cn(
            "text-blue-100 bg-gradient-to-br from-indigo-600/30 to-purple-700/30",
            "font-medium"
          )}
        >
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  );
}
