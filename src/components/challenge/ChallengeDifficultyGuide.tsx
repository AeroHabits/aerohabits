import { Card } from "@/components/ui/card";
import { Star, Flame, Award, Crown } from "lucide-react";

export function ChallengeDifficultyGuide() {
  return (
    <Card className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
      <h3 className="text-lg font-semibold mb-3 text-blue-800">Challenge Difficulty Levels</h3>
      <div className="space-y-2 text-sm text-blue-700">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-green-500" />
          <span><strong>Easy:</strong> Perfect for beginners. These challenges help build basic habits with manageable daily tasks.</span>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="h-4 w-4 text-yellow-500" />
          <span><strong>Medium:</strong> For those ready to push themselves. These challenges require more dedication and consistency.</span>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-4 w-4 text-red-500" />
          <span><strong>Hard:</strong> Advanced challenges that test your commitment. These require significant effort and dedication.</span>
        </div>
        <div className="flex items-center gap-2">
          <Crown className="h-4 w-4 text-purple-500" />
          <span><strong>Master:</strong> Elite-level challenges for those seeking the ultimate test. These challenges demand exceptional discipline and unwavering commitment.</span>
        </div>
      </div>
    </Card>
  );
}