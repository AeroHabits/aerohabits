
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

  const hasAvatar = !!profile?.avatar_url && !imageError;

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
      {hasAvatar ? (
        <motion.div 
          className="h-full w-full overflow-hidden rounded-full"
          whileHover={{ filter: "brightness(1.05)" }}
        >
          <img
            src={profile.avatar_url}
            alt={profile?.full_name || "User"}
            onError={() => setImageError(true)}
            className="object-cover w-full h-full transition-all duration-300"
          />
        </motion.div>
      ) : (
        <div className="relative group cursor-pointer">
          {/* Premium 3D pyramid with enhanced lighting effects */}
          <motion.div
            className="relative"
            whileHover={{ 
              rotateY: [0, 5, -5, 0],
              rotateX: [0, -5, 5, 0]
            }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "mirror"
            }}
          >
            {/* Main pyramid */}
            <div 
              className="h-0 w-0 relative"
              style={{
                borderLeft: '20px solid transparent',
                borderRight: '20px solid transparent',
                borderBottom: '36px solid #3949AB',
                filter: "drop-shadow(0 4px 8px rgba(25, 118, 210, 0.5))",
                transform: "perspective(800px) rotateX(15deg)",
              }}
            >
              {/* Inner pyramid with enhanced gradient */}
              <div 
                className="absolute top-px left-[-18px] h-0 w-0 overflow-hidden"
                style={{ 
                  borderLeft: '18px solid transparent',
                  borderRight: '18px solid transparent',
                  borderBottom: '33px solid transparent',
                  background: `
                    linear-gradient(145deg, 
                    rgba(63, 81, 181, 0.9) 0%, 
                    rgba(48, 63, 159, 0.8) 40%,
                    rgba(26, 35, 126, 0.9) 100%)
                  `
                }}
              />
              
              {/* Front face highlight */}
              <div 
                className="absolute top-0 left-[-20px] h-0 w-0 opacity-80 
                           group-hover:opacity-100 transition-opacity duration-300"
                style={{ 
                  borderLeft: '20px solid transparent',
                  borderRight: '20px solid transparent',
                  borderBottom: '36px solid transparent',
                  background: "linear-gradient(125deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 60%)",
                }}
              />
              
              {/* Dynamic shimmer effect */}
              <div 
                className="absolute top-0 left-[-20px] h-0 w-0
                           opacity-0 group-hover:opacity-70
                           transition-opacity duration-700"
                style={{ 
                  borderLeft: '20px solid transparent',
                  borderRight: '20px solid transparent',
                  borderBottom: '36px solid transparent',
                }}
              >
                <div className="absolute inset-0 animate-shimmer" />
              </div>
              
              {/* Enhanced initials positioning */}
              <div 
                className="absolute top-[14px] left-[-7px] w-14 text-center text-blue-50 font-semibold text-xs tracking-wide"
                style={{ 
                  textShadow: "0 1px 3px rgba(0,0,0,0.4)",
                  letterSpacing: "0.05em",
                  transform: "perspective(800px) rotateX(-5deg)"
                }}
              >
                {initials}
              </div>
            </div>
            
            {/* Subtle floor reflection */}
            <div 
              className="absolute -bottom-1 left-[-12px] w-24 h-1 opacity-40"
              style={{
                background: "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.6) 0%, transparent 70%)",
                filter: "blur(1px)",
                transform: "scaleY(0.5)"
              }}
            />
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
