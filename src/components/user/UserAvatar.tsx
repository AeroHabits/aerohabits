
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
        <div className="group relative cursor-pointer">
          {/* Premium pyramid with enhanced 3D effect */}
          <div 
            className="h-0 w-0 relative"
            style={{
              borderLeft: '20px solid transparent',
              borderRight: '20px solid transparent',
              borderBottom: '36px solid #3B82F6',
              filter: "drop-shadow(0 4px 6px rgba(59, 130, 246, 0.4))",
              transform: "perspective(800px) rotateX(10deg)",
            }}
          >
            {/* Inner pyramid with enhanced gradient */}
            <div 
              className="absolute top-px left-[-18px] h-0 w-0"
              style={{ 
                borderLeft: '18px solid transparent',
                borderRight: '18px solid transparent',
                borderBottom: '33px solid rgba(79, 70, 229, 0.8)',
                background: `
                  linear-gradient(to bottom, 
                  rgba(99, 102, 241, 0.9) 0%, 
                  rgba(79, 70, 229, 0.8) 40%,
                  rgba(67, 56, 202, 0.9) 100%)
                `
              }}
            />
            
            {/* Enhanced shine effect */}
            <div 
              className="absolute top-0 left-[-20px] h-0 w-0
                         group-hover:opacity-100 opacity-60
                         transition-opacity duration-500"
              style={{ 
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderBottom: '36px solid transparent',
                background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)",
                filter: "blur(0.5px)"
              }}
            />
            
            {/* Animated shimmer effect */}
            <div 
              className="absolute top-0 left-[-20px] h-0 w-0
                           opacity-0 group-hover:opacity-40
                           transition-opacity duration-700"
              style={{ 
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderBottom: '36px solid transparent',
              }}
            >
              <div className="absolute inset-0 animate-shimmer"></div>
            </div>
            
            {/* Improved initials with better positioning */}
            <div 
              className="absolute top-[14px] left-[-7px] w-14 text-center text-blue-50 font-medium text-xs tracking-wide"
              style={{ 
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                fontWeight: 600,
                letterSpacing: "0.05em"
              }}
            >
              {initials}
            </div>
          </div>
          
          {/* Subtle ground reflection */}
          <div 
            className="absolute -bottom-1 left-[-12px] w-24 h-1 opacity-30 blur-sm"
            style={{
              background: "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.6) 0%, transparent 70%)"
            }}
          ></div>
        </div>
      )}
    </motion.div>
  );
}
