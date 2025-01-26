import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileEditorProps {
  initialName: string;
  onSave: (newName: string) => void;
  onCancel: () => void;
}

export function ProfileEditor({ initialName, onSave, onCancel }: ProfileEditorProps) {
  const [newName, setNewName] = useState(initialName);

  return (
    <div className="flex gap-2">
      <Input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="h-8"
      />
      <Button
        onClick={() => onSave(newName)}
        size="sm"
        className="h-8"
      >
        Save
      </Button>
      <Button
        onClick={onCancel}
        size="sm"
        variant="ghost"
        className="h-8"
      >
        Cancel
      </Button>
    </div>
  );
}