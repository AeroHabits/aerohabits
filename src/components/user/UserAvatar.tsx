
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { GraduationCap } from "lucide-react";

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
        "shadow-lg",
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
          <AvatarFallback className="relative w-full h-full flex items-center justify-center p-0 overflow-hidden">
            {/* Hexagonal design with professional styling */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-700 clip-hexagon"></div>
            
            {/* Subtle inner border */}
            <div className="absolute inset-[1px] bg-gradient-to-br from-indigo-500 to-blue-600 clip-hexagon"></div>
            
            {/* Inner highlight */}
            <div className="absolute inset-0 opacity-30 clip-hexagon">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent"></div>
            </div>
            
            {/* Professional looking achievement icon */}
            <div className="absolute -bottom-1 -right-1 bg-amber-400 rounded-full p-1 shadow-md border border-amber-500 z-10">
              <GraduationCap size={8} className="text-amber-900" />
            </div>
            
            {/* User initials with professional positioning */}
            <div className="relative z-[1] flex items-center justify-center w-full h-full">
              <span className="text-sm font-medium text-white tracking-wider">{initials}</span>
            </div>
            
            {/* Radial glow */}
            <div className="absolute inset-0 bg-radial-glow pointer-events-none clip-hexagon"></div>
          </AvatarFallback>
        )}
      </Avatar>
      
      {/* We need to add these utility classes to the global CSS */}
      <style jsx global>{`
        .clip-hexagon {
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
        }
        
        .bg-radial-glow {
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
        }
      `}</style>
    </motion.div>;
}
