
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Trophy } from "lucide-react";

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
  
  return <motion.div 
    whileHover={{
      scale: isIOS ? 1.02 : 1.05
    }}
    whileTap={{
      scale: isIOS ? 0.98 : 0.95
    }}
    transition={{
      duration: isIOS ? 0.2 : 0.3
    }}
    className="relative inline-block"
  >
      <Avatar className={cn(
        "h-10 w-10 overflow-visible",
        "bg-gradient-to-br from-gray-900 to-gray-700",
        "backdrop-blur-lg shadow-lg",
        "border-2 border-white/20"
      )}>
        {profile?.avatar_url && !imageError ? (
          <AvatarImage 
            src={profile.avatar_url} 
            alt={profile.full_name || "User"} 
            onError={() => setImageError(true)} 
            loading="lazy" 
            decoding="async" 
            className="backdrop-blur-sm"
          />
        ) : (
          <AvatarFallback className="relative w-full h-full flex items-center justify-center">
            {/* Sophisticated inner content with layered design */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/80 to-indigo-700/90 rounded-full"></div>
            
            {/* Subtle geometric pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-6 h-6 bg-white/30 rounded-full transform translate-x-1/4 -translate-y-1/4"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 bg-white/20 rounded-full transform -translate-x-1/4 translate-y-1/4"></div>
            </div>
            
            {/* User initials with professional styling */}
            <span className="relative text-sm font-semibold text-white">{initials}</span>
            
            {/* Achievement indicator positioned in a more balanced way */}
            <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full p-1 shadow-xl border border-amber-600/50 flex items-center justify-center">
              <Trophy size={8} className="text-amber-900" />
            </div>
            
            {/* Subtle highlight effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 rounded-full"></div>
          </AvatarFallback>
        )}
      </Avatar>
    </motion.div>;
}
