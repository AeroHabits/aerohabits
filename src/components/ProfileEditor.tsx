
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
    <div className="flex gap-2 w-full">
      <Input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        className="h-8 text-sm flex-1 bg-gray-50 border-gray-200 focus-visible:ring-indigo-400 dark:bg-gray-800 dark:border-gray-700"
        placeholder="Enter your name"
      />
      <Button
        onClick={() => onSave(newName)}
        size="sm"
        className="h-8 bg-indigo-500 hover:bg-indigo-600 text-xs px-2"
      >
        Save
      </Button>
      <Button
        onClick={onCancel}
        size="sm"
        variant="ghost"
        className="h-8 text-xs px-2"
      >
        Cancel
      </Button>
    </div>
  );
}
