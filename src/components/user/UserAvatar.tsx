
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

export function UserAvatar({ user, profile }: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0].toUpperCase() || "?";

  // iOS detection for animation optimization
  const isIOS = typeof navigator !== 'undefined' && 
    (/iPad|iPhone|iPod/.test(navigator.userAgent) || 
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));

  return (
    <motion.div
      whileHover={{ scale: isIOS ? 1.02 : 1.05 }}  // Reduced animation for iOS
      whileTap={{ scale: isIOS ? 0.98 : 0.95 }}    // Reduced animation for iOS
      transition={{ duration: isIOS ? 0.2 : 0.3 }} // Faster transition for iOS
      className="relative inline-block"
    >
      <Avatar className={cn(
        "h-10 w-10 border-2 border-white/20 shadow-lg",
        "overflow-visible" // Ensure content is not cut off
      )}>
        {profile?.avatar_url && !imageError ? (
          <AvatarImage 
            src={profile.avatar_url} 
            alt={profile.full_name || "User"}
            onError={() => setImageError(true)}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
            <AvatarFallback className="bg-transparent text-white font-medium">
              {initials}
            </AvatarFallback>
          </div>
        )}
      </Avatar>
    </motion.div>
  );
}
