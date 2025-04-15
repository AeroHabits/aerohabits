
import { User } from "@supabase/supabase-js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion } from "framer-motion";

interface UserAvatarProps {
  user: User;
  profile: { 
    full_name: string; 
    avatar_url: string | null;
    total_points?: number | null;
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
      className="relative"
    >
      <Avatar className="h-10 w-10 border-2 border-white/20 shadow-lg">
        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600">
          <AvatarFallback className="bg-transparent text-white font-medium">
            {initials}
          </AvatarFallback>
        </div>
      </Avatar>
      <motion.div
        className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      />
    </motion.div>
  );
}
