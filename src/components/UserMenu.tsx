
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { UserPoints } from "./user/UserPoints";
import { UserAvatar } from "./user/UserAvatar";
import { UserDropdownContent } from "./user/UserDropdownContent";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useErrorTracking } from "@/hooks/useErrorTracking";

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ 
    full_name: string; 
    avatar_url: string | null;
    total_points: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { trackError } = useErrorTracking();

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, total_points")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        trackError(error, "fetchProfile", { severity: "medium" });
        return;
      }

      // Ensure we have default values for the profile
      setProfile({
        full_name: data?.full_name || 'User',
        avatar_url: data?.avatar_url || null,
        total_points: data?.total_points || 0
      });
    } catch (error) {
      console.error("Exception in fetchProfile:", error);
      trackError(error as Error, "fetchProfile.exception", { severity: "medium" });
    }
  }, [trackError]);

  useEffect(() => {
    let isMounted = true;
    
    const initializeUserSession = async () => {
      try {
        setIsLoading(true);
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Error getting session:", sessionError);
          trackError(sessionError, "auth.getSession", { severity: "medium" });
          return;
        }
        
        if (session?.user && isMounted) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Error initializing user session:", error);
        trackError(error as Error, "initializeUserSession", { severity: "medium" });
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initializeUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed in UserMenu:", event);
      
      if (event === 'SIGNED_IN' && session?.user && isMounted) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else if (event === 'SIGNED_OUT' && isMounted) {
        setUser(null);
        setProfile(null);
      } else if (event === 'USER_UPDATED' && session?.user && isMounted) {
        setUser(session.user);
        await fetchProfile(session.user.id);
      } else if (event === 'TOKEN_REFRESHED' && session?.user && isMounted) {
        console.log("Token refreshed, updating user data");
        setUser(session.user);
        await fetchProfile(session.user.id);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile, trackError]);

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Error signing out:", error);
        trackError(error, "auth.signOut", { severity: "medium" });
        toast.error("Error signing out. Please try again.");
      } else {
        // Clear any cached user data from localStorage
        localStorage.removeItem('supabase.auth.token');
        toast.success("Successfully signed out");
        navigate("/auth");
      }
    } catch (error) {
      console.error("Exception in signOut:", error);
      trackError(error as Error, "signOut.exception", { severity: "medium" });
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2"
      >
        <div className="w-8 h-8 rounded-full bg-gray-700/50 animate-pulse"></div>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button 
          onClick={() => navigate("/auth")} 
          variant="outline"
          className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 hover:from-blue-500/20 hover:to-indigo-500/20 transition-all duration-300"
        >
          Sign In
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="flex items-center gap-2 md:gap-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <UserPoints points={profile?.total_points || 0} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 md:h-10 md:w-10 rounded-full p-0">
            <UserAvatar user={user} profile={profile} />
          </Button>
        </DropdownMenuTrigger>
        <UserDropdownContent 
          user={user}
          profile={profile}
          setProfile={setProfile}
          onSignOut={handleSignOut}
        />
      </DropdownMenu>
    </motion.div>
  );
}
