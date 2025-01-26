import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare } from "lucide-react";

interface AIMotivatorProps {
  habitTitle: string;
  streak: number;
}

export function AIMotivator({ habitTitle, streak }: AIMotivatorProps) {
  const [advice, setAdvice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const getMotivation = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: "You are a motivational coach helping users stay consistent with their habits. Be concise, encouraging, and specific.",
            },
            {
              role: "user",
              content: `I'm trying to maintain my habit of "${habitTitle}". I currently have a ${streak} day streak. Can you give me some motivation and specific tips to keep going?`,
            },
          ],
          max_tokens: 150,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get AI response");
      }

      const data = await response.json();
      setAdvice(data.choices[0].message.content);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI motivation. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 bg-white/70 backdrop-blur-sm border-[#D3E4FD]/50 hover:border-[#33C3F0]/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">AI Coach</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={getMotivation}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          Get Motivation
        </Button>
      </div>
      {advice && (
        <p className="text-sm text-muted-foreground">{advice}</p>
      )}
    </Card>
  );
}