
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import { UserAvatar } from "./user/UserAvatar";
import { UserDropdownContent } from "./user/UserDropdownContent";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export function UserMenu() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<{ 
    full_name: string; 
    avatar_url: string | null;
    total_points: number | null;
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, avatar_url, total_points")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    setProfile(data);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

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
      {profile?.total_points !== null && profile?.total_points !== undefined && (
        <motion.div 
          className="hidden md:flex items-center gap-1 bg-gradient-to-r from-amber-400/20 to-amber-600/20 px-2 py-1 rounded-md"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Trophy size={14} className="text-amber-400" />
          <span className="text-amber-300 font-medium text-sm">{profile.total_points} points</span>
        </motion.div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-none p-0 hover:bg-transparent">
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
