
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
      className="relative h-14 w-14 flex items-center justify-center"
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
          {/* Enhanced 3D pyramid with letter inside */}
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
            {/* Main pyramid - larger size */}
            <div 
              className="relative"
              style={{
                width: "56px",
                height: "48px",
                position: "relative",
                transform: "perspective(800px) rotateX(15deg)",
              }}
            >
              {/* Pyramid shape */}
              <div
                className="absolute"
                style={{
                  width: "0",
                  height: "0",
                  borderLeft: '28px solid transparent',
                  borderRight: '28px solid transparent',
                  borderBottom: '48px solid #3949AB',
                  filter: "drop-shadow(0 6px 12px rgba(25, 118, 210, 0.6))",
                }}
              >
                {/* Inner gradient for depth */}
                <div 
                  className="absolute top-0 left-[-28px]"
                  style={{ 
                    width: "0",
                    height: "0",
                    borderLeft: '28px solid transparent',
                    borderRight: '28px solid transparent',
                    borderBottom: '48px solid transparent',
                    background: `
                      linear-gradient(145deg, 
                      rgba(99, 102, 241, 0.9) 0%, 
                      rgba(79, 70, 229, 0.8) 40%,
                      rgba(67, 56, 202, 0.9) 100%)
                    `
                  }}
                />
                
                {/* Front face highlight */}
                <div 
                  className="absolute top-0 left-[-28px] opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ 
                    width: "0",
                    height: "0",
                    borderLeft: '28px solid transparent',
                    borderRight: '28px solid transparent',
                    borderBottom: '48px solid transparent',
                    background: "linear-gradient(125deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 60%)",
                  }}
                />
                
                {/* Centered initials - positioned directly inside the pyramid */}
                <div 
                  className="absolute text-center text-blue-50 font-bold text-lg tracking-wide"
                  style={{ 
                    width: "56px",
                    top: "14px",
                    left: "-28px",
                    textShadow: "0 1px 3px rgba(0,0,0,0.5)",
                    letterSpacing: "0.05em",
                    zIndex: 10,
                  }}
                >
                  {initials}
                </div>
              </div>
              
              {/* Subtle floor reflection */}
              <div 
                className="absolute -bottom-2 left-[-16px] w-[56px] h-1.5 opacity-40"
                style={{
                  background: "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.7) 0%, transparent 70%)",
                  filter: "blur(1px)",
                  transform: "scaleY(0.5)"
                }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
