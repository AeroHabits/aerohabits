
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Home } from "lucide-react";

interface UserAvatarProps {
  user: User;
  profile: {
    full_name?: string;
    avatar_url?: string | null;
  } | null;
}

export function UserAvatar({
  user,
  profile
}: UserAvatarProps) {
  const [imageError, setImageError] = useState(false);
  
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
        <AvatarFallback className="relative w-full h-full flex items-center justify-center p-0 overflow-hidden bg-blue-500">
          {/* Gold house icon design */}
          <div className="absolute inset-0 rounded-full bg-blue-500"></div>
          
          {/* Gold house icon */}
          <div className="absolute right-0 bottom-0 w-2/3 h-2/3 flex items-center justify-center">
            <Home size={16} className="text-amber-400" />
          </div>
          
          {/* Subtle highlight */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full"></div>
        </AvatarFallback>
      </Avatar>
    </motion.div>;
}
