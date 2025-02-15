
import { Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SubscriptionCard() {
  return (
    <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Welcome to AeroHabits</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-400" />
          <h3 className="font-medium text-white">
            Build Better Habits
          </h3>
        </div>
        <p className="text-sm text-gray-300">
          Track your habits, join challenges, and achieve your goals with AeroHabits
        </p>
      </CardContent>
    </Card>
  );
}
