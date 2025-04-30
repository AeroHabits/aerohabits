
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <motion.div 
      className="relative h-10 w-10 flex items-center justify-center"
      initial={{ scale: 0.95 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 15
      }}
    >
      {isPyramidSuitableForImage ? (
        <motion.div 
          className="h-full w-full overflow-hidden"
          whileHover={{ filter: "brightness(1.05)" }}
        >
          <div 
            className="w-10 h-10 relative group"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              overflow: 'hidden'
            }}
          >
            {/* Ambient glow effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-400/30 via-purple-500/20 to-blue-600/30 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            
            {/* Sharp edge highlight */}
            <div className="absolute inset-0 z-10" style={{
              background: `
                linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 5%, rgba(255,255,255,0) 95%, rgba(255,255,255,0.2) 100%)
              `,
              opacity: 0.4
            }}></div>
            
            {/* User image */}
            <img
              src={profile.avatar_url}
              alt={profile?.full_name || "User"}
              onError={() => setImageError(true)}
              className="object-cover w-full h-full transition-all duration-300 z-0"
            />
          </div>
        </motion.div>
      ) : (
        <div className="group cursor-pointer">
          {/* Premium outer pyramid */}
          <div 
            className={cn(
              "h-0 w-0",
              "border-l-[20px] border-l-transparent",
              "border-r-[20px] border-r-transparent",
              "border-b-[36px]",
              "flex items-center justify-center relative",
              "transition-all duration-300"
            )}
            style={{
              borderBottomColor: '#3B82F6',
              filter: "drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))",
            }}
          >
            {/* Premium inner pyramid with gradient */}
            <div 
              className="absolute inset-0 h-0 w-0 
                         border-l-[18px] border-l-transparent
                         border-r-[18px] border-r-transparent
                         border-b-[33px]"
              style={{ 
                borderBottomColor: 'rgba(79, 70, 229, 0.6)',
                background: `
                  linear-gradient(to bottom, 
                  rgba(79, 70, 229, 0.2) 0%, 
                  rgba(124, 58, 237, 0.4) 50%,
                  rgba(99, 102, 241, 0.6) 100%)
                `
              }}
            />
            
            {/* Premium shine effect */}
            <div 
              className="absolute inset-0 h-0 w-0
                         border-l-[20px] border-l-transparent
                         border-r-[20px] border-r-transparent
                         border-b-[36px]
                         group-hover:opacity-100 opacity-60
                         transition-opacity duration-500"
              style={{ 
                background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 50%)",
                filter: "blur(0.5px)"
              }}
            />
            
            {/* Side shimmer effects */}
            <div className="absolute inset-0 h-0 w-0
                           border-l-[20px] border-l-transparent
                           border-r-[20px] border-r-transparent
                           border-b-[36px]
                           opacity-0 group-hover:opacity-30
                           transition-opacity duration-700">
              <div className="absolute inset-0 animate-shimmer"></div>
            </div>
            
            {/* Initials with improved typography */}
            <div className="relative bottom-[-22px] text-blue-50 font-medium text-xs tracking-wide"
                 style={{ textShadow: "0 1px 2px rgba(0,0,0,0.2)" }}>
              {initials}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
