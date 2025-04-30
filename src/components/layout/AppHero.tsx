
import { motion } from "framer-motion";
import { useProfileLoader } from "./ProfileLoader";
import { HeroTitle } from "./HeroTitle";
import { UserAvatar } from "../user/UserAvatar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";

export function AppHero() {
  const {
    data: profile
  } = useProfileLoader();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Load the authenticated user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    getUser();
  }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative pt-16 md:pt-20 pb-12 md:pb-20 z-10 px-4 md:px-8"
    >
      {/* Refined subtle gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-900/10 to-purple-900/10 opacity-70"></div>
        
        {/* Subtle animated accent elements */}
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 bg-blue-800/10 rounded-full blur-3xl"
          animate={{
            opacity: [0.1, 0.15, 0.1],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        <motion.div
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-800/10 rounded-full blur-3xl"
          animate={{
            opacity: [0.08, 0.12, 0.08],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            delay: 1,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-10">
          <HeroTitle />
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-full max-w-xl mx-auto"
          >
            <div className={cn(
              "h-px bg-gradient-to-r from-transparent via-indigo-300/30 to-transparent",
              "opacity-60"
            )} />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-base md:text-lg text-gray-300/80 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
          >
            Track your custom habits, build consistency, and achieve your highest potential 
            through our sophisticated habit tracking system designed for professionals.
          </motion.p>
          
          {user && profile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="mt-6"
            >
              <UserAvatar 
                user={user} 
                profile={{
                  full_name: profile.full_name || '',
                  avatar_url: profile.avatar_url
                }} 
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
