
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Home } from "lucide-react";

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
  
  // Add CSS styles when component mounts
  useEffect(() => {
    // Check if styles already exist to avoid duplicates
    if (!document.getElementById('avatar-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'avatar-styles';
      styleEl.textContent = `
        .circle-glow {
          box-shadow: 0 0 15px rgba(78, 93, 255, 0.5);
        }
        
        .bg-house-gradient {
          background: linear-gradient(135deg, #FFD700 0%, #FFC107 50%, #FF8F00 100%);
        }

        .house-highlight {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, transparent 60%);
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);
  
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
        "h-10 w-10 overflow-visible rounded-full",
        "shadow-lg circle-glow",
        "bg-gradient-to-br from-blue-500 to-blue-700",
        "border-2 border-blue-400/50"
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
            {/* Blue background circle */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full"></div>
            
            {/* Overlay with shine effect */}
            <div className="absolute inset-0 opacity-30 rounded-full">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/30 to-transparent rounded-t-full"></div>
            </div>
            
            {/* Gold house icon in the center */}
            <div className="absolute bottom-1 right-1 transform translate-x-1/4 translate-y-1/4 bg-house-gradient rounded-md p-1.5 shadow-lg border border-amber-400 z-10">
              <Home size={12} className="text-amber-900" />
            </div>
            
            {/* House-shaped highlight */}
            <div className="absolute bottom-1 right-1 transform translate-x-1/4 translate-y-1/4 house-highlight rounded-md p-1.5 opacity-50 z-10">
              <Home size={12} className="text-transparent" />
            </div>
            
            {/* Gold house in the center with slight offset */}
            <div className="absolute left-1/3 top-1/3 transform -translate-x-1/4 -translate-y-1/4 z-[1]">
              <div className="bg-house-gradient p-2 rounded-md shadow-md">
                <Home size={16} className="text-amber-900" />
              </div>
            </div>
            
            {/* User initials with professional positioning (optionally shown) */}
            <div className="relative z-[1] flex items-center justify-center w-full h-full">
              <span className="text-sm font-medium text-white tracking-wider opacity-80">{initials}</span>
            </div>
          </AvatarFallback>
        )}
      </Avatar>
    </motion.div>;
}
