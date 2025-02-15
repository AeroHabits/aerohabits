
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock } from "lucide-react";

interface ChallengeDifficultyTabsProps {
  onDifficultyChange: (difficulty: string) => void;
  currentDifficulty: string;
}

const difficultyOrder = ['easy', 'medium', 'hard', 'master'];

export function ChallengeDifficultyTabs({ onDifficultyChange, currentDifficulty }: ChallengeDifficultyTabsProps) {
  const currentIndex = difficultyOrder.indexOf(currentDifficulty.toLowerCase());

  return (
    <Tabs defaultValue="easy" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {difficultyOrder.map((difficulty, index) => {
          const isLocked = index > currentIndex;
          
          return (
            <TabsTrigger
              key={difficulty}
              value={difficulty}
              onClick={() => onDifficultyChange(difficulty)}
              disabled={isLocked}
              className="relative"
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              {isLocked && <Lock className="w-3 h-3 ml-1 inline-block" />}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
