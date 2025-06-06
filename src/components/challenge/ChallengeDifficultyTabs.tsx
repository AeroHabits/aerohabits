
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Crown } from "lucide-react";

interface ChallengeDifficultyTabsProps {
  onDifficultyChange: (difficulty: string) => void;
  currentDifficulty: string;
  canAccessMaster: boolean;
}

const difficultyOrder = ['easy', 'medium', 'hard', 'master'];

export function ChallengeDifficultyTabs({ 
  onDifficultyChange, 
  currentDifficulty,
  canAccessMaster 
}: ChallengeDifficultyTabsProps) {
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
              disabled={false} // All tabs enabled
              className="relative"
            >
              {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              {isMaster && (
                <Crown className="w-3.5 h-3.5 ml-1 inline-block text-amber-300" />
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
