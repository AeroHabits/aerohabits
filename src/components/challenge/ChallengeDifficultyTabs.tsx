import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
        <TabsTrigger value="medium" onClick={() => onDifficultyChange("medium")}>
          Medium
        </TabsTrigger>
        <TabsTrigger value="hard" onClick={() => onDifficultyChange("hard")}>
          Hard
        </TabsTrigger>
        <TabsTrigger value="master" onClick={() => onDifficultyChange("master")}>
          Master
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}