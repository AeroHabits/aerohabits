
import { User } from "@supabase/supabase-js";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { UserProfile } from "../UserProfile";
import { Crown, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserDropdownContentProps {
  user: User;
  profile: { 
    full_name: string; 
    avatar_url: string | null;
    total_points: number;
  } | null;
  setProfile: React.Dispatch<React.SetStateAction<{
    full_name: string;
    avatar_url: string | null;
    total_points: number;
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
    <DropdownMenuContent className="w-56" align="end">
      <DropdownMenuLabel>
        <UserProfile 
          user={user}
          profile={profile}
          setProfile={setProfile}
        />
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="cursor-pointer"
        onClick={() => navigate("/settings")}
      >
        <Settings className="mr-2 h-4 w-4" />
        Settings
      </DropdownMenuItem>
      <DropdownMenuItem
        className="cursor-pointer font-medium text-blue-600 dark:text-blue-400"
        onClick={() => navigate("/premium")}
      >
        <Crown className="mr-2 h-4 w-4 text-yellow-500" />
        Premium Features
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-red-600 cursor-pointer"
        onClick={onSignOut}
      >
        Sign Out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}
