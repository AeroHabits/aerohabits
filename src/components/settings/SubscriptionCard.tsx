
import { Crown, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function SubscriptionCard() {
  return (
    <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Subscription</CardTitle>
        <CardDescription className="text-gray-300">Premium features coming soon!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-yellow-400" />
              <h3 className="font-medium text-white">Free Plan</h3>
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-200 border-purple-500/30">
                <Timer className="w-3 h-3 mr-1" />
                Coming Soon
              </Badge>
            </div>
            <p className="text-sm text-gray-300">Premium features and subscriptions launching soon!</p>
          </div>
          <Link
            to="/pricing"
            className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            Learn More
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
