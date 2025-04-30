
import { motion } from "framer-motion";
import { useProfileLoader } from "./ProfileLoader";
import { HeroTitle } from "./HeroTitle";
import { UserAvatar } from "../user/UserAvatar";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import { Sparkle, Target, Award } from "lucide-react";

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
      className="relative pt-20 md:pt-28 pb-16 md:pb-32 z-10 px-4 md:px-8"
    >
      {/* Enhanced gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-indigo-600/15 opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-tr from-purple-900/30 to-transparent"></div>
        
        {/* Animated accent elements */}
        <motion.div
          className="absolute -top-32 -right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        
        <motion.div
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl"
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 10,
            delay: 1,
            repeat: Infinity,
            repeatType: "mirror",
          }}
        />
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 opacity-20">
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, 0],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Sparkle className="w-7 h-7 text-blue-300" />
          </motion.div>
        </div>
        
        <div className="absolute bottom-20 right-14 opacity-20">
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, -5, 0],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 5,
              delay: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Target className="w-10 h-10 text-blue-200" />
          </motion.div>
        </div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        <div className="flex flex-col items-center space-y-12">
          <HeroTitle />
          
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="w-full max-w-xl mx-auto"
          >
            <div className={cn(
              "h-px bg-gradient-to-r from-transparent via-blue-300/40 to-transparent",
              "opacity-80"
            )} />
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="text-base md:text-lg text-gray-300/90 max-w-2xl mx-auto leading-relaxed font-light tracking-wide"
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
