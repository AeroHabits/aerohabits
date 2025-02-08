
import { Card } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BadgeStore } from "./BadgeStore";
import { PointsGuide } from "./PointsGuide";
import { BadgeTabContent } from "./BadgeTabContent";
import { ErrorDisplay } from "./ErrorDisplay";
import { useBadges } from "@/hooks/useBadges";

export function BadgeDisplay() {
  const { badges, isLoading, error, refetchAll } = useBadges();

  if (error) {
    return <ErrorDisplay onRetry={refetchAll} />;
  }

  return (
    <Card className="p-6 bg-white/10 backdrop-blur-sm border-white/20">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h2 className="text-2xl font-bold text-white">Badges & Points Guide</h2>
        </div>

        <Tabs defaultValue="guide" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="guide">Points Guide</TabsTrigger>
            <TabsTrigger value="badges">Your Badges</TabsTrigger>
            <TabsTrigger value="store">Badge Store</TabsTrigger>
          </TabsList>
          
          <TabsContent value="guide" className="mt-4">
            <div className="mb-4">
              <p className="text-sm text-white/80">
                Learn how to earn and use your points to unlock special badges. Complete challenges and maintain streaks to progress!
              </p>
            </div>
            <PointsGuide />
          </TabsContent>
          
          <TabsContent value="badges" className="mt-4">
            <BadgeTabContent badges={badges} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="store" className="mt-4">
            <div className="mb-4">
              <p className="text-sm text-white/80">
                Spend your hard-earned points on exclusive badges. Each badge is unique and shows off your achievements!
              </p>
            </div>
            <BadgeStore />
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
}
