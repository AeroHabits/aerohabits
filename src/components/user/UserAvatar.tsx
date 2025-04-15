
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: User;
  profile: { 
    full_name: string; 
    avatar_url?: string | null;
  } | null;
}

export function UserAvatar({ user, profile }: UserAvatarProps) {
  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0].toUpperCase() || "?";

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative inline-block"
    >
      <Avatar className={cn(
        "h-10 w-10 border-2 border-white/20 shadow-lg",
        "overflow-visible" // Ensure content is not cut off
      )}>
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full">
          <AvatarFallback className="bg-transparent text-white font-medium">
            {initials}
          </AvatarFallback>
        </div>
      </Avatar>
    </motion.div>
  );
}
