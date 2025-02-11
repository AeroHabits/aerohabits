
import { Loader2 } from "lucide-react";

interface SettingsHeaderProps {
  loading: boolean;
}

export function SettingsHeader({ loading }: SettingsHeaderProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <h1 className="text-3xl font-bold mb-8 text-white">Settings</h1>;
}
