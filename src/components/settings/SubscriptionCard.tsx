
import { Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SubscriptionCard() {
  const handleSubscribe = () => {
    toast.info("Premium subscriptions coming soon!");
  };

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader className="border-b border-white/10">
        <CardTitle className="text-lg font-medium text-white">Premium Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-400" />
          <h3 className="text-sm font-medium text-gray-200">
            Unlock Premium Features
          </h3>
        </div>
        <p className="text-sm text-gray-400">
          Get access to advanced challenges, personalized insights, and exclusive content
        </p>
        <Button 
          onClick={handleSubscribe}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg"
        >
          Coming Soon
        </Button>
      </CardContent>
    </Card>
  );
}
