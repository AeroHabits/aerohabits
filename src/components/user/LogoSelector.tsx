
import { Star, Target, Flame, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LogoSelectorProps {
  userId: string;
  onLogoUpdate: (url: string) => void;
}

const availableLogos = [
  {
    id: 'star',
    icon: <Star className="h-12 w-12 text-yellow-500" />,
    name: 'Star'
  },
  {
    id: 'flame',
    icon: <Flame className="h-12 w-12 text-orange-500" />,
    name: 'Flame'
  },
  {
    id: 'target',
    icon: <Target className="h-12 w-12 text-blue-500" />,
    name: 'Target'
  },
  {
    id: 'award',
    icon: <Award className="h-12 w-12 text-purple-500" />,
    name: 'Award'
  }
];

export function LogoSelector({ userId, onLogoUpdate }: LogoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleLogoSelect = async (logoId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: logoId })
        .eq('id', userId);

      if (updateError) throw updateError;

      onLogoUpdate(logoId);
      setIsOpen(false);
      toast({
        title: "Success",
        description: "Profile logo updated successfully",
      });
    } catch (error) {
      console.error('Error updating logo:', error);
      toast({
        title: "Error",
        description: "Failed to update profile logo",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <DropdownMenuItem 
        className="cursor-pointer"
        onClick={() => setIsOpen(true)}
      >
        Change Profile Logo
      </DropdownMenuItem>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choose a Profile Logo</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {availableLogos.map((logo) => (
              <button
                key={logo.id}
                className="flex items-center justify-center aspect-square rounded-lg border-2 border-white/20 hover:border-white/40 transition-all bg-white/5 hover:bg-white/10"
                onClick={() => handleLogoSelect(logo.id)}
              >
                {logo.icon}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
