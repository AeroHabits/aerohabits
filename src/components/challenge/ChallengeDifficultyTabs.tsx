import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles } from "lucide-react";

interface ChallengeDifficultyTabsProps {
  onDifficultyChange: (difficulty: string) => void;
}

export function ChallengeDifficultyTabs({ onDifficultyChange }: ChallengeDifficultyTabsProps) {
  return (
    <Tabs defaultValue="easy" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="easy" onClick={() => onDifficultyChange("easy")}>
          Easy
        </TabsTrigger>
        <TabsTrigger value="medium" onClick={() => onDifficultyChange("medium")} className="flex items-center gap-1">
          Medium
          <Sparkles className="h-3 w-3 text-purple-500" />
        </TabsTrigger>
        <TabsTrigger value="hard" onClick={() => onDifficultyChange("hard")} className="flex items-center gap-1">
          Hard
          <Sparkles className="h-3 w-3 text-purple-500" />
        </TabsTrigger>
        <TabsTrigger value="master" onClick={() => onDifficultyChange("master")} className="flex items-center gap-1">
          Master
          <Sparkles className="h-3 w-3 text-purple-500" />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}