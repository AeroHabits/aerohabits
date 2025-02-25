
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock } from "lucide-react";

interface ChallengeDifficultyTabsProps {
  onDifficultyChange: (difficulty: string) => void;
  currentDifficulty: string;
}

const difficultyOrder = ['easy', 'medium', 'hard', 'master'];

export function ChallengeDifficultyTabs({ onDifficultyChange, currentDifficulty }: ChallengeDifficultyTabsProps) {
  return (
    <Tabs defaultValue="easy" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        {difficultyOrder.map((difficulty) => {
          const isMaster = difficulty === 'master';
          
          return (
            <TabsTrigger
              key={difficulty}
              value={difficulty}
              onClick={() => onDifficultyChange(difficulty)}
              disabled={isMaster && !canAccessMaster}
              className="relative"
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              {isMaster && <Lock className="w-3 h-3 ml-1 inline-block" />}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
