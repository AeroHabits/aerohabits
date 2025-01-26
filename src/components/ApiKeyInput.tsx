import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function ApiKeyInput() {
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter an API key",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem("openai_api_key", apiKey);
    toast({
      title: "Success",
      description: "API key saved successfully",
    });
    setApiKey("");
  };

  return (
    <div className="flex gap-2 items-center">
      <Input
        type="password"
        placeholder="Enter OpenAI API key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="flex-1"
      />
      <Button onClick={handleSave}>Save Key</Button>
    </div>
  );
}