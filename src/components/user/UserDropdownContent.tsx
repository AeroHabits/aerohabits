
import { User } from "@supabase/supabase-js";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserProfile } from "../UserProfile";
import { Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserDropdownContentProps {
  user: User;
  profile: { 
    full_name: string; 
    avatar_url: string | null;
  } | null;
  setProfile: React.Dispatch<React.SetStateAction<{
    full_name: string;
    avatar_url: string | null;
  } | null>>;
  onSignOut: () => Promise<void>;
}

export function UserDropdownContent({ 
  user, 
  profile, 
  setProfile, 
  onSignOut 
}: UserDropdownContentProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenuContent 
      className="w-56 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl p-1 dark:bg-gray-900/95 dark:border-gray-800" 
      align="end"
    >
      <DropdownMenuLabel className="px-2 py-1.5">
        <UserProfile 
          user={user}
          profile={profile}
          setProfile={setProfile}
        />
      </DropdownMenuLabel>
      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
      <DropdownMenuItem
        className="cursor-pointer flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md m-1 px-2 py-1.5 transition-colors duration-200"
        onClick={() => navigate("/settings")}
      >
        <Settings className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        <span>Settings</span>
      </DropdownMenuItem>
      <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-800" />
      <DropdownMenuItem
        className="text-red-600 dark:text-red-400 cursor-pointer flex items-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md m-1 px-2 py-1.5 transition-colors duration-200"
        onClick={onSignOut}
      >
        <LogOut className="h-4 w-4" />
        <span>Sign Out</span>
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
