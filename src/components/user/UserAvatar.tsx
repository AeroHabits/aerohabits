
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

  const isPyramidSuitableForImage = !!profile?.avatar_url && !imageError;

  return (
    <div className="relative h-10 w-10 flex items-center justify-center">
      {isPyramidSuitableForImage ? (
        <div className="h-full w-full overflow-hidden">
          <div 
            className="w-10 h-10 relative"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              overflow: 'hidden'
            }}
          >
            <img
              src={profile.avatar_url}
              alt={profile?.full_name || "User"}
              onError={() => setImageError(true)}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      ) : (
        <div 
          className={cn(
            "h-0 w-0",
            "border-l-[20px] border-l-transparent",
            "border-r-[20px] border-r-transparent",
            "border-b-[36px]",
            "flex items-center justify-center",
            "border-b-indigo-400 bg-gradient-to-b from-indigo-500/20 to-purple-600/20"
          )}
        >
          <div className="relative bottom-[-22px] text-blue-100 font-medium text-xs">
            {initials}
          </div>
        </div>
      )}
    </div>
  );
}
