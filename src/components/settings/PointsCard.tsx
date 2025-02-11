
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PointsGuide } from "@/components/badges/PointsGuide";

export function PointsCard() {
  return (
    <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Points Guide</CardTitle>
        <CardDescription className="text-gray-300">Learn how to earn and spend points</CardDescription>
      </CardHeader>
      <CardContent>
        <PointsGuide />
      </CardContent>
    </Card>
  );
}
