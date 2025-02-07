
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

interface AvatarUploaderProps {
  userId: string;
  onAvatarUpdate: (url: string) => void;
}

export function AvatarUploader({ userId, onAvatarUpdate }: AvatarUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Delete existing avatar files for this user
      const { data: existingFiles } = await supabase.storage
        .from('avatars')
        .list(userId);

      if (existingFiles?.length) {
        await supabase.storage
          .from('avatars')
          .remove(existingFiles.map(f => `${userId}/${f.name}`));
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '0',
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      onAvatarUpdate(publicUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Error",
        description: "Failed to upload profile picture",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <DropdownMenuItem className="cursor-pointer">
      <label className="cursor-pointer flex items-center w-full">
        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
          className="hidden"
          ref={fileInputRef}
          disabled={isUploading}
        />
        {isUploading ? "Uploading..." : "Change Profile Picture"}
      </label>
    </DropdownMenuItem>
  );
}
