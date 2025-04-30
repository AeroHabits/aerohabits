
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
      transition={{ duration: 0.2 }}
    >
      {isPyramidSuitableForImage ? (
        <div className="h-full w-full overflow-hidden">
          <div 
            className="w-10 h-10 relative group"
            style={{
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              overflow: 'hidden'
            }}
          >
            {/* Glowing edge effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-300/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* User image */}
            <img
              src={profile.avatar_url}
              alt={profile?.full_name || "User"}
              onError={() => setImageError(true)}
              className="object-cover w-full h-full transition-all duration-300"
            />
          </div>
        </div>
      ) : (
        <div className="group">
          {/* Base pyramid with more professional gradient */}
          <div 
            className={cn(
              "h-0 w-0",
              "border-l-[20px] border-l-transparent",
              "border-r-[20px] border-r-transparent",
              "border-b-[36px]",
              "flex items-center justify-center relative",
              "border-b-blue-500 transition-all duration-300 group-hover:border-b-indigo-400"
            )}
          >
            {/* Inner gradient effect */}
            <div 
              className="absolute inset-0 h-0 w-0 
                         border-l-[18px] border-l-transparent
                         border-r-[18px] border-r-transparent
                         border-b-[33px]
                         border-b-indigo-600/40" 
              style={{ filter: "blur(0.5px)" }}
            />
            
            {/* Subtle shine effect */}
            <div 
              className="absolute inset-0 h-0 w-0
                         border-l-[20px] border-l-transparent
                         border-r-[20px] border-r-transparent
                         border-b-[36px]
                         border-b-transparent"
              style={{ 
                background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)",
                opacity: 0.6
              }}
            />
            
            {/* Initials */}
            <div className="relative bottom-[-22px] text-blue-50 font-medium text-xs tracking-wide">
              {initials}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
