
import { Crown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function SubscriptionCard() {
  const handleSubscribe = () => {
    toast.info("Premium subscriptions coming soon!");
  };

  return (
    <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Premium Subscription</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-400" />
          <h3 className="font-medium text-white">
            Unlock Premium Features
          </h3>
        </div>
        <p className="text-sm text-gray-300">
          Get access to advanced challenges, personalized insights, and exclusive content
        </p>
        <Button 
          onClick={handleSubscribe}
          className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold"
        >
          Coming Soon
        </Button>
      </CardContent>
    </Card>
  );
}
