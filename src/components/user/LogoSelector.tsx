
import { Check } from "lucide-react";
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
    id: 'robot',
    url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    alt: 'White Robot'
  },
  {
    id: 'code',
    url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7',
    alt: 'Code Display'
  },
  {
    id: 'laptop',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
    alt: 'Laptop Code'
  },
  {
    id: 'workspace',
    url: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
    alt: 'Modern Workspace'
  },
];

export function LogoSelector({ userId, onLogoUpdate }: LogoSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleLogoSelect = async (logoUrl: string) => {
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: logoUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      onLogoUpdate(logoUrl);
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
                className="relative aspect-square overflow-hidden rounded-lg border-2 border-white/20 hover:border-white/40 transition-all"
                onClick={() => handleLogoSelect(logo.url)}
              >
                <img
                  src={logo.url}
                  alt={logo.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
